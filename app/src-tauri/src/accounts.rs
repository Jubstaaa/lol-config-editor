//! Saved Riot accounts: a list in the app's data folder, one session snapshot
//! per account beside it, and passwords only ever in the OS keychain.

use std::path::{Path, PathBuf};

use crate::config::Answer;

const KEYCHAIN_SERVICE: &str = "lol-config-editor";

#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Account {
    pub id: String,
    pub label: String,
    pub riot_id: Option<String>,
    pub region: Option<String>,
    pub username: Option<String>,
    pub has_password: bool,
    pub captured_at: u64,
}

#[derive(Default, serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Store {
    pub accounts: Vec<Account>,
    pub launch_league: bool,
    pub active_id: Option<String>,
}

impl Store {
    pub fn find(&self, id: &str) -> Answer<&Account> {
        self.accounts
            .iter()
            .find(|account| account.id == id)
            .ok_or_else(|| "that account is not saved".to_string())
    }

    pub fn find_mut(&mut self, id: &str) -> Answer<&mut Account> {
        self.accounts
            .iter_mut()
            .find(|account| account.id == id)
            .ok_or_else(|| "that account is not saved".to_string())
    }

    pub fn by_riot_id(&self, riot_id: &str) -> Option<&Account> {
        self.accounts.iter().find(|account| {
            account
                .riot_id
                .as_deref()
                .is_some_and(|known| known.eq_ignore_ascii_case(riot_id))
        })
    }
}

pub fn now() -> u64 {
    std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .map(|elapsed| elapsed.as_secs())
        .unwrap_or_default()
}

pub fn new_id() -> String {
    let nanos = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .map(|elapsed| elapsed.as_nanos())
        .unwrap_or_default();
    format!("{nanos:x}")
}

/// Ids come from the renderer and become folder names, so only hex survives.
fn checked(id: &str) -> Answer<&str> {
    let valid = !id.is_empty() && id.len() <= 32 && id.chars().all(|c| c.is_ascii_hexdigit());
    valid
        .then_some(id)
        .ok_or_else(|| "that account is not saved".to_string())
}

fn store_file(folder: &Path) -> PathBuf {
    folder.join("accounts.json")
}

pub fn load(folder: &Path) -> Answer<Store> {
    let Ok(body) = std::fs::read_to_string(store_file(folder)) else {
        return Ok(Store::default());
    };
    serde_json::from_str(&body)
        .map_err(|error| format!("the saved accounts are unreadable: {error}"))
}

pub fn save(folder: &Path, store: &Store) -> Answer<()> {
    std::fs::create_dir_all(folder)
        .map_err(|error| format!("could not make the accounts folder: {error}"))?;
    let body = serde_json::to_string_pretty(store)
        .map_err(|error| format!("could not write the accounts: {error}"))?;
    std::fs::write(store_file(folder), body)
        .map_err(|error| format!("could not save the accounts: {error}"))
}

pub fn snapshot_path(folder: &Path, id: &str) -> Answer<PathBuf> {
    Ok(folder
        .join(checked(id)?)
        .join("RiotGamesPrivateSettings.yaml"))
}

/// Keeps a copy of a session body for the account, readable only by this user.
pub fn write_snapshot(folder: &Path, id: &str, body: &str) -> Answer<()> {
    let path = snapshot_path(folder, id)?;
    if let Some(parent) = path.parent() {
        std::fs::create_dir_all(parent)
            .map_err(|error| format!("could not make the account folder: {error}"))?;
    }
    std::fs::write(&path, body).map_err(|error| format!("could not save the session: {error}"))?;

    #[cfg(unix)]
    {
        use std::os::unix::fs::PermissionsExt;
        let _ = std::fs::set_permissions(&path, std::fs::Permissions::from_mode(0o600));
    }
    Ok(())
}

pub fn remove_snapshot(folder: &Path, id: &str) -> Answer<()> {
    let account_folder = folder.join(checked(id)?);
    if account_folder.is_dir() {
        std::fs::remove_dir_all(&account_folder)
            .map_err(|error| format!("could not delete the saved session: {error}"))?;
    }
    Ok(())
}

fn keychain(id: &str) -> Answer<keyring::Entry> {
    keyring::Entry::new(KEYCHAIN_SERVICE, checked(id)?)
        .map_err(|error| format!("could not open the keychain: {error}"))
}

pub fn set_password(id: &str, password: &str) -> Answer<()> {
    keychain(id)?
        .set_password(password)
        .map_err(|error| format!("could not save the password: {error}"))
}

pub fn password(id: &str) -> Answer<Option<String>> {
    match keychain(id)?.get_password() {
        Ok(password) => Ok(Some(password)),
        Err(keyring::Error::NoEntry) => Ok(None),
        Err(error) => Err(format!("could not read the password: {error}")),
    }
}

pub fn clear_password(id: &str) -> Answer<()> {
    match keychain(id)?.delete_credential() {
        Ok(()) | Err(keyring::Error::NoEntry) => Ok(()),
        Err(error) => Err(format!("could not remove the password: {error}")),
    }
}
