import { invoke } from '@tauri-apps/api/core'

import type { Account, AccountEdit, AccountStore, Located, Profile, Switched } from './core.types'
import type { PersistedSettings } from '../settings/settings.types'

/** Rust hands failures back as plain strings; anything else is a real throw. */
export const getErrorMessage = (error: unknown): string => {
    if (typeof error === 'string') return error
    return error instanceof Error ? error.message : String(error)
}

/** Where League's settings are, from Riot's install record or a past choice. */
export const findConfig = () => invoke<Located | null>('find_config')

export const useFolder = (folder: string) => invoke<Located>('use_folder', { folder })

export const readConfig = () => invoke<PersistedSettings>('read_config')

/** Writes to League and reports whether the file is still locked. */
export const applyConfig = (settings: PersistedSettings) => invoke<boolean>('apply_config', { settings })

export const setLock = (locked: boolean) => invoke<boolean>('set_lock', { locked })

export const listProfiles = () => invoke<Profile[]>('list_profiles')

export const saveProfile = (name: string, settings: PersistedSettings) =>
    invoke<Profile>('save_profile', { name, settings })

export const readProfile = (name: string) => invoke<PersistedSettings>('read_profile', { name })

export const deleteProfile = (name: string) => invoke<void>('delete_profile', { name })

export const listAccounts = () => invoke<AccountStore>('list_accounts')

/** Saves whoever is signed in to the Riot Client right now. */
export const captureAccount = (label: string, username: string | null, password: string | null) =>
    invoke<Account>('capture_account', { label, username, password })

export const recaptureAccount = (id: string) => invoke<Account>('recapture_account', { id })

export const updateAccount = (edit: AccountEdit) => invoke<Account>('update_account', { ...edit })

export const deleteAccount = (id: string) => invoke<void>('delete_account', { id })

export const setLaunchLeague = (launch: boolean) => invoke<void>('set_launch_league', { launch })

export const switchAccount = (id: string) => invoke<Switched>('switch_account', { id })
