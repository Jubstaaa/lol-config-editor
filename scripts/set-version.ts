/**
 * Stamps one version across the three files that carry it, from the git tag.
 *
 * Usage: bun run scripts/set-version.ts v2.1.0
 */

const tag = process.argv[2]
if (!tag) {
    console.error('usage: set-version.ts <tag>')
    process.exit(1)
}

const version = tag.replace(/^v/, '')
if (!/^\d+\.\d+\.\d+$/.test(version)) {
    console.error(`"${tag}" is not a version tag like v2.1.0`)
    process.exit(1)
}

const edits: [string, RegExp, string][] = [
    ['app/package.json', /("version":\s*")[^"]+(")/, `$1${version}$2`],
    ['app/src-tauri/tauri.conf.json', /("version":\s*")[^"]+(")/, `$1${version}$2`],
    ['app/src-tauri/Cargo.toml', /^(version = ")[^"]+(")/m, `$1${version}$2`],
]

for (const [path, pattern, replacement] of edits) {
    const file = Bun.file(path)
    const before = await file.text()

    // Test the pattern rather than comparing before and after: re-tagging the
    // version the files already carry is a no-op, not a failure.
    if (!pattern.test(before)) {
        console.error(`${path}: no version line to stamp`)
        process.exit(1)
    }

    await Bun.write(path, before.replace(pattern, replacement))
    console.log(`${path} -> ${version}`)
}
