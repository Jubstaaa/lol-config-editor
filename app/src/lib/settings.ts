import type { ConfigFile, ConfigSection, PersistedSettings, SettingEdit, SettingRef } from './settings.types'

export const refsEqual = (a: SettingRef, b: SettingRef): boolean =>
    a.file === b.file && a.section === b.section && a.key === b.key

export const refKey = (ref: SettingRef): string => `${ref.file}/${ref.section}/${ref.key}`

/**
 * The value League currently has, or undefined when it has never written this
 * setting. League only persists what differs from its own defaults, so a missing
 * key is the normal case, not a broken one.
 */
export const readSetting = (config: PersistedSettings, ref: SettingRef): string | undefined =>
    config.files
        .find(file => file.name === ref.file)
        ?.sections.find(section => section.name === ref.section)
        ?.settings.find(setting => setting.name === ref.key)?.value

/** The value, or the caller's default when League has never written the key. */
export const readSettingOr = (config: PersistedSettings, ref: SettingRef, fallback: string): string =>
    readSetting(config, ref) ?? fallback

const withSetting = (section: ConfigSection, key: string, value: string): ConfigSection => {
    const at = section.settings.findIndex(setting => setting.name === key)
    if (at === -1) return { ...section, settings: [...section.settings, { name: key, value }] }
    if (section.settings[at].value === value) return section

    const settings = [...section.settings]
    settings[at] = { name: key, value }
    return { ...section, settings }
}

const withSection = (file: ConfigFile, ref: SettingRef, value: string): ConfigFile => {
    const at = file.sections.findIndex(section => section.name === ref.section)
    if (at === -1) {
        return { ...file, sections: [...file.sections, { name: ref.section, settings: [{ name: ref.key, value }] }] }
    }

    const section = withSetting(file.sections[at], ref.key, value)
    if (section === file.sections[at]) return file

    const sections = [...file.sections]
    sections[at] = section
    return { ...file, sections }
}

/**
 * The config with one setting changed — inserting the file, section or key when
 * League has not written it yet. Unchanged branches keep their identity, so React
 * can compare by reference.
 */
export const writeSetting = (config: PersistedSettings, ref: SettingRef, value: string): PersistedSettings => {
    const at = config.files.findIndex(file => file.name === ref.file)
    if (at === -1) {
        const section: ConfigSection = { name: ref.section, settings: [{ name: ref.key, value }] }
        return { ...config, files: [...config.files, { name: ref.file, sections: [section] }] }
    }

    const file = withSection(config.files[at], ref, value)
    if (file === config.files[at]) return config

    const files = [...config.files]
    files[at] = file
    return { ...config, files }
}

/** Several edits applied in order, as one new config. */
export const writeSettings = (config: PersistedSettings, edits: SettingEdit[]): PersistedSettings =>
    edits.reduce((next, edit) => writeSetting(next, edit.ref, edit.value), config)

/** Every setting in the file, flattened — used to hunt for keybind conflicts. */
export const allSettings = (config: PersistedSettings): { ref: SettingRef; value: string }[] =>
    config.files.flatMap(file =>
        file.sections.flatMap(section =>
            section.settings.map(setting => ({
                ref: { file: file.name, section: section.name, key: setting.name },
                value: setting.value,
            }))
        )
    )
