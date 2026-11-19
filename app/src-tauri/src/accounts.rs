//! Saved Riot accounts: a list in the app's data folder, one session snapshot
//! per account beside it. No passwords are ever stored.

use std::path::{Path, PathBuf};

use crate::config::Answer;

#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Account {
    pub id: String,
    pub label: String,
    pub riot_id: Option<String>,
    pub region: Option<String>,
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

fn remove_snapshot(folder: &Path, id: &str) -> Answer<()> {
    let account_folder = folder.join(checked(id)?);
    if account_folder.is_dir() {
        std::fs::remove_dir_all(&account_folder)
            .map_err(|error| format!("could not delete the saved session: {error}"))?;
    }
    Ok(())
}

pub fn update(folder: &Path, id: &str, label: &str, region: Option<String>) -> Answer<Account> {
    let mut store = load(folder)?;
    let account = store.find_mut(id)?;

    account.label = label.trim().to_string();
    account.region = region
        .map(|region| region.trim().to_uppercase())
        .filter(|region| !region.is_empty());

    let account = account.clone();
    save(folder, &store)?;
    Ok(account)
}

pub fn delete(folder: &Path, id: &str) -> Answer<()> {
    let mut store = load(folder)?;
    store.find(id)?;

    remove_snapshot(folder, id)?;
    store.accounts.retain(|account| account.id != id);
    if store.active_id.as_deref() == Some(id) {
        store.active_id = None;
    }
    save(folder, &store)
}

pub fn set_launch_league(folder: &Path, launch: bool) -> Answer<()> {
    let mut store = load(folder)?;
    store.launch_league = launch;
    save(folder, &store)
}

#[cfg(test)]
mod tests {
    use super::*;

    fn account(id: &str, riot_id: Option<&str>) -> Account {
        Account {
            id: id.into(),
            label: String::new(),
            riot_id: riot_id.map(Into::into),
            region: None,
            captured_at: 0,
        }
    }

    fn store_with(folder: &Path, accounts: Vec<Account>) {
        save(
            folder,
            &Store {
                accounts,
                launch_league: false,
                active_id: None,
            },
        )
        .unwrap();
    }

    #[test]
    fn ids_that_are_not_short_hex_never_become_paths() {
        let folder = Path::new("accounts");
        for bad in ["", "../x", "abc/def", "zz", &"a".repeat(33)] {
            assert!(snapshot_path(folder, bad).is_err(), "{bad} was accepted");
        }
        assert!(snapshot_path(folder, &new_id()).is_ok());
    }

    #[test]
    fn a_missing_store_loads_empty() {
        let folder = tempfile::tempdir().unwrap();
        let store = load(folder.path()).unwrap();
        assert!(store.accounts.is_empty());
        assert!(!store.launch_league);
    }

    #[test]
    fn a_corrupt_store_is_reported_not_silently_emptied() {
        let folder = tempfile::tempdir().unwrap();
        std::fs::write(folder.path().join("accounts.json"), "{").unwrap();
        assert!(load(folder.path()).is_err());
    }

    #[test]
    fn the_store_round_trips_in_the_shape_the_renderer_reads() {
        let folder = tempfile::tempdir().unwrap();
        store_with(folder.path(), vec![account("a1", Some("Faker#KR1"))]);

        let body = std::fs::read_to_string(folder.path().join("accounts.json")).unwrap();
        assert!(body.contains("\"riotId\""), "{body}");
        assert!(body.contains("\"launchLeague\""), "{body}");
        assert_eq!(load(folder.path()).unwrap().accounts[0].id, "a1");
    }

    #[test]
    fn riot_ids_match_ignoring_case() {
        let store = Store {
            accounts: vec![account("a1", Some("Faker#KR1"))],
            ..Store::default()
        };
        assert!(store.by_riot_id("faker#kr1").is_some());
        assert!(store.by_riot_id("Other#EUW").is_none());
    }

    #[test]
    fn update_trims_the_label_and_normalises_the_region() {
        let folder = tempfile::tempdir().unwrap();
        store_with(folder.path(), vec![account("a1", None)]);

        let updated = update(folder.path(), "a1", "  Main ", Some(" euw ".into())).unwrap();
        assert_eq!(updated.label, "Main");
        assert_eq!(updated.region.as_deref(), Some("EUW"));

        let cleared = update(folder.path(), "a1", "Main", Some("  ".into())).unwrap();
        assert_eq!(cleared.region, None);
    }

    #[test]
    fn delete_removes_the_account_its_session_and_the_active_mark() {
        let folder = tempfile::tempdir().unwrap();
        save(
            folder.path(),
            &Store {
                accounts: vec![account("a1", None), account("b2", None)],
                launch_league: true,
                active_id: Some("a1".into()),
            },
        )
        .unwrap();
        write_snapshot(folder.path(), "a1", "ssid: x").unwrap();

        delete(folder.path(), "a1").unwrap();

        let store = load(folder.path()).unwrap();
        assert_eq!(store.accounts.len(), 1);
        assert_eq!(store.active_id, None);
        assert!(store.launch_league);
        assert!(!folder.path().join("a1").exists());
        assert!(delete(folder.path(), "a1").is_err());
    }

    #[cfg(unix)]
    #[test]
    fn a_saved_session_is_readable_only_by_this_user() {
        use std::os::unix::fs::PermissionsExt;

        let folder = tempfile::tempdir().unwrap();
        write_snapshot(folder.path(), "a1", "ssid: x").unwrap();

        let mode = std::fs::metadata(snapshot_path(folder.path(), "a1").unwrap())
            .unwrap()
            .permissions()
            .mode();
        assert_eq!(mode & 0o777, 0o600);
    }
}
