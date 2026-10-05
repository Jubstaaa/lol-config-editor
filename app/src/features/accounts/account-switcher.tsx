import { listen } from '@tauri-apps/api/event'
import { toast } from 'sonner'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import AccountDialog from './account-dialog'
import { accountDetail, accountName, sortAccounts } from '../../lib/accounts/accounts'
import { notifyDone, notifyProgress } from '../../lib/runtime/notify'
import {
    captureAccount,
    deleteAccount,
    listAccounts,
    recaptureAccount,
    setLaunchLeague,
    switchAccount,
    updateAccount,
} from '../../lib/runtime/core'

import type { Account, AccountEdit, AccountStore } from '../../lib/runtime/core.types'

interface AccountSwitcherProps {
    busy: boolean
    guard: (work: () => Promise<void>) => Promise<void>
}

type Dialog = { account: Account | null } | null

export default function AccountSwitcher({ busy, guard }: AccountSwitcherProps) {
    // ━━━ LOCAL STATE ━━━
    const [store, setStore] = useState<AccountStore | null>(null)
    const [open, setOpen] = useState(false)
    const [dialog, setDialog] = useState<Dialog>(null)
    const menu = useRef<HTMLDivElement>(null)

    // ━━━ DERIVED STATE ━━━
    const accounts = useMemo(() => sortAccounts(store?.accounts ?? []), [store])
    const active = useMemo(() => accounts.find(item => item.id === store?.activeId), [accounts, store])

    // ━━━ EVENT HANDLERS ━━━
    const reload = useCallback(async () => setStore(await listAccounts()), [])

    const handleRecapture = useCallback(
        (id: string) =>
            guard(async () => {
                notifyProgress('Saving the Riot Client session')
                const saved = await recaptureAccount(id)
                await reload()
                setDialog(null)
                notifyDone(`Session saved for ${accountName(saved)}`)
            }),
        [guard, reload]
    )

    const handleSwitch = useCallback(
        (account: Account) =>
            guard(async () => {
                setOpen(false)
                notifyProgress(`Switching to ${accountName(account)}`)
                const result = await switchAccount(account.id)
                await reload()

                if (result.signedIn) {
                    notifyDone(`Signed in as ${accountName(result.account)}`)
                    return
                }

                toast.warning(
                    `The saved session for ${accountName(account)} has expired. Sign in to the Riot Client with "Stay signed in" checked, then re-capture.`,
                    {
                        duration: Infinity,
                        action: { label: 'Re-capture', onClick: () => void handleRecapture(account.id) },
                    }
                )
            }),
        [guard, handleRecapture, reload]
    )

    const handleCapture = useCallback(
        (label: string, username: string | null, password: string | null) =>
            guard(async () => {
                notifyProgress('Reading the signed-in account')
                const saved = await captureAccount(label, username, password)
                await reload()
                setDialog(null)
                notifyDone(`Saved ${accountName(saved)}`)
            }),
        [guard, reload]
    )

    const handleSave = useCallback(
        (edit: AccountEdit) =>
            guard(async () => {
                const saved = await updateAccount(edit)
                await reload()
                setDialog(null)
                notifyDone(`Saved ${accountName(saved)}`)
            }),
        [guard, reload]
    )

    const handleDelete = useCallback(
        (id: string) =>
            guard(async () => {
                await deleteAccount(id)
                await reload()
                setDialog(null)
                notifyDone('Account deleted')
            }),
        [guard, reload]
    )

    const handleLaunchLeague = useCallback(
        (launch: boolean) =>
            guard(async () => {
                await setLaunchLeague(launch)
                await reload()
            }),
        [guard, reload]
    )

    // ━━━ EFFECTS ━━━
    useEffect(() => {
        reload().catch(() => setStore({ accounts: [], launchLeague: false, activeId: null }))
    }, [reload])

    useEffect(() => {
        const stop = listen<string>('account-switch-progress', event => notifyProgress(event.payload))
        return () => void stop.then(unlisten => unlisten())
    }, [])

    useEffect(() => {
        if (!open) return
        const close = (event: MouseEvent) => {
            if (!menu.current?.contains(event.target as Node)) setOpen(false)
        }
        document.addEventListener('mousedown', close)
        return () => document.removeEventListener('mousedown', close)
    }, [open])

    // ━━━ RETURN ━━━
    return (
        <div ref={menu} className='relative'>
            <button
                type='button'
                disabled={busy}
                aria-expanded={open}
                className='flex max-w-56 items-center gap-2 border border-gold-600/40 px-3 py-1.5 text-xs text-gold-300 hover:border-gold-400 disabled:opacity-50'
                onClick={() => setOpen(value => !value)}
            >
                <span className='truncate'>{active ? accountName(active) : 'Accounts'}</span>
                <span className='text-gold-600'>▾</span>
            </button>

            {open ? (
                <div className='absolute right-0 z-40 mt-1 w-72 border border-gold-600/50 bg-ink-800 shadow-lg'>
                    {accounts.length === 0 ? (
                        <p className='px-3 py-3 text-[11px] text-gold-600'>No saved accounts yet.</p>
                    ) : (
                        <ul className='max-h-80 divide-y divide-gold-600/15 overflow-y-auto'>
                            {accounts.map(account => (
                                <li key={account.id} className='flex items-center'>
                                    <button
                                        type='button'
                                        disabled={busy}
                                        className='min-w-0 flex-1 px-3 py-2 text-left hover:bg-ink-700/60 disabled:opacity-50'
                                        onClick={() => handleSwitch(account)}
                                    >
                                        <span
                                            className={`block truncate ${
                                                account.id === store?.activeId
                                                    ? 'text-gold-400'
                                                    : 'text-gold-300/85'
                                            }`}
                                        >
                                            {accountName(account)}
                                        </span>
                                        <span className='block truncate text-[11px] text-gold-600'>
                                            {accountDetail(account)}
                                        </span>
                                    </button>
                                    <button
                                        type='button'
                                        aria-label={`Edit ${accountName(account)}`}
                                        disabled={busy}
                                        className='px-3 py-2 text-gold-600 hover:text-gold-300 disabled:opacity-50'
                                        onClick={() => {
                                            setOpen(false)
                                            setDialog({ account })
                                        }}
                                    >
                                        ✎
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}

                    <div className='space-y-2 border-t border-gold-600/25 p-3'>
                        <button
                            type='button'
                            disabled={busy}
                            className='w-full border border-gold-600/50 px-3 py-1.5 text-xs text-gold-300 hover:border-gold-400 disabled:opacity-50'
                            onClick={() => {
                                setOpen(false)
                                setDialog({ account: null })
                            }}
                        >
                            Add signed-in account
                        </button>
                        <label className='flex items-center gap-2 text-[11px] text-gold-500'>
                            <input
                                type='checkbox'
                                disabled={busy}
                                checked={store?.launchLeague ?? false}
                                onChange={event => handleLaunchLeague(event.target.checked)}
                            />
                            Launch League after switching
                        </label>
                    </div>
                </div>
            ) : null}

            {dialog ? (
                <AccountDialog
                    busy={busy}
                    account={dialog.account}
                    onCancel={() => setDialog(null)}
                    onCapture={handleCapture}
                    onSave={handleSave}
                    onRecapture={handleRecapture}
                    onDelete={handleDelete}
                />
            ) : null}
        </div>
    )
}
