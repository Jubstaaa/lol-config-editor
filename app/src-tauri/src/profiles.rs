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
fn file_name_for(name: &str) -> Answer<String> {
    let trimmed = name.trim();
    let cleaned: String = trimmed
        .chars()
        .filter(|letter| !matches!(letter, '/' | '\\' | ':' | '*' | '?' | '"' | '<' | '>' | '|'))
        .collect();
    let cleaned = cleaned.trim_matches(['.', ' ']).to_owned();

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
