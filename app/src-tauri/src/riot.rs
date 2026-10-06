//! The Riot Client from the outside: where it keeps its session, closing and
//! starting it, asking its local API who is signed in, and typing into it.

use std::path::{Path, PathBuf};
use std::process::Command;
use std::time::{Duration, Instant};

use crate::config::Answer;

/// The game itself, as opposed to the League client around it.
#[cfg(target_os = "windows")]
pub const GAME: &str = "League of Legends.exe";
#[cfg(not(target_os = "windows"))]
pub const GAME: &str = "League of Legends";

#[cfg(target_os = "windows")]
const PROCESSES: &[&str] = &[
    GAME,
    "LeagueClientUxRender.exe",
    "LeagueClientUx.exe",
    "LeagueClient.exe",
    "LeagueCrashHandler64.exe",
    "Riot Client.exe",
    "RiotClientUxRender.exe",
    "RiotClientUx.exe",
    "RiotClientCrashHandler.exe",
    "RiotClientServices.exe",
];

#[cfg(not(target_os = "windows"))]
const PROCESSES: &[&str] = &[
    GAME,
    "LeagueClientUxHelper",
    "LeagueClientUx",
    "LeagueClient",
    "Riot Client Helper",
    "Riot Client",
    "RiotClientServices",
];

fn client_folder() -> Answer<PathBuf> {
    #[cfg(target_os = "windows")]
    let base = std::env::var_os("LOCALAPPDATA").map(PathBuf::from);
    #[cfg(not(target_os = "windows"))]
    let base = std::env::var_os("HOME").map(|home| {
        PathBuf::from(home)
            .join("Library")
            .join("Application Support")
    });

    base.map(|base| base.join("Riot Games").join("Riot Client"))
        .ok_or_else(|| "could not find the Riot Client data folder".to_string())
}

/// Where Riot keeps the "Stay signed in" session.
pub fn session_file() -> Answer<PathBuf> {
    Ok(client_folder()?
        .join("Data")
        .join("RiotGamesPrivateSettings.yaml"))
}

fn lockfile() -> Answer<PathBuf> {
    Ok(client_folder()?.join("Config").join("lockfile"))
}

/// Without "Stay signed in" the file holds nothing worth restoring. Older clients
/// keep an `ssid` cookie; newer ones a `psl` refresh token.
pub fn holds_session(body: &str) -> bool {
    body.contains("ssid") || body.contains("refresh_token:")
}

fn client_exe() -> Answer<PathBuf> {
    let fallback = if cfg!(target_os = "windows") {
        PathBuf::from(r"C:\Riot Games\Riot Client\RiotClientServices.exe")
    } else {
        PathBuf::from("/Users/Shared/Riot Games/Riot Client.app/Contents/MacOS/RiotClientServices")
    };

    crate::discovery::riot_clients_from_record()
        .into_iter()
        .chain([fallback])
        .find(|path| path.is_file())
        .ok_or_else(|| "could not find the Riot Client on this machine".to_string())
}

/// A helper process that never flashes a console window on Windows.
fn quiet(program: &str) -> Command {
    #[allow(unused_mut)]
    let mut command = Command::new(program);
    #[cfg(target_os = "windows")]
    {
        use std::os::windows::process::CommandExt;
        command.creation_flags(0x0800_0000);
    }
    command
}

/// Lowercased names of everything running.
pub fn running() -> Vec<String> {
    #[cfg(target_os = "windows")]
    let output = quiet("tasklist").args(["/FO", "CSV", "/NH"]).output();
    #[cfg(not(target_os = "windows"))]
    let output = quiet("ps").args(["-axc", "-o", "comm="]).output();

    let Ok(output) = output else {
        return Vec::new();
    };

    String::from_utf8_lossy(&output.stdout)
        .lines()
        .filter_map(|line| {
            let line = line.trim();
            if cfg!(target_os = "windows") {
                line.strip_prefix('"')?.split('"').next()
            } else {
                Some(line)
            }
        })
        .map(str::to_lowercase)
        .collect()
}

pub fn is_running(name: &str) -> bool {
    running().contains(&name.to_lowercase())
}

/// Force-closes a process by name, without giving it the chance to save anything.
pub fn kill(name: &str) {
    #[cfg(target_os = "windows")]
    let _ = quiet("taskkill").args(["/F", "/T", "/IM", name]).output();
    #[cfg(not(target_os = "windows"))]
    let _ = quiet("pkill").args(["-9", "-x", name]).output();
}

fn any_riot_running() -> bool {
    let running = running();
    PROCESSES
        .iter()
        .any(|name| running.contains(&name.to_lowercase()))
}

/// Force-closes Riot and League so neither rewrites the session on the way out.
pub async fn close_all() -> Answer<()> {
    for name in PROCESSES {
        kill(name);
    }

    let deadline = Instant::now() + Duration::from_secs(15);
    while any_riot_running() {
        if Instant::now() > deadline {
            return Err("Riot Client or League would not close".into());
        }
        tokio::time::sleep(Duration::from_millis(300)).await;
    }

    // A killed client leaves its lockfile behind, pointing at a dead port.
    if let Ok(path) = lockfile() {
        let _ = std::fs::remove_file(path);
    }
    Ok(())
}

