mod accounts;
mod config;
mod discovery;
mod profiles;
mod riot;
mod switcher;

use std::path::{Path, PathBuf};
use std::sync::Mutex;

use tauri::{AppHandle, Manager, State};

use config::Answer;
use profiles::Profile;

/// The settings file this session is pointed at.
///
/// Held in one place and read on every command. The first version cached the
/// path in a module constant at startup, so picking a new folder mid-session
/// left "Apply" writing to the old one until the app was restarted.
#[derive(Default)]
struct Chosen(Mutex<Option<PathBuf>>);

#[derive(serde::Serialize)]
struct Located {
    path: String,
    locked: bool,
}

fn remembered_file(app: &AppHandle) -> Answer<PathBuf> {
    let folder = app
        .path()
        .app_config_dir()
        .map_err(|error| format!("this machine has no config folder: {error}"))?;

    Ok(folder.join("chosen-path.json"))
}

fn remember(app: &AppHandle, path: &Path) -> Answer<()> {
    let file = remembered_file(app)?;
    if let Some(parent) = file.parent() {
        std::fs::create_dir_all(parent)
            .map_err(|error| format!("could not make the config folder: {error}"))?;
    }

    let body = serde_json::json!({ "configPath": path.to_string_lossy() });
    std::fs::write(&file, body.to_string())
        .map_err(|error| format!("could not remember that folder: {error}"))
}

fn recall(app: &AppHandle) -> Option<PathBuf> {
    let body = std::fs::read_to_string(remembered_file(app).ok()?).ok()?;
    let record: serde_json::Value = serde_json::from_str(&body).ok()?;
    let path = PathBuf::from(record.get("configPath")?.as_str()?);

    path.is_file().then_some(path)
}

fn profiles_folder(app: &AppHandle) -> Answer<PathBuf> {
    app.path()
        .app_data_dir()
        .map(|folder| folder.join("profiles"))
        .map_err(|error| format!("this machine has no data folder: {error}"))
}

fn active(chosen: &State<Chosen>) -> Answer<PathBuf> {
    chosen
        .0
        .lock()
        .map_err(|_| "the settings file is busy".to_string())?
        .clone()
        .ok_or_else(|| "no settings file has been chosen yet".to_string())
}

fn locate(path: PathBuf) -> Answer<Located> {
    Ok(Located {
        locked: config::is_locked(&path)?,
        path: path.to_string_lossy().into_owned(),
    })
}

/// The settings file to start with: whatever was chosen last, else whatever
/// Riot's own install record points at.
#[tauri::command]
fn find_config(app: AppHandle, chosen: State<Chosen>) -> Answer<Option<Located>> {
    let Some(path) = recall(&app).or_else(|| discovery::find_all().into_iter().next()) else {
        return Ok(None);
    };

    *chosen
        .0
        .lock()
        .map_err(|_| "the settings file is busy".to_string())? = Some(path.clone());
    locate(path).map(Some)
}

/// Point the app at a folder someone picked by hand.
#[tauri::command]
fn use_folder(app: AppHandle, chosen: State<Chosen>, folder: String) -> Answer<Located> {
    let path = discovery::settings_under(Path::new(&folder)).ok_or_else(|| {
        "no PersistedSettings.json in there — pick your League of Legends folder".to_string()
    })?;

    *chosen
        .0
        .lock()
        .map_err(|_| "the settings file is busy".to_string())? = Some(path.clone());
    remember(&app, &path)?;
    locate(path)
}

#[tauri::command]
fn read_config(chosen: State<Chosen>) -> Answer<serde_json::Value> {
    config::read(&active(&chosen)?)
}

/// Writes the settings back to League. Returns whether the file is still locked.
#[tauri::command]
fn apply_config(chosen: State<Chosen>, settings: serde_json::Value) -> Answer<bool> {
    config::write(&active(&chosen)?, &settings)
}

#[tauri::command]
fn set_lock(chosen: State<Chosen>, locked: bool) -> Answer<bool> {
    let path = active(&chosen)?;
    config::set_locked(&path, locked)?;
    config::is_locked(&path)
}

