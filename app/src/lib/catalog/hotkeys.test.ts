import { describe, expect, it } from 'vitest'

import { CASTABLE, CAST_MODES, HOTKEY_GROUPS, QUICKBIND_REFS, eventNameFor, quickbindFor } from './hotkeys'
import { allSettings, readSetting, refKey } from '../settings/settings'

import fixture from '../settings/persisted-settings.fixture.json'

import type { FieldDef } from './catalog.types'
import type { PersistedSettings } from '../settings/settings.types'

const config = fixture as PersistedSettings

const fields: FieldDef[] = HOTKEY_GROUPS.flatMap(group =>
    group.tables.flatMap(table => table.rows.flatMap(row => row))
)

describe('generated event names', () => {
    it('names every cast mode of every target the way League does', () => {
        // The names are generated rather than typed out, so this is the check
        // that the generator agrees with a config League wrote itself.
        for (const target of CASTABLE) {
            for (const mode of CAST_MODES) {
                const key = eventNameFor(target, mode.prefix)
                expect(
                    readSetting(config, { file: 'Input.ini', section: 'GameEvents', key }),
                    key
                ).toBeDefined()
            }
        }
    })

    it('uses Cast for spells and Use for items', () => {
        expect(eventNameFor({ key: 'Spell1', label: '' }, '')).toBe('evtCastSpell1')
        expect(eventNameFor({ key: 'Item1', label: '', used: true }, '')).toBe('evtUseItem1')
        expect(eventNameFor({ key: 'VisionItem', label: '', used: true }, '')).toBe('evtUseVisionItem')
        expect(eventNameFor({ key: 'Item1', label: '', used: true }, 'SmartCast')).toBe('evtSmartCastItem1')
    })

    it('names a quickbind for every castable thing', () => {
        for (const target of CASTABLE) {
            const key = quickbindFor(target)
            expect(readSetting(config, { file: 'Input.ini', section: 'Quickbinds', key }), key).toBeDefined()
        }
    })

    it('covers every quickbind the file holds', () => {
        const inFile = allSettings(config)
            .filter(item => item.ref.section === 'Quickbinds')
            .map(item => item.ref.key)
            .sort()

        expect(QUICKBIND_REFS.map(ref => ref.key).sort()).toEqual(inFile)
    })
})

describe('the hotkey groups', () => {
    it('point every row at a key League actually has', () => {
        for (const field of fields) {
            expect(readSetting(config, field.ref), `${field.label} (${refKey(field.ref)})`).toBeDefined()
        }
    })

    it('give every action both of its slots exactly once', () => {
        const seen = fields.map(field => `${refKey(field.ref)}#${(field.control as { slot: number }).slot}`)

        expect(seen).toHaveLength(new Set(seen).size)

        const bySetting = new Map<string, number[]>()
        for (const field of fields) {
            const slots = bySetting.get(refKey(field.ref)) ?? []
            slots.push((field.control as { slot: number }).slot)
            bySetting.set(refKey(field.ref), slots)
        }
        for (const [key, slots] of bySetting) {
            expect(slots.sort(), key).toEqual([0, 1])
        }
    })

    it('only ever produce keybind controls', () => {
        for (const field of fields) {
            expect(field.control.kind, field.label).toBe('keybind')
        }
    })

    it('has no empty group or table', () => {
        for (const group of HOTKEY_GROUPS) {
            expect(group.tables.length, group.label).toBeGreaterThan(0)
            for (const table of group.tables) {
                expect(table.rows.length, `${group.label} / ${table.label}`).toBeGreaterThan(0)
            }
        }
    })
})
