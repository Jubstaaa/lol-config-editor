# Contributing

Thanks for wanting to help. Bug reports, ideas and pull requests are all welcome.

By contributing you agree that your work is released under the project's
[MIT License](LICENSE).

## Before you start

For anything bigger than a small fix, open an issue first and say what you have
in mind. It saves you building something that does not fit the app.

The app only touches files on your own machine and the Riot Client's local API.
Changes that read game memory, automate gameplay or send anything off the
machine will not be merged: they put players' accounts at risk.

## Setting up

```bash
cd app && bun install && bun run tauri dev
```

The README's [Where things live](README.md#where-things-live) table says which
file does what.

## Before opening a pull request

Run the same checks CI runs:

```bash
cd app && bun run lint
cd src-tauri && cargo fmt --check && cargo clippy --all-targets -- -D warnings
```

- Keep anything that can be tested without League in `app/src/lib/`, with tests
  beside it. CI has no League install.
- Tauri commands in `lib.rs` stay one line and hand the work to their module.
- Use [Conventional Commits](https://www.conventionalcommits.org):
  `feat(accounts): …`, `fix(config): …`.
- Update the README when behaviour changes.

## Testing on Windows

Most players are on Windows. If you cannot build there, a maintainer can run the
`windows test build` workflow on your branch; it produces an unsigned exe to try
on a real League install. In the pull request, say what you tested and how.

## How pull requests land

Maintainers may push small fixes to your branch before merging, so leave
"Allow edits by maintainers" on. Pull requests are squash-merged and released
with the next version tag.