#[tauri::command]
fn list_profiles(app: AppHandle) -> Answer<Vec<Profile>> {
    Ok(profiles::list(&profiles_folder(&app)?))
}

#[tauri::command]
fn save_profile(app: AppHandle, name: String, settings: serde_json::Value) -> Answer<Profile> {
    profiles::save(&profiles_folder(&app)?, &name, &settings)
}

#[tauri::command]
fn read_profile(app: AppHandle, name: String) -> Answer<serde_json::Value> {
    profiles::read(&profiles_folder(&app)?, &name)
}

#[tauri::command]
fn delete_profile(app: AppHandle, name: String) -> Answer<()> {
    profiles::delete(&profiles_folder(&app)?, &name)
}

fn accounts_folder(app: &AppHandle) -> Answer<PathBuf> {
    app.path()
        .app_data_dir()
        .map(|folder| folder.join("accounts"))
        .map_err(|error| format!("this machine has no data folder: {error}"))
}

#[tauri::command]
fn list_accounts(app: AppHandle) -> Answer<accounts::Store> {
    accounts::load(&accounts_folder(&app)?)
}

/// Saves whoever is signed in to the Riot Client right now.
#[tauri::command]
async fn capture_account(
    app: AppHandle,
    label: String,
    username: Option<String>,
    password: Option<String>,
) -> Answer<accounts::Account> {
    let details = switcher::Capture {
        label,
        username,
        password,
    };
    switcher::capture(&accounts_folder(&app)?, None, details).await
}

#[tauri::command]
async fn recapture_account(app: AppHandle, id: String) -> Answer<accounts::Account> {
    let details = switcher::Capture {
        label: String::new(),
        username: None,
        password: None,
    };
    switcher::capture(&accounts_folder(&app)?, Some(&id), details).await
}

/// An empty password leaves the saved one alone; `forget_password` removes it.
#[tauri::command]
fn update_account(
    app: AppHandle,
    id: String,
    label: String,
    region: Option<String>,
    username: Option<String>,
    password: Option<String>,
    forget_password: bool,
) -> Answer<accounts::Account> {
    let folder = accounts_folder(&app)?;
    let mut store = accounts::load(&folder)?;
    let account = store.find_mut(&id)?;

    account.label = label.trim().to_string();
    account.region = region
        .map(|region| region.trim().to_uppercase())
        .filter(|region| !region.is_empty());
    account.username = username
        .map(|name| name.trim().to_string())
        .filter(|name| !name.is_empty());

    if forget_password {
        accounts::clear_password(&id)?;
        account.has_password = false;
    } else if let Some(password) = password.filter(|password| !password.is_empty()) {
        accounts::set_password(&id, &password)?;
        account.has_password = true;
    }

    let account = account.clone();
    accounts::save(&folder, &store)?;
    Ok(account)
}

#[tauri::command]
fn delete_account(app: AppHandle, id: String) -> Answer<()> {
    let folder = accounts_folder(&app)?;
    let mut store = accounts::load(&folder)?;
    store.find(&id)?;

    accounts::clear_password(&id)?;
    accounts::remove_snapshot(&folder, &id)?;
    store.accounts.retain(|account| account.id != id);
    if store.active_id.as_deref() == Some(id.as_str()) {
        store.active_id = None;
    }
    accounts::save(&folder, &store)
}

#[tauri::command]
fn set_launch_league(app: AppHandle, launch: bool) -> Answer<()> {
    let folder = accounts_folder(&app)?;
    let mut store = accounts::load(&folder)?;
    store.launch_league = launch;
    accounts::save(&folder, &store)
}

#[tauri::command]
async fn switch_account(app: AppHandle, id: String) -> Answer<switcher::Switched> {
    let folder = accounts_folder(&app)?;
    switcher::switch(&app, &folder, &id).await
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .manage(Chosen::default())
        .invoke_handler(tauri::generate_handler![
            find_config,
            use_folder,
            read_config,
            apply_config,
            set_lock,
            list_profiles,
            save_profile,
            read_profile,
            delete_profile,
            list_accounts,
            capture_account,
            recapture_account,
            update_account,
            delete_account,
            set_launch_league,
            switch_account,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
