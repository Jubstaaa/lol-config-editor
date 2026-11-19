// @vitest-environment jsdom
import axe from 'axe-core'
import { clearMocks, mockIPC } from '@tauri-apps/api/mocks'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import App from './app'
import { TABS } from './lib/catalog/catalog'

import fixture from './lib/settings/persisted-settings.fixture.json'

const replies: Record<string, unknown> = {
    find_config: { path: '/League of Legends/Config/PersistedSettings.json', locked: false },
    read_config: fixture,
    list_profiles: [{ name: 'ranked', path: '/profiles/ranked.json' }],
    list_accounts: { accounts: [], launchLeague: false, activeId: null },
    'plugin:updater|check': null,
}

// jsdom does no layout, so contrast is checked by hand against the theme tokens instead.
const audit = async () => {
    const result = await axe.run(document.body, { rules: { 'color-contrast': { enabled: false } } })
    return result.violations.map(
        violation => `${violation.id}: ${violation.nodes.map(node => node.target).join(' | ')}`
    )
}

beforeEach(() => mockIPC(command => replies[command], { shouldMockEvents: true }))

afterEach(async () => {
    cleanup()
    // Unmounting unlistens asynchronously; the mocks must outlive that.
    await new Promise(resolve => setTimeout(resolve))
    clearMocks()
})

describe('the editor, for assistive technology', () => {
    it('has no axe violations on the hotkeys tab', async () => {
        render(<App />)
        await screen.findByRole('button', { name: 'Apply to League' })

        expect(await audit()).toEqual([])
    })

    it('has no axe violations on any settings tab', async () => {
        render(<App />)
        await screen.findByRole('button', { name: 'Apply to League' })

        for (const tab of TABS) {
            fireEvent.click(screen.getByRole('button', { name: tab.label }))
            expect(screen.getByRole('button', { name: tab.label }).getAttribute('aria-current')).toBe('page')
            expect(await audit(), tab.label).toEqual([])
        }
    })

    it('names the profile field and exposes the lock state', async () => {
        render(<App />)
        await screen.findByRole('button', { name: 'Apply to League' })

        expect(screen.getByRole('textbox', { name: 'Profile name' })).toBeTruthy()
        expect(screen.getByRole('button', { name: 'Unlocked' }).getAttribute('aria-pressed')).toBe('false')
    })
})
