/** One `name = value` pair. League stores every value as a string, floats included. */
export interface Setting {
    name: string
    value: string
}

export interface ConfigSection {
    name: string
    settings: Setting[]
}

export interface ConfigFile {
    name: string
    sections: ConfigSection[]
}

/** The whole of `Config/PersistedSettings.json`. */
export interface PersistedSettings {
    description?: string
    files: ConfigFile[]
}

/** Where a setting lives. Replaces the JSONPath strings the first version used. */
export interface SettingRef {
    file: string
    section: string
    key: string
}

export interface SettingEdit {
    ref: SettingRef
    value: string
}
