import { describe, expect, it } from 'vitest'

import { TABS } from './catalog'
import { HOTKEY_GROUPS, QUICKBIND_REFS } from './hotkeys'
import { allSettings, refKey } from './settings'

import fixture from './persisted-settings.fixture.json'

import type { PersistedSettings } from './settings.types'

/** Settings deliberately left out of the UI, and why. */
const DELIBERATE: Record<string, string> = {
    'Game.cfg/General/CfgVersion': 'League stamps its own version here',
    'Game.cfg/Chat/NativeOffsetX': 'where the player dragged a panel, not a setting',
    'Game.cfg/Chat/NativeOffsetY': 'where the player dragged a panel, not a setting',
    'Game.cfg/Chat/ReplayNativeOffsetX': 'where the player dragged a panel, not a setting',
    'Game.cfg/Chat/ReplayNativeOffsetY': 'where the player dragged a panel, not a setting',
    'Game.cfg/ItemShop/NativeOffsetX': 'where the player dragged a panel, not a setting',
    'Game.cfg/ItemShop/NativeOffsetY': 'where the player dragged a panel, not a setting',
    'Game.cfg/TFTChat/NativeOffsetX': 'where the player dragged a panel, not a setting',
    'Game.cfg/TFTChat/NativeOffsetY': 'where the player dragged a panel, not a setting',
    'Game.cfg/ItemShop/CurrentTab': 'which shop tab was last open, not a setting',

    // Held back on purpose: shipping a control whose meaning is a guess is the
    // bug this rewrite exists to stop. These need checking against the game.
    'Game.cfg/Volume/MasterMute': 'polarity unverified',
    'Game.cfg/Volume/MusicMute': 'polarity unverified',
    'Game.cfg/Volume/SfxMute': 'polarity unverified',
    'Game.cfg/Volume/VoiceMute': 'polarity unverified',
    'Game.cfg/Volume/AnnouncerMute': 'polarity unverified',
    'Game.cfg/Volume/AmbienceMute': 'polarity unverified',
    'Game.cfg/Volume/PingsMute': 'polarity unverified',
    'Game.cfg/ColorPalette/ColorPalette': 'option values unverified',
    'Game.cfg/HUD/EternalsMilestoneDisplayMode': 'option values unverified',
    'Game.cfg/TFTHUD/EnableChat': 'unverified against a TFT config',
    'Input.ini/GameEvents/evtUseItem7': 'no seventh item slot in the client',
}

describe('coverage of a config League wrote itself', () => {
    const config = fixture as PersistedSettings

    const shown = new Set([
        ...TABS.flatMap(tab => tab.groups.flatMap(group => group.fields.map(field => refKey(field.ref)))),
        ...HOTKEY_GROUPS.flatMap(group =>
            group.tables.flatMap(table => table.rows.flatMap(row => row.map(field => refKey(field.ref))))
        ),
        ...QUICKBIND_REFS.map(refKey),
    ])

    const missing = allSettings(config)
        .map(item => refKey(item.ref))
        .filter(key => !shown.has(key))

    it('leaves out only what it means to leave out', () => {
        expect(missing.filter(key => !(key in DELIBERATE))).toEqual([])
    })

    it('does not list an exclusion the config no longer has', () => {
        const present = new Set(allSettings(config).map(item => refKey(item.ref)))

        expect(Object.keys(DELIBERATE).filter(key => !present.has(key))).toEqual([])
    })

    it('shows the overwhelming majority of what League keeps', () => {
        const total = allSettings(config).length

        expect(total - missing.length).toBeGreaterThan(total * 0.9)
    })
})
