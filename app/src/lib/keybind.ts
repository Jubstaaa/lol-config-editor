import { allSettings, refsEqual } from './settings'

import type { PersistedSettings, SettingRef } from './settings.types'

/** League's own word for "nothing is bound here". */
export const UNBOUND = '<Unbound>'

/** Keys held together, in press order: `['Ctrl', 'Button 1']`. */
export type Chord = string[]

/**
 * What one `evt*` setting holds: League keeps two slots per action, primary
 * first, and writes them as `[Ctrl][Button 1],[<Unbound>]`.
 */
export type Binding = Chord[]

export const PRIMARY = 0
export const SECONDARY = 1

const TOKEN = /\[([^\]]*)\]/g

const parseChord = (part: string): Chord => [...part.matchAll(TOKEN)].map(match => match[1])

/**
 * `'[Ctrl][Button 1],[<Unbound>]'` becomes `[['Ctrl', 'Button 1'], ['<Unbound>']]`.
 * An empty slot stays an empty chord so a trailing comma survives the round trip.
 */
export const parseBinding = (value: string): Binding => (value === '' ? [] : value.split(',').map(parseChord))

export const formatBinding = (binding: Binding): string =>
    binding.map(chord => chord.map(token => `[${token}]`).join('')).join(',')

export const isUnbound = (chord: Chord | undefined): boolean =>
    !chord || chord.length === 0 || chord.every(token => token === UNBOUND)

/** Two chords are the same key only when every token matches, in order. */
export const chordsEqual = (a: Chord, b: Chord): boolean =>
    a.length === b.length && a.every((token, at) => token === b[at])

/** The chord in one slot, or an empty chord when the slot is missing. */
export const slotOf = (value: string, slot: number): Chord => parseBinding(value)[slot] ?? []

/** The same value with one slot replaced, leaving the other slot alone. */
export const withSlot = (value: string, slot: number, chord: Chord): string => {
    const binding = parseBinding(value)
    while (binding.length <= slot) binding.push([])
    binding[slot] = chord
    return formatBinding(binding)
}

const TITLE = /^\w/

/** `['Ctrl', 'Button 1']` reads as `Ctrl + Button 1`; an empty chord reads as nothing. */
export const labelOfChord = (chord: Chord): string =>
    isUnbound(chord) ? '' : chord.map(token => token.replace(TITLE, first => first.toUpperCase())).join(' + ')

/** Both slots for a setting, as `Q | Ctrl + Q`. */
export const labelOfBinding = (value: string): string =>
    parseBinding(value).map(labelOfChord).filter(Boolean).join(' | ')

export interface Conflict {
    ref: SettingRef
    slot: number
}

/**
 * Every other slot in the whole config already holding this exact chord.
 *
 * Compares parsed chords, never raw strings: `[Button 1]` must not match inside
 * `[Ctrl][Button 1]`, which is a different key and a real binding in League's
 * own defaults.
 */
export const findConflicts = (config: PersistedSettings, chord: Chord, exclude: SettingRef): Conflict[] => {
    if (isUnbound(chord)) return []

    return allSettings(config).flatMap(({ ref, value }) => {
        if (!ref.key.startsWith('evt') || refsEqual(ref, exclude)) return []

        return parseBinding(value).flatMap((other, slot) =>
            chordsEqual(other, chord) ? [{ ref, slot }] : []
        )
    })
}