pub fn launch(league: bool) -> Answer<()> {
    let mut command = Command::new(client_exe()?);
    if league {
        command.args([
            "--launch-product=league_of_legends",
            "--launch-patchline=live",
        ]);
    }

    command
        .spawn()
        .map(|_| ())
        .map_err(|error| format!("could not start the Riot Client: {error}"))
}

/// Asks a signed-in client to start League. The command-line flag is ignored
/// when the client starts signed out, so this runs only after sign-in.
pub async fn launch_league() -> Answer<()> {
    let asked = match Api::connect() {
        Some(api) => api
            .post("/product-launcher/v1/products/league_of_legends/patchlines/live")
            .await
            .unwrap_or(false),
        None => false,
    };

    if asked {
        Ok(())
    } else {
        // A second start hands the flags to the running client, like a desktop shortcut.
        launch(true)
    }
}

#[derive(Default)]
pub struct Identity {
    pub riot_id: Option<String>,
    pub region: Option<String>,
}

/// A Riot local API — the Riot Client's, or the League client's — reached
/// through the port and password its lockfile names.
pub struct Api {
    http: reqwest::Client,
    port: u16,
    password: String,
}

pub enum Reply {
    Unreachable,
    Refused,
    Body(serde_json::Value),
}

impl Api {
    /// Reads the lockfile fresh each time: the client may restart on a new port.
    fn connect() -> Option<Api> {
        Api::from_lockfile(&lockfile().ok()?)
    }

    pub fn from_lockfile(path: &Path) -> Option<Api> {
        let body = std::fs::read_to_string(path).ok()?;
        let parts: Vec<&str> = body.trim().split(':').collect();
        if parts.len() < 5 {
            return None;
        }

        // The client serves a self-signed certificate, and only on loopback.
        let http = reqwest::Client::builder()
            .danger_accept_invalid_certs(true)
            .timeout(Duration::from_secs(3))
            .build()
            .ok()?;

        Some(Api {
            http,
            port: parts[2].parse().ok()?,
            password: parts[3].to_string(),
        })
    }

    pub async fn get(&self, path: &str) -> Reply {
        let sent = self
            .http
            .get(format!("https://127.0.0.1:{}{path}", self.port))
            .basic_auth("riot", Some(&self.password))
            .send()
            .await;

        match sent {
            Err(_) => Reply::Unreachable,
            Ok(response) if !response.status().is_success() => Reply::Refused,
            Ok(response) => response.json().await.map_or(Reply::Refused, Reply::Body),
        }
    }

    async fn body(&self, path: &str) -> Option<serde_json::Value> {
        match self.get(path).await {
            Reply::Body(value) => Some(value),
            _ => None,
        }
    }

    pub async fn post(&self, path: &str) -> Option<bool> {
        let response = self
            .http
            .post(format!("https://127.0.0.1:{}{path}", self.port))
            .basic_auth("riot", Some(&self.password))
            .send()
            .await
            .ok()?;
        Some(response.status().is_success())
    }
}

/// `Some(true)` signed in, `Some(false)` up but signed out, `None` not answering.
pub async fn signed_in() -> Option<bool> {
    match Api::connect()?.get("/rso-auth/v1/authorization").await {
        Reply::Unreachable => None,
        Reply::Refused => Some(false),
        Reply::Body(_) => Some(true),
    }
}

/// Waits until the client answers at all, signed in or not.
pub async fn wait_until_up(timeout: Duration) -> bool {
    let deadline = Instant::now() + timeout;
    while Instant::now() < deadline {
        if signed_in().await.is_some() {
            return true;
        }
        tokio::time::sleep(Duration::from_millis(500)).await;
    }
    false
}

pub async fn wait_until_signed_in(timeout: Duration) -> bool {
    let deadline = Instant::now() + timeout;
    while Instant::now() < deadline {
        if signed_in().await == Some(true) {
            return true;
        }
        tokio::time::sleep(Duration::from_millis(750)).await;
    }
    false
}

fn riot_id_of(value: &serde_json::Value) -> Option<String> {
    let name = value.get("game_name")?.as_str()?;
    let tag = value.get("tag_line")?.as_str()?;
    (!name.is_empty()).then(|| format!("{name}#{tag}"))
}

pub async fn identity() -> Identity {
    let Some(api) = Api::connect() else {
        return Identity::default();
    };

    let mut riot_id = api
        .body("/player-account/aliases/v1/active")
        .await
        .and_then(|value| riot_id_of(&value));

    if riot_id.is_none() {
        // `userInfo` is JSON packed inside a JSON string.
        riot_id = api
            .body("/rso-auth/v1/authorization/userinfo")
            .await
            .and_then(|value| {
                serde_json::from_str::<serde_json::Value>(value.get("userInfo")?.as_str()?).ok()
            })
            .and_then(|info| riot_id_of(info.get("acct")?));
    }

    let region = api
        .body("/riotclient/region-locale")
        .await
        .and_then(|value| Some(value.get("region")?.as_str()?.to_uppercase()))
        .filter(|region| !region.is_empty());

    Identity { riot_id, region }
}
