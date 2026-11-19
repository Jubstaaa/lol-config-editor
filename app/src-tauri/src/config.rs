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

#[cfg(test)]
mod tests {
    use super::*;

    const SETTINGS: &str = r#"{"description":"","files":[{"name":"Input.ini","sections":[{"name":"GameEvents","settings":[{"name":"evtCastSpell1","value":"[q]"}]}]}]}"#;

    fn settings_file(folder: &tempfile::TempDir) -> std::path::PathBuf {
        let path = folder.path().join("PersistedSettings.json");
        std::fs::write(&path, SETTINGS).unwrap();
        path
    }

    #[test]
    fn write_then_read_returns_the_same_settings() {
        let folder = tempfile::tempdir().unwrap();
        let path = settings_file(&folder);
        let mut settings = read(&path).unwrap();
        settings["files"][0]["sections"][0]["settings"][0]["value"] = "[w]".into();

        let still_locked = write(&path, &settings).unwrap();

        assert!(!still_locked);
        assert_eq!(read(&path).unwrap(), settings);
    }

    #[test]
    fn writing_a_locked_file_succeeds_and_keeps_it_locked() {
        let folder = tempfile::tempdir().unwrap();
        let path = settings_file(&folder);
        set_locked(&path, true).unwrap();
        let settings = read(&path).unwrap();

        assert!(write(&path, &settings).unwrap());
        assert!(is_locked(&path).unwrap());

        set_locked(&path, false).unwrap();
        assert!(!is_locked(&path).unwrap());
    }

    #[test]
    fn a_file_that_is_not_json_is_refused_with_its_path() {
        let folder = tempfile::tempdir().unwrap();
        let path = folder.path().join("PersistedSettings.json");
        std::fs::write(&path, "not json").unwrap();

        let error = read(&path).unwrap_err();

        assert!(error.contains("PersistedSettings.json"), "{error}");
    }

    #[test]
    fn a_missing_file_is_an_error_not_a_panic() {
        let folder = tempfile::tempdir().unwrap();
        let path = folder.path().join("missing.json");

        assert!(read(&path).is_err());
        assert!(is_locked(&path).is_err());
    }
}
