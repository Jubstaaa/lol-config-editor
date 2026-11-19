//! Named copies of a settings file, kept in the app's own folder.

use std::path::Path;

use crate::config::Answer;

#[derive(serde::Serialize)]
pub struct Profile {
    pub name: String,
    pub path: String,
}

/// A file name that cannot escape the profiles folder. The renderer is not
/// trusted with a path: it sends a name, and only a name survives this.
///
/// Windows rules apply on every platform, so a profile saved on a Mac still
/// opens on Windows: no separators or reserved characters, no device names
/// like `CON`, no control characters, and no leading dots or trailing spaces.
fn file_name_for(name: &str) -> Answer<String> {
    let options = sanitize_filename::Options {
        windows: true,
        truncate: true,
        replacement: "",
    };
    let cleaned = sanitize_filename::sanitize_with_options(name.trim(), options);
    let cleaned = cleaned.trim_matches(['.', ' ']);

    if cleaned.is_empty() {
        return Err("that name has nothing usable in it".into());
    }

    Ok(format!("{cleaned}.json"))
}

pub fn save(folder: &Path, name: &str, settings: &serde_json::Value) -> Answer<Profile> {
    std::fs::create_dir_all(folder)
        .map_err(|error| format!("could not make the profiles folder: {error}"))?;

    let path = folder.join(file_name_for(name)?);
    let body = serde_json::to_string_pretty(settings)
        .map_err(|error| format!("could not turn the settings into JSON: {error}"))?;

    std::fs::write(&path, body).map_err(|error| format!("could not save the profile: {error}"))?;

    Ok(describe(&path))
}

fn describe(path: &Path) -> Profile {
    Profile {
        name: path
            .file_stem()
            .unwrap_or_default()
            .to_string_lossy()
            .into_owned(),
        path: path.to_string_lossy().into_owned(),
    }
}

pub fn list(folder: &Path) -> Vec<Profile> {
    let Ok(entries) = std::fs::read_dir(folder) else {
        return Vec::new();
    };

    let mut found: Vec<Profile> = entries
        .flatten()
        .map(|entry| entry.path())
        .filter(|path| path.extension().is_some_and(|kind| kind == "json"))
        .map(|path| describe(&path))
        .collect();

    found.sort_by_key(|profile| profile.name.to_lowercase());
    found
}

pub fn read(folder: &Path, name: &str) -> Answer<serde_json::Value> {
    crate::config::read(&folder.join(file_name_for(name)?))
}

pub fn delete(folder: &Path, name: &str) -> Answer<()> {
    let path = folder.join(file_name_for(name)?);
    if !path.is_file() {
        return Err(format!("there is no profile called {name}"));
    }

    std::fs::remove_file(&path).map_err(|error| format!("could not delete the profile: {error}"))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn a_name_cannot_climb_out_of_the_profiles_folder() {
        assert_eq!(file_name_for("../../evil").unwrap(), "evil.json");
        assert_eq!(file_name_for(r"..\..\evil").unwrap(), "evil.json");
        assert_eq!(
            file_name_for("C:/Windows/evil").unwrap(),
            "CWindowsevil.json"
        );
    }

    #[test]
    fn characters_windows_forbids_are_dropped() {
        assert_eq!(
            file_name_for(r#"a<b>c:d"e|f?g*h"#).unwrap(),
            "abcdefgh.json"
        );
    }

    #[test]
    fn a_name_with_nothing_usable_is_refused() {
        assert!(file_name_for("").is_err());
        assert!(file_name_for(" . ").is_err());
        assert!(file_name_for("///").is_err());
    }

    #[test]
    fn device_names_windows_reserves_are_refused() {
        for reserved in ["CON", "nul", "Com1", "LPT9", "aux"] {
            assert!(file_name_for(reserved).is_err(), "{reserved} was accepted");
        }
    }

    #[test]
    fn control_characters_are_dropped() {
        assert_eq!(file_name_for("ranked\u{0}\u{7}").unwrap(), "ranked.json");
    }

    #[test]
    fn save_list_read_delete_round_trip() {
        let folder = tempfile::tempdir().unwrap();
        let settings = serde_json::json!({ "files": [] });

        let saved = save(folder.path(), "Ranked", &settings).unwrap();
        save(folder.path(), "aram", &settings).unwrap();

        assert_eq!(saved.name, "Ranked");
        let names: Vec<String> = list(folder.path()).into_iter().map(|p| p.name).collect();
        assert_eq!(names, ["aram", "Ranked"]);
        assert_eq!(read(folder.path(), "Ranked").unwrap(), settings);

        delete(folder.path(), "Ranked").unwrap();
        assert!(delete(folder.path(), "Ranked").is_err());
        assert_eq!(list(folder.path()).len(), 1);
    }

    #[test]
    fn listing_a_folder_that_does_not_exist_is_empty() {
        let folder = tempfile::tempdir().unwrap();
        assert!(list(&folder.path().join("nope")).is_empty());
    }
}
