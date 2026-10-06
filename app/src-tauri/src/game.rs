//! The running game: whether a match is on, and applying settings mid-match.
//!
//! The game reads its settings once, when a match loads, and writes them back
//! when it closes — so a file written during a match is both ignored and then
//! overwritten. Applying mid-match therefore closes the game without letting it
//! save, writes the file, and reconnects through the League client, which loads
//! the match again with the new settings.

use std::path::{Path, PathBuf};
use std::time::{Duration, Instant};

use crate::config::{self, Answer};
use crate::riot::{self, Api, Reply};

pub fn in_match() -> bool {
    riot::is_running(riot::GAME)
}

/// The League client keeps its own lockfile in the install folder, two levels
/// above `Config/PersistedSettings.json`.
fn client_lockfile(settings: &Path) -> Option<PathBuf> {
    Some(settings.parent()?.parent()?.join("lockfile"))
}

async fn phase(settings: &Path) -> Option<String> {
    let api = Api::from_lockfile(&client_lockfile(settings)?)?;
    match api.get("/lol-gameflow/v1/gameflow-phase").await {
        Reply::Body(value) => value.as_str().map(str::to_string),
        _ => None,
    }
}

async fn wait_until_closed(timeout: Duration) -> bool {
    let deadline = Instant::now() + timeout;
    while in_match() {
        if Instant::now() > deadline {
            return false;
        }
        tokio::time::sleep(Duration::from_millis(200)).await;
    }
    true
}

async fn wait_for_phase(settings: &Path, wanted: &str, timeout: Duration) -> bool {
    let deadline = Instant::now() + timeout;
    while Instant::now() < deadline {
        if phase(settings).await.as_deref() == Some(wanted) {
            return true;
        }
        tokio::time::sleep(Duration::from_millis(250)).await;
    }
    false
}

/// Closes the game, writes the settings, and rejoins the match. Returns
/// whether the file is still locked, like `config::write`.
pub async fn apply_and_reconnect(settings: &Path, values: &serde_json::Value) -> Answer<bool> {
    riot::kill(riot::GAME);
    if !wait_until_closed(Duration::from_secs(10)).await {
        return Err("the game would not close".into());
    }

    let locked = config::write(settings, values)?;

    // The client offers the reconnect a moment after it notices the game is gone.
    if !wait_for_phase(settings, "Reconnect", Duration::from_secs(20)).await {
        return Err(
            "settings applied, but the League client never offered a reconnect — rejoin from the client".into(),
        );
    }

    let api = client_lockfile(settings)
        .and_then(|path| Api::from_lockfile(&path))
        .ok_or(
            "settings applied, but the League client is not answering — rejoin from the client",
        )?;
    if api.post("/lol-gameflow/v1/reconnect").await != Some(true) {
        return Err(
            "settings applied, but the reconnect was refused — rejoin from the client".into(),
        );
    }
    Ok(locked)
}
