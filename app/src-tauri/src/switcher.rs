//! Capturing a signed-in Riot session and switching between saved ones.

use std::path::Path;
use std::time::Duration;

use tauri::{AppHandle, Emitter};

use crate::accounts::{self, Account};
use crate::config::Answer;
use crate::riot;

#[derive(serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Switched {
    /// False when the saved session was refused; the user signs in by hand, then recaptures.
    pub signed_in: bool,
    pub account: Account,
}

fn progress(app: &AppHandle, message: &str) {
    let _ = app.emit("account-switch-progress", message);
}

fn current_session() -> Answer<String> {
    let body = std::fs::read_to_string(riot::session_file()?)
        .map_err(|_| "the Riot Client has no saved session yet".to_string())?;
    if !riot::holds_session(&body) {
        return Err(
            "the Riot Client is not remembering this sign-in — sign out, sign back in with \"Stay signed in\" checked, then try again"
                .into(),
        );
    }
    Ok(body)
}

/// Saves whoever is signed in to the Riot Client. With `target`, refreshes that
/// account's session instead, and refuses if someone else is signed in.
pub async fn capture(folder: &Path, target: Option<&str>, label: &str) -> Answer<Account> {
    if riot::signed_in().await != Some(true) {
        return Err("sign in to the Riot Client first, with \"Stay signed in\" checked".into());
    }
    let body = current_session()?;
    let identity = riot::identity().await;
    let mut store = accounts::load(folder)?;

    let existing = match target {
        Some(id) => {
            let account = store.find(id)?;
            if let (Some(saved), Some(now)) = (&account.riot_id, &identity.riot_id) {
                if !saved.eq_ignore_ascii_case(now) {
                    return Err(format!(
                        "the Riot Client is signed in as {now}, not {saved}"
                    ));
                }
            }
            Some(id.to_string())
        }
        None => identity
            .riot_id
            .as_deref()
            .and_then(|riot_id| store.by_riot_id(riot_id))
            .map(|account| account.id.clone()),
    };

    let id = match existing {
        Some(id) => id,
        None => {
            let id = accounts::new_id();
            store.accounts.push(Account {
                id: id.clone(),
                label: String::new(),
                riot_id: None,
                region: None,
                captured_at: 0,
            });
            id
        }
    };

    accounts::write_snapshot(folder, &id, &body)?;

    let account = store.find_mut(&id)?;
    if !label.trim().is_empty() {
        account.label = label.trim().to_string();
    }
    account.riot_id = identity.riot_id.or(account.riot_id.take());
    account.region = identity.region.or(account.region.take());
    account.captured_at = accounts::now();
    let account = account.clone();

    store.active_id = Some(id);
    accounts::save(folder, &store)?;
    Ok(account)
}

/// Riot rotates session cookies while signed in, so the outgoing account's
/// snapshot is refreshed before it is replaced. Best effort.
async fn keep_outgoing(folder: &Path) {
    if riot::signed_in().await != Some(true) {
        return;
    }
    let Some(riot_id) = riot::identity().await.riot_id else {
        return;
    };
    let (Ok(store), Ok(body)) = (accounts::load(folder), current_session()) else {
        return;
    };
    if let Some(account) = store.by_riot_id(&riot_id) {
        let _ = accounts::write_snapshot(folder, &account.id, &body);
    }
}

pub async fn switch(app: &AppHandle, folder: &Path, id: &str) -> Answer<Switched> {
    let store = accounts::load(folder)?;
    let target = store.find(id)?.clone();
    let launch_league = store.launch_league;

    progress(app, "Saving the current session");
    keep_outgoing(folder).await;

    progress(app, "Closing Riot Client and League");
    riot::close_all().await?;

    let snapshot = accounts::snapshot_path(folder, id)?;
    let session = riot::session_file()?;
    if snapshot.is_file() {
        if let Some(parent) = session.parent() {
            std::fs::create_dir_all(parent)
                .map_err(|error| format!("could not reach the Riot Client data folder: {error}"))?;
        }
        std::fs::copy(&snapshot, &session)
            .map_err(|error| format!("could not restore the saved session: {error}"))?;
    } else {
        let _ = std::fs::remove_file(&session);
    }

    progress(app, "Starting the Riot Client");
    riot::launch(false)?;
    if !riot::wait_until_up(Duration::from_secs(60)).await {
        return Err("the Riot Client did not start".into());
    }

    progress(app, "Signing in");
    if !riot::wait_until_signed_in(Duration::from_secs(15)).await {
        return Ok(Switched {
            signed_in: false,
            account: target,
        });
    }

    let identity = riot::identity().await;
    let mut store = accounts::load(folder)?;
    if let Ok(body) = current_session() {
        let _ = accounts::write_snapshot(folder, id, &body);
    }
    let account = store.find_mut(id)?;
    account.riot_id = identity.riot_id.or(account.riot_id.take());
    account.region = identity.region.or(account.region.take());
    account.captured_at = accounts::now();
    let account = account.clone();
    store.active_id = Some(id.to_string());
    accounts::save(folder, &store)?;

    if launch_league {
        progress(app, "Launching League");
        riot::launch_league().await?;
    }

    progress(app, "Signed in");
    Ok(Switched {
        signed_in: true,
        account,
    })
}
