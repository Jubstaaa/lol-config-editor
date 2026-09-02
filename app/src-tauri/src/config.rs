//! Reading and writing League's `PersistedSettings.json`, including the
//! read-only trick players use to stop the game overwriting their settings.

use std::path::Path;

pub type Answer<T> = Result<T, String>;

pub fn read(path: &Path) -> Answer<serde_json::Value> {
    let body = std::fs::read_to_string(path)
        .map_err(|error| format!("could not read {}: {error}", path.display()))?;

    serde_json::from_str(&body)
        .map_err(|error| format!("{} is not readable as settings: {error}", path.display()))
}

pub fn is_locked(path: &Path) -> Answer<bool> {
    std::fs::metadata(path)
        .map(|data| data.permissions().readonly())
        .map_err(|error| format!("could not check {}: {error}", path.display()))
}

/// League rewrites the file every time it exits, so players mark it read-only to
/// keep what they chose. Both platforms agree on `readonly`: on Windows it is the
/// file attribute, on macOS it clears the write bits.
pub fn set_locked(path: &Path, locked: bool) -> Answer<()> {
    let mut permissions = std::fs::metadata(path)
        .map_err(|error| format!("could not check {}: {error}", path.display()))?
        .permissions();

    #[allow(clippy::permissions_set_readonly_false)]
    permissions.set_readonly(locked);

    std::fs::set_permissions(path, permissions)
        .map_err(|error| format!("could not change {}: {error}", path.display()))
}

/// Writes the settings, unlocking first when the file is read-only and putting
/// the lock back afterwards — so applying settings never silently fails on a
/// file the player has deliberately frozen.
pub fn write(path: &Path, settings: &serde_json::Value) -> Answer<bool> {
    let locked = is_locked(path)?;
    if locked {
        set_locked(path, false)?;
    }

    let body = serde_json::to_string_pretty(settings)
        .map_err(|error| format!("could not turn the settings into JSON: {error}"))?;

    let written = std::fs::write(path, body)
        .map_err(|error| format!("could not write {}: {error}", path.display()));

    if locked {
        // Put the lock back even when the write failed, so a failure never
        // leaves the file open for League to overwrite.
        set_locked(path, true)?;
    }

    written.map(|()| locked)
}
