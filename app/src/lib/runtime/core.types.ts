export interface Located {
    path: string
    locked: boolean
}

export interface Profile {
    name: string
    path: string
}

export interface Account {
    id: string
    label: string
    riotId: string | null
    region: string | null
    /** Unix seconds. */
    capturedAt: number
}

export interface AccountStore {
    accounts: Account[]
    launchLeague: boolean
    activeId: string | null
}

export interface Switched {
    /** False when the saved session was refused; the user signs in by hand, then re-captures. */
    signedIn: boolean
    account: Account
}

export interface AccountEdit {
    id: string
    label: string
    region: string | null
}
