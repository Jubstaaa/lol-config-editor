import type { Choice, Control, FieldDef } from './catalog.types'
import type { SettingRef } from './settings.types'

export const game = (section: string, key: string): SettingRef => ({ file: 'Game.cfg', section, key })

export const event = (key: string): SettingRef => ({ file: 'Input.ini', section: 'GameEvents', key })

export const hudEvent = (key: string): SettingRef => ({ file: 'Input.ini', section: 'HUDEvents', key })

export const shopEvent = (key: string): SettingRef => ({ file: 'Input.ini', section: 'ShopEvents', key })

export const quickbind = (key: string): SettingRef => ({ file: 'Input.ini', section: 'Quickbinds', key })

interface Extras {
    hint?: string
    wide?: boolean
}

const field = (
    ref: SettingRef,
    label: string,
    control: Control,
    fallback: string,
    extras: Extras = {}
): FieldDef => ({
    ref,
    label,
    control,
    fallback,
    ...extras,
})

export const toggle = (
    ref: SettingRef,
    label: string,
    fallback = '1',
    extras: Extras & { invert?: boolean } = {}
) => field(ref, label, { kind: 'toggle', invert: extras.invert }, fallback, extras)

/** A 0–1 float League stores with four decimals, shown as a whole percentage. */
export const percent = (ref: SettingRef, label: string, fallback = '0.5000', extras: Extras = {}) =>
    field(ref, label, { kind: 'slider', min: 0, max: 100, step: 1, scale: 100, unit: '%' }, fallback, {
        wide: true,
        ...extras,
    })

export const slider = (
    ref: SettingRef,
    label: string,
    bounds: { min: number; max: number; step?: number; scale?: number; unit?: string },
    fallback: string,
    extras: Extras = {}
) =>
    field(
        ref,
        label,
        {
            kind: 'slider',
            min: bounds.min,
            max: bounds.max,
            step: bounds.step ?? 1,
            scale: bounds.scale ?? 1,
            unit: bounds.unit,
        },
        fallback,
        { wide: true, ...extras }
    )

export const choice = (
    ref: SettingRef,
    label: string,
    options: Choice[],
    fallback: string,
    extras: Extras = {}
) => field(ref, label, { kind: 'choice', options }, fallback, extras)

export const keybind = (ref: SettingRef, label: string, slot = 0, extras: Extras = {}) =>
    field(ref, label, { kind: 'keybind', slot }, '', extras)
