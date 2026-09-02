# LoL Config Editor

Edit your League of Legends settings without launching the game, save them as
named profiles, and switch between them in one click.

Useful if you play on several accounts, share a machine, or want a different
setup for ranked and for ARAM. Settings apply per machine, so every account on
the PC picks them up.

> Windows and macOS. Updates install themselves — the app checks on startup and
> offers the new version.

## What it edits

League keeps its settings in `Config/PersistedSettings.json`: two files' worth
of `name = value` pairs, one for `Game.cfg` and one for `Input.ini`. This app
reads that file, shows it as controls, and writes it back — changing only the
keys you touched.

It covers essentially all of it: every volume and interface option, combat text,
minimap, scoreboard, chat, emotes, item shop, and all 176 keybinds across both
slots League keeps for each action.

**League only saves what differs from its own defaults**, so a fresh config is
missing most keys. The app knows each setting's default, shows that, and inserts
the key when you change it. A setting you have never touched in game is still
editable here.

### Locking

League rewrites `PersistedSettings.json` every time it exits, which is how
hand-edited settings get lost. The **Locked / Unlocked** button marks the file
read-only so the game cannot overwrite it. Applying settings still works while
locked — the app unlocks, writes, and locks it again.

## Where things live

| Path | What it is |
|---|---|
| `app/src/lib/` | the settings model: read, upsert, keybind parsing, the catalogue. Pure, and fully tested |
| `app/src/features/` | the editor — controls, hotkey tables, profiles |
| `app/src-tauri/src/discovery.rs` | finding League's folder from Riot's own install record |
| `app/src-tauri/src/config.rs` | reading, writing and locking the settings file |
| `app/src-tauri/src/profiles.rs` | named copies, kept in the app's own folder |

The split is deliberate: CI has no League install, so everything that can be
tested without one lives in `app/src/lib/` and never imports a Tauri command.
`app/src/lib/persisted-settings.fixture.json` is a real config the game wrote,
and the tests check the catalogue against it — a control pointed at a key League
does not have fails the build rather than silently doing nothing.

## Running it

```bash
cd app && bun install && bun run tauri dev
```

`bun run lint` type-checks, checks formatting and runs the tests. The Rust side
wants `cargo fmt --check` and `cargo clippy --all-targets -- -D warnings`.

## Releasing

Updates are signed with the project's own key, separate from any Apple or
Windows signing. Two repository secrets are needed once:

- `TAURI_SIGNING_PRIVATE_KEY` — the contents of the private key
- `TAURI_SIGNING_PRIVATE_KEY_PASSWORD` — empty, unless the key was given one

Then tagging is the whole release:

```bash
git tag v2.0.0 && git push origin v2.0.0
```

`release.yml` builds macOS and Windows, stamps the version from the tag into
`package.json`, `tauri.conf.json` and `Cargo.toml`, and opens a draft release
with `latest.json` — which is what installed copies read to find the update.

The macOS build is not signed with an Apple developer certificate, so a
downloaded `.dmg` needs its quarantine flag cleared:

```bash
xattr -dr com.apple.quarantine "/Applications/LoL Config Editor.app"
```

Updates installed by the app itself do not go through the browser and never pick
up that flag, so this only applies to the first install.

## Built with

[Tauri 2](https://tauri.app), React 19, Tailwind v4, and Bun.
