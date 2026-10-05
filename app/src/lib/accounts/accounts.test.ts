import { describe, expect, it } from 'vitest'

import { accountDetail, accountName, sortAccounts } from './accounts'

import type { Account } from '../runtime/core.types'

const account = (overrides: Partial<Account>): Account => ({
    id: 'a1',
    label: '',
    riotId: null,
    region: null,
    username: null,
    hasPassword: false,
    capturedAt: 0,
    ...overrides,
})

describe('accountName', () => {
    it('prefers the label', () => {
        expect(accountName(account({ label: 'Main', riotId: 'Faker#KR1' }))).toBe('Main')
    })

    it('falls back to the Riot ID, then a placeholder', () => {
        expect(accountName(account({ label: '  ', riotId: 'Faker#KR1' }))).toBe('Faker#KR1')
        expect(accountName(account({}))).toBe('Unnamed account')
    })
})

describe('accountDetail', () => {
    it('shows the Riot ID only when the label hides it', () => {
        expect(accountDetail(account({ label: 'Main', riotId: 'Faker#KR1', region: 'KR' }))).toBe(
            'Faker#KR1 · KR'
        )
        expect(accountDetail(account({ riotId: 'Faker#KR1', region: 'KR' }))).toBe('KR')
        expect(accountDetail(account({}))).toBe('')
    })
})

describe('sortAccounts', () => {
    it('sorts by display name, ignoring case, without mutating', () => {
        const input = [account({ id: '1', label: 'smurf' }), account({ id: '2', riotId: 'Alpha#EUW' })]
        expect(sortAccounts(input).map(item => item.id)).toEqual(['2', '1'])
        expect(input[0].id).toBe('1')
    })
})
