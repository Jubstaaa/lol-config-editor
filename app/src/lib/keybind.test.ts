import { describe, expect, it } from 'vitest'

import {
    chordsEqual,
    findConflicts,
    formatBinding,
    isUnbound,
    labelOfBinding,
    parseBinding,
    slotOf,
    withSlot,
} from './keybind'
import { allSettings } from './settings'

import fixture from './persisted-settings.fixture.json'

import type { PersistedSettings } from './settings.types'

const config = fixture as PersistedSettings

describe('parseBinding', () => {
    it('splits the two slots and their held keys', () => {
        expect(parseBinding('[Ctrl][Button 1],[<Unbound>]')).toEqual([['Ctrl', 'Button 1'], ['<Unbound>']])
        expect(parseBinding('[q]')).toEqual([['q']])
        expect(parseBinding('')).toEqual([])
    })

    it('round-trips every value in a real config', () => {
        for (const { value } of allSettings(config)) {
            if (!value.includes('[')) continue
            expect(formatBinding(parseBinding(value))).toBe(value)
        }
    })

    it('keeps a trailing empty slot', () => {
        expect(formatBinding(parseBinding('[Alt][Button 1],'))).toBe('[Alt][Button 1],')
    })
})

describe('isUnbound', () => {
    it('treats the empty chord and League’s own word as unbound', () => {
        expect(isUnbound([])).toBe(true)
        expect(isUnbound(['<Unbound>'])).toBe(true)
        expect(isUnbound(['q'])).toBe(false)
    })
})

describe('chordsEqual', () => {
    it('does not confuse a key with the same key under a modifier', () => {
        // The first version cleared conflicts with a substring replace, so
        // binding [Button 1] corrupted the existing [Ctrl][Button 1].
        expect(chordsEqual(['Button 1'], ['Ctrl', 'Button 1'])).toBe(false)
        expect(chordsEqual(['Ctrl', 'Button 1'], ['Button 1'])).toBe(false)
        expect(chordsEqual(['Ctrl', 'Button 1'], ['Ctrl', 'Button 1'])).toBe(true)
    })

    it('is order sensitive', () => {
        expect(chordsEqual(['Ctrl', 'Alt'], ['Alt', 'Ctrl'])).toBe(false)
    })
})

describe('withSlot', () => {
    it('replaces one slot and leaves the other alone', () => {
        expect(withSlot('[q],[e]', 0, ['w'])).toBe('[w],[e]')
        expect(withSlot('[q],[e]', 1, ['r'])).toBe('[q],[r]')
    })

    it('grows the value when the second slot was never written', () => {
        expect(withSlot('[q]', 1, ['e'])).toBe('[q],[e]')
        expect(slotOf(withSlot('', 1, ['e']), 1)).toEqual(['e'])
    })
})

describe('findConflicts', () => {
    const exclude = { file: 'Input.ini', section: 'GameEvents', key: 'evtNothing' }

    /** Three actions on Q, one of them under Ctrl, plus a non-keybind lookalike. */
    const crowded: PersistedSettings = {
        files: [
            {
                name: 'Input.ini',
                sections: [
                    {
                        name: 'GameEvents',
                        settings: [
                            { name: 'evtCastSpell1', value: '[q]' },
                            { name: 'evtNormalCastSpell1', value: '[e],[q]' },
                            { name: 'evtSmartCastSpell1', value: '[q],[<Unbound>]' },
                            { name: 'evtChampMasteryDisplay', value: '[Ctrl][q]' },
                        ],
                    },
                ],
            },
            {
                name: 'Game.cfg',
                sections: [{ name: 'HUD', settings: [{ name: 'GlobalScale', value: '[q]' }] }],
            },
        ],
    }

    it('finds every slot holding the key, not just the first', () => {
        // The first version cleared conflicts with a single String.replace,
        // which stopped at the first match and left the rest bound.
        const found = findConflicts(crowded, ['q'], exclude)

        expect(found.map(item => `${item.ref.key}#${item.slot}`).sort()).toEqual([
            'evtCastSpell1#0',
            'evtNormalCastSpell1#1',
            'evtSmartCastSpell1#0',
        ])
    })

    it('does not report a modified chord as a plain key', () => {
        // [Ctrl][q] is a different key from [q] and must survive untouched.
        expect(
            findConflicts(crowded, ['q'], exclude).some(item => item.ref.key === 'evtChampMasteryDisplay')
        ).toBe(false)
        expect(findConflicts(crowded, ['Ctrl', 'q'], exclude).map(item => item.ref.key)).toEqual([
            'evtChampMasteryDisplay',
        ])
    })

    it('ignores settings that are not keybinds', () => {
        expect(findConflicts(crowded, ['q'], exclude).some(item => item.ref.key === 'GlobalScale')).toBe(
            false
        )
    })

    it('reports nothing for an unbound chord', () => {
        expect(findConflicts(crowded, [], exclude)).toEqual([])
        expect(findConflicts(crowded, ['<Unbound>'], exclude)).toEqual([])
    })

    it('never reports the setting being edited', () => {
        const self = { file: 'Input.ini', section: 'GameEvents', key: 'evtCastSpell1' }

        expect(findConflicts(crowded, ['q'], self).some(found => found.ref.key === 'evtCastSpell1')).toBe(
            false
        )
    })

    it('finds no conflict anywhere in a config League wrote itself', () => {
        for (const { ref, value } of allSettings(config)) {
            if (!ref.key.startsWith('evt')) continue
            for (const chord of parseBinding(value)) {
                expect(findConflicts(config, chord, ref)).toEqual([])
            }
        }
    })
})

describe('labelOfBinding', () => {
    it('reads both slots and drops the unbound one', () => {
        expect(labelOfBinding('[Ctrl][Button 1],[<Unbound>]')).toBe('Ctrl + Button 1')
        expect(labelOfBinding('[a],[x]')).toBe('A | X')
        expect(labelOfBinding('')).toBe('')
    })
})
