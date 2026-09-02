import { describe, expect, it } from 'vitest'

import { TABS } from './catalog'
import { readSetting, refKey } from './settings'

import fixture from './persisted-settings.fixture.json'

import type { FieldDef } from './catalog.types'
import type { PersistedSettings } from './settings.types'

const fields: FieldDef[] = TABS.flatMap(tab => tab.groups.flatMap(group => group.fields))

describe('the catalog', () => {
    it('points every field at a distinct setting', () => {
        // Two controls on one key means one of them was pasted and not renamed —
        // the mistake that bound item component purchasing to jungle paths.
        const seen = fields.map(field => refKey(field.ref))

        expect(seen).toHaveLength(new Set(seen).size)
    })

    it('gives every field a distinct label within its group', () => {
        for (const tab of TABS) {
            for (const group of tab.groups) {
                const labels = group.fields.map(field => field.label)
                expect(labels, `${tab.label} / ${group.label}`).toHaveLength(new Set(labels).size)
            }
        }
    })

    it('gives every toggle a fallback League would recognise', () => {
        for (const field of fields) {
            if (field.control.kind !== 'toggle') continue
            expect(field.fallback, field.label).toMatch(/^[01]$/)
        }
    })

    it('gives every choice a fallback that is one of its options', () => {
        for (const field of fields) {
            if (field.control.kind !== 'choice') continue
            expect(
                field.control.options.map(option => option.value),
                field.label
            ).toContain(field.fallback)
        }
    })

    it('gives every choice distinct option values', () => {
        for (const field of fields) {
            if (field.control.kind !== 'choice') continue
            const values = field.control.options.map(option => option.value)
            expect(values, field.label).toHaveLength(new Set(values).size)
        }
    })

    it('gives every slider a fallback inside its own range', () => {
        for (const field of fields) {
            if (field.control.kind !== 'slider') continue
            const shown = Number(field.fallback) * field.control.scale

            expect(Number.isFinite(shown), field.label).toBe(true)
            expect(shown, field.label).toBeGreaterThanOrEqual(field.control.min)
            expect(shown, field.label).toBeLessThanOrEqual(field.control.max)
        }
    })

    it('only writes to files League actually keeps', () => {
        for (const field of fields) {
            expect(['Game.cfg', 'Input.ini'], field.label).toContain(field.ref.file)
        }
    })

    it('has no empty tab or group', () => {
        for (const tab of TABS) {
            expect(tab.groups.length, tab.label).toBeGreaterThan(0)
            for (const group of tab.groups) {
                expect(group.fields.length, `${tab.label} / ${group.label}`).toBeGreaterThan(0)
            }
        }
    })

    it('gives every tab a distinct id', () => {
        const ids = TABS.map(tab => tab.id)

        expect(ids).toHaveLength(new Set(ids).size)
    })
})

describe('the catalog against a config League wrote itself', () => {
    const config = fixture as PersistedSettings

    /** Only fields the fixture actually holds can be checked against it. */
    const present = fields
        .map(field => ({ field, value: readSetting(config, field.ref) }))
        .filter((item): item is { field: FieldDef; value: string } => item.value !== undefined)

    it('checks a useful number of fields', () => {
        expect(present.length).toBeGreaterThan(50)
    })

    it('reads 0 or 1 wherever it shows a checkbox', () => {
        for (const { field, value } of present) {
            if (field.control.kind !== 'toggle') continue
            expect(value, `${field.label} (${refKey(field.ref)})`).toMatch(/^[01]$/)
        }
    })

    it('reads a number wherever it shows a slider', () => {
        for (const { field, value } of present) {
            if (field.control.kind !== 'slider') continue
            expect(Number.isFinite(Number(value)), `${field.label} (${refKey(field.ref)})`).toBe(true)
        }
    })

    it('reads one of its own options wherever it shows a dropdown', () => {
        for (const { field, value } of present) {
            if (field.control.kind !== 'choice') continue
            expect(
                field.control.options.map(option => option.value),
                `${field.label} (${refKey(field.ref)})`
            ).toContain(value)
        }
    })

    it('never points at a key that section does not have', () => {
        // A pasted-and-unrenamed field reads undefined forever and silently does
        // nothing, which is how the item component checkbox shipped broken.
        const sections = new Set(
            config.files.flatMap(file => file.sections.map(section => `${file.name}/${section.name}`))
        )

        for (const field of fields) {
            const where = `${field.ref.file}/${field.ref.section}`
            if (!sections.has(where)) continue

            expect(readSetting(config, field.ref), `${field.label} (${refKey(field.ref)})`).toBeDefined()
        }
    })
})
