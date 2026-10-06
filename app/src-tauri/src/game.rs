//! The running game: whether a match is on, and applying settings mid-match.
//!
//! The game reads its settings once, when a match loads, and writes them back
//! when it closes — so a file written during a match is both ignored and then
//! overwritten. Applying mid-match therefore closes the game without letting it
//! save, writes the file, and reconnects through the League client, which loads
//! the match again with the new settings.
//!
//! Everything about the match comes from the League client's gameflow phase.

use std::path::{Path, PathBuf};
use std::time::{Duration, Instant};

use crate::config::{self, Answer};
use crate::riot::{self, Api, Reply};

/// Phases in which the game is loaded, or about to be, and owns the settings file.
const MATCH_PHASES: &[&str] = &["GameStart", "InProgress", "Reconnect"];

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

/// False when the League client is closed: no client, no match.
pub async fn in_match(settings: &Path) -> bool {
    phase(settings)
        .await
        .is_some_and(|phase| MATCH_PHASES.contains(&phase.as_str()))
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
    // The game has no way to be told to quit without saving, so it is killed.
    riot::kill(riot::GAME);

    // The client offers the reconnect once it has noticed the game is gone,
    // which is also the sign that nothing will overwrite the file any more.
    if !wait_for_phase(settings, "Reconnect", Duration::from_secs(20)).await {
        return Err(
            "the League client never noticed the game closing — nothing was written".into(),
        );
    }

    let locked = config::write(settings, values)?;

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
