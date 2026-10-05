import type { Account } from '../runtime/core.types'

/** What the player called it, else the Riot ID, else a placeholder. */
export const accountName = (account: Account): string =>
    account.label.trim() || account.riotId || 'Unnamed account'

/** The secondary line: Riot ID (when the label hides it) and region. */
export const accountDetail = (account: Account): string => {
    const parts: string[] = []
    if (account.label.trim() && account.riotId) parts.push(account.riotId)
    if (account.region) parts.push(account.region)
    return parts.join(' · ')
}

export const sortAccounts = (accounts: Account[]): Account[] =>
    [...accounts].sort((left, right) =>
        accountName(left).localeCompare(accountName(right), undefined, { sensitivity: 'base' })
    )
