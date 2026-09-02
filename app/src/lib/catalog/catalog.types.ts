import type { SettingRef } from '../settings/settings.types'

export interface Choice {
    label: string
    value: string
}

export type Control =
    /** A checkbox. `invert` is for settings League stores the other way round. */
    | { kind: 'toggle'; invert?: boolean }
    /** A slider. `scale` turns League's 0–1 floats into whole percentages. */
    | { kind: 'slider'; min: number; max: number; step: number; scale: number; unit?: string }
    | { kind: 'choice'; options: Choice[] }
    | { kind: 'keybind'; slot: number }

export interface FieldDef {
    ref: SettingRef
    label: string
    hint?: string
    control: Control
    /**
     * What League itself uses when it has never written the key. League only
     * persists settings that differ from its defaults, so most keys are absent
     * from a fresh config and this is what the control shows.
     */
    fallback: string
    /** Take the full width of the group instead of one column. */
    wide?: boolean
}

export interface GroupDef {
    label: string
    hint?: string
    fields: FieldDef[]
}

export interface TabDef {
    id: string
    label: string
    groups: GroupDef[]
}
