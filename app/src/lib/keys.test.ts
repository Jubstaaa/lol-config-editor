import { describe, expect, it } from 'vitest'

import { orderTokens, tokenForButton, tokenForKey } from './keys'
import { allSettings } from './settings'

import fixture from './persisted-settings.fixture.json'

import type { PersistedSettings } from './settings.types'

describe('tokenForKey', () => {
    it('lowercases letters the way League stores them', () => {
        expect(tokenForKey('Q')).toBe('q')
        expect(tokenForKey('q')).toBe('q')
    })

    it('uses League’s own names for the special keys', () => {
        expect(tokenForKey(' ')).toBe('Space')
        expect(tokenForKey('Control')).toBe('Ctrl')
        expect(tokenForKey('Enter')).toBe('Return')
        expect(tokenForKey('Escape')).toBe('Esc')
        expect(tokenForKey('ArrowUp')).toBe('Up Arrow')
    })

    it('leaves function keys and digits alone', () => {
        expect(tokenForKey('F5')).toBe('F5')
        expect(tokenForKey('6')).toBe('6')
    })
})

describe('tokenForButton', () => {
    it('renumbers the mouse the way League does', () => {
        // The DOM says left is 0, middle 1, right 2. League says left is
        // Button 1, right Button 2, middle Button 3.
        expect(tokenForButton(0)).toBe('Button 1')
        expect(tokenForButton(2)).toBe('Button 2')
        expect(tokenForButton(1)).toBe('Button 3')
        expect(tokenForButton(4)).toBe('Button 5')
    })

    it('never emits Button 0, which League has no name for', () => {
        for (let button = 0; button < 8; button += 1) {
            expect(tokenForButton(button)).not.toBe('Button 0')
        }
    })
})

describe('orderTokens', () => {
    it('puts modifiers first, in League’s order', () => {
        expect(orderTokens(['Button 1', 'Ctrl'])).toEqual(['Ctrl', 'Button 1'])
        expect(orderTokens(['q', 'Shift', 'Ctrl'])).toEqual(['Ctrl', 'Shift', 'q'])
    })

    it('leaves an already ordered chord alone', () => {
        expect(orderTokens(['Ctrl', '6'])).toEqual(['Ctrl', '6'])
    })
})

describe('the token vocabulary', () => {
    it('can name every token in a config League wrote itself', () => {
        const config = fixture as PersistedSettings
        const seen = new Set<string>()
        for (const { value } of allSettings(config)) {
            for (const match of value.matchAll(/\[([^\]]*)\]/g)) seen.add(match[1])
        }

        const named = new Set([
            ...Array.from({ length: 26 }, (_, at) => String.fromCharCode(97 + at)),
            ...Array.from({ length: 10 }, (_, digit) => String(digit)),
            ...Array.from({ length: 12 }, (_, at) => `F${at + 1}`),
            ...Array.from({ length: 5 }, (_, at) => tokenForButton(at)),
            'Ctrl',
            'Alt',
            'Shift',
            'Space',
            'Tab',
            'Esc',
            'Return',
            '<Unbound>',
            'Up Arrow',
            'Down Arrow',
            'Left Arrow',
            'Right Arrow',
            '`',
        ])

        expect([...seen].filter(token => !named.has(token))).toEqual([])
    })
})
