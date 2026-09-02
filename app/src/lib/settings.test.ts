import { describe, expect, it } from 'vitest'

import { allSettings, readSetting, writeSetting, writeSettings } from './settings'

import fixture from './persisted-settings.fixture.json'

import type { PersistedSettings, SettingRef } from './settings.types'

const config = fixture as PersistedSettings

const ref = (file: string, section: string, key: string): SettingRef => ({ file, section, key })

describe('readSetting', () => {
    it('finds a value League has written', () => {
        expect(readSetting(config, ref('Game.cfg', 'Volume', 'MasterVolume'))).toBeDefined()
        expect(readSetting(config, ref('Input.ini', 'GameEvents', 'evtCastSpell1'))).toBe('[q]')
    })

    it('returns undefined for a key League has not written', () => {
        // League only persists what differs from its defaults, so this is normal.
        expect(readSetting(config, ref('Game.cfg', 'HUD', 'NotARealSetting'))).toBeUndefined()
        expect(readSetting(config, ref('Game.cfg', 'NotASection', 'MasterVolume'))).toBeUndefined()
        expect(readSetting(config, ref('NotAFile.cfg', 'HUD', 'GlobalScale'))).toBeUndefined()
    })

    it('puts item component purchasing in HUD and jungle paths in General', () => {
        // The first version bound the item-component checkbox to
        // HUD.RecommendJunglePaths, which does not exist in either place.
        expect(readSetting(config, ref('Game.cfg', 'HUD', 'EnableItemComponentPurchasing'))).toBeDefined()
        expect(readSetting(config, ref('Game.cfg', 'General', 'RecommendJunglePaths'))).toBeDefined()
        expect(readSetting(config, ref('Game.cfg', 'HUD', 'RecommendJunglePaths'))).toBeUndefined()
    })
})

describe('writeSetting', () => {
    it('changes a value that is already there', () => {
        const target = ref('Game.cfg', 'Volume', 'MasterVolume')
        const next = writeSetting(config, target, '0.2500')

        expect(readSetting(next, target)).toBe('0.2500')
        expect(readSetting(config, target)).not.toBe('0.2500')
    })

    it('inserts a key the file has never held', () => {
        const target = ref('Game.cfg', 'HUD', 'ShowFPSAndLatencyBrandNew')
        expect(readSetting(config, target)).toBeUndefined()

        expect(readSetting(writeSetting(config, target, '1'), target)).toBe('1')
    })

    it('inserts a section the file has never held', () => {
        const target = ref('Game.cfg', 'BrandNewSection', 'Something')
        const next = writeSetting(config, target, '1')

        expect(readSetting(next, target)).toBe('1')
        expect(next.files.find(file => file.name === 'Game.cfg')?.sections).toHaveLength(
            (config.files.find(file => file.name === 'Game.cfg')?.sections.length ?? 0) + 1
        )
    })

    it('inserts a file the config has never held', () => {
        const target = ref('BrandNew.cfg', 'General', 'Something')

        expect(readSetting(writeSetting(config, target, '1'), target)).toBe('1')
        expect(writeSetting(config, target, '1').files).toHaveLength(config.files.length + 1)
    })

    it('keeps the old object when the value is unchanged', () => {
        const target = ref('Input.ini', 'GameEvents', 'evtCastSpell1')

        expect(writeSetting(config, target, '[q]')).toBe(config)
    })

    it('leaves every other setting alone', () => {
        const next = writeSetting(config, ref('Game.cfg', 'Volume', 'MasterVolume'), '0.1000')
        const before = allSettings(config).filter(item => item.ref.key !== 'MasterVolume')
        const after = allSettings(next).filter(item => item.ref.key !== 'MasterVolume')

        expect(after).toEqual(before)
    })
})

describe('writeSettings', () => {
    it('applies every edit in order', () => {
        const quickbinds = config.files
            .find(file => file.name === 'Input.ini')
            ?.sections.find(section => section.name === 'Quickbinds')?.settings

        const next = writeSettings(
            config,
            (quickbinds ?? []).map(setting => ({
                ref: ref('Input.ini', 'Quickbinds', setting.name),
                value: '1',
            }))
        )

        for (const setting of quickbinds ?? []) {
            expect(readSetting(next, ref('Input.ini', 'Quickbinds', setting.name))).toBe('1')
        }
    })
})
