//! Finding League's config folder without asking the player where it is.

use std::path::{Path, PathBuf};

/// Riot's own record of what it installed where. The launcher writes it on both
/// platforms, so it beats guessing at `C:\Riot Games` — which is only the
/// default, and wrong for anyone who installed to another drive.
fn installs_record() -> PathBuf {
    if cfg!(target_os = "windows") {
        PathBuf::from(r"C:\ProgramData\Riot Games\RiotClientInstalls.json")
    } else {
        PathBuf::from("/Users/Shared/Riot Games/RiotClientInstalls.json")
    }
}

/// The well-known install locations, tried only when Riot's record is missing.
fn fallbacks() -> Vec<PathBuf> {
    if cfg!(target_os = "windows") {
        vec![
            PathBuf::from(r"C:\Riot Games\League of Legends"),
            PathBuf::from(r"D:\Riot Games\League of Legends"),
        ]
    } else {
        vec![PathBuf::from(
            "/Applications/League of Legends.app/Contents/LoL",
        )]
    }
}

/// `.../LeagueClient.app` and `.../LeagueClient.exe` both sit directly in the
/// game folder, so the folder is the entry's parent.
fn game_root_of(client: &str) -> Option<PathBuf> {
    Path::new(client).parent().map(Path::to_path_buf)
}

fn read_record() -> Option<serde_json::Value> {
    let body = std::fs::read_to_string(installs_record()).ok()?;
    serde_json::from_str(&body).ok()
}

/// Every `RiotClientServices` the install record knows about, live first.
pub fn riot_clients_from_record() -> Vec<PathBuf> {
    let Some(record) = read_record() else {
        return Vec::new();
    };

    ["rc_default", "rc_live", "rc_beta"]
        .iter()
        .filter_map(|key| record.get(key)?.as_str().map(PathBuf::from))
        .collect()
}

fn roots_from_record() -> Vec<PathBuf> {
    let Some(record) = read_record() else {
        return Vec::new();
    };

    record
        .get("associated_client")
        .and_then(serde_json::Value::as_object)
        .map(|clients| {
            clients
                .keys()
                .filter_map(|client| game_root_of(client))
                .collect()
        })
        .unwrap_or_default()
}

/// The `PersistedSettings.json` inside a game folder, if the folder holds one.
pub fn settings_in(root: &Path) -> Option<PathBuf> {
    let candidate = root.join("Config").join("PersistedSettings.json");
    candidate.is_file().then_some(candidate)
}

/// Every `PersistedSettings.json` this machine appears to have, best guess first.
pub fn find_all() -> Vec<PathBuf> {
    let mut found: Vec<PathBuf> = Vec::new();

    for root in roots_from_record().into_iter().chain(fallbacks()) {
        if let Some(path) = settings_in(&root) {
            if !found.contains(&path) {
                found.push(path);
            }
        }
    }

    found
}

/// The folder someone picked by hand, accepted whether they chose the game
/// folder or the `Config` folder inside it.
pub fn settings_under(chosen: &Path) -> Option<PathBuf> {
    settings_in(chosen).or_else(|| {
        let direct = chosen.join("PersistedSettings.json");
        direct.is_file().then_some(direct)
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    fn game_folder() -> tempfile::TempDir {
        let root = tempfile::tempdir().unwrap();
        std::fs::create_dir(root.path().join("Config")).unwrap();
        std::fs::write(
            root.path().join("Config").join("PersistedSettings.json"),
            "{}",
        )
        .unwrap();
        root
    }

    #[test]
    fn the_game_folder_or_its_config_folder_are_both_accepted() {
        let root = game_folder();
        let expected = root.path().join("Config").join("PersistedSettings.json");

        assert_eq!(settings_under(root.path()), Some(expected.clone()));
        assert_eq!(settings_under(&root.path().join("Config")), Some(expected));
    }

    #[test]
    fn a_folder_without_settings_is_refused() {
        let empty = tempfile::tempdir().unwrap();
        assert_eq!(settings_under(empty.path()), None);
    }

    #[test]
    fn the_game_folder_is_the_client_executable_s_parent() {
        assert_eq!(
            game_root_of("/Games/League of Legends/LeagueClient.app"),
            Some(PathBuf::from("/Games/League of Legends"))
        );
    }
}
