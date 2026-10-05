import { useState } from 'react'

import { accountName } from '../../lib/accounts/accounts'

import type { Account, AccountEdit } from '../../lib/runtime/core.types'

interface AccountDialogProps {
    busy: boolean
    /** Null when adding whoever is signed in to the Riot Client. */
    account: Account | null
    onCancel: () => void
    onCapture: (label: string, username: string | null, password: string | null) => void
    onSave: (edit: AccountEdit) => void
    onRecapture: (id: string) => void
    onDelete: (id: string) => void
}

const fieldClass =
    'w-full border border-gold-600/40 bg-ink-900 px-2.5 py-1.5 text-gold-300 placeholder:text-gold-600 focus:border-gold-400'

export default function AccountDialog({
    busy,
    account,
    onCancel,
    onCapture,
    onSave,
    onRecapture,
    onDelete,
}: AccountDialogProps) {
    const [label, setLabel] = useState(account?.label ?? '')
    const [region, setRegion] = useState(account?.region ?? '')
    const [username, setUsername] = useState(account?.username ?? '')
    const [password, setPassword] = useState('')
    const [forgetPassword, setForgetPassword] = useState(false)
    const [confirmDelete, setConfirmDelete] = useState(false)

    const handleSubmit = () => {
        if (!account) {
            onCapture(label, username || null, password || null)
            return
        }

        onSave({
            id: account.id,
            label,
            region: region || null,
            username: username || null,
            password: password || null,
            forgetPassword,
        })
    }

    return (
        <div className='fixed inset-0 z-50 grid place-items-center bg-ink-900/80 p-6'>
            <form
                className='w-full max-w-sm space-y-3 border border-gold-600/50 bg-ink-800 p-5'
                onSubmit={event => {
                    event.preventDefault()
                    handleSubmit()
                }}
            >
                <h2 className='text-sm font-semibold text-gold-400'>
                    {account ? `Edit ${accountName(account)}` : 'Add the signed-in account'}
                </h2>

                {account ? (
                    <p className='text-[11px] text-gold-600'>
                        {account.riotId ?? 'Riot ID not detected yet'}
                    </p>
                ) : (
                    <p className='text-[11px] text-gold-600'>
                        Sign in to the Riot Client with <b className='text-gold-500'>Stay signed in</b>{' '}
                        checked, then save. The Riot ID and region are read from the client.
                    </p>
                )}

                <label className='block space-y-1 text-[11px] text-gold-500'>
                    <span>Label</span>
                    <input
                        type='text'
                        value={label}
                        placeholder='Main, Smurf…'
                        className={fieldClass}
                        onChange={event => setLabel(event.target.value)}
                    />
                </label>

                {account ? (
                    <label className='block space-y-1 text-[11px] text-gold-500'>
                        <span>Region</span>
                        <input
                            type='text'
                            value={region}
                            placeholder='EUW, NA, KR…'
                            className={fieldClass}
                            onChange={event => setRegion(event.target.value)}
                        />
                    </label>
                ) : null}

                <fieldset className='space-y-2 border border-gold-600/25 p-3'>
                    <legend className='px-1 text-[11px] text-gold-500'>Password fallback (optional)</legend>
                    <p className='text-[11px] text-gold-600'>
                        Used only when the saved session has expired. The password is kept in your system
                        keychain and typed into the Riot Client for you.
                    </p>
                    <input
                        type='text'
                        value={username}
                        autoComplete='off'
                        placeholder='Riot username (not Riot ID)'
                        className={fieldClass}
                        onChange={event => setUsername(event.target.value)}
                    />
                    <input
                        type='password'
                        value={password}
                        autoComplete='new-password'
                        disabled={forgetPassword}
                        placeholder={account?.hasPassword ? 'Saved — type to replace' : 'Password'}
                        className={`${fieldClass} disabled:opacity-50`}
                        onChange={event => setPassword(event.target.value)}
                    />
                    {account?.hasPassword ? (
                        <label className='flex items-center gap-2 text-[11px] text-gold-500'>
                            <input
                                type='checkbox'
                                checked={forgetPassword}
                                onChange={event => setForgetPassword(event.target.checked)}
                            />
                            Forget the saved password
                        </label>
                    ) : null}
                </fieldset>

                {account ? (
                    <div className='flex flex-wrap gap-2'>
                        <button
                            type='button'
                            disabled={busy}
                            title='Save the Riot Client session again — sign in to this account first'
                            className='border border-gold-600/40 px-3 py-1.5 text-xs text-gold-300 hover:border-gold-400 disabled:opacity-50'
                            onClick={() => onRecapture(account.id)}
                        >
                            Re-capture session
                        </button>
                        {confirmDelete ? (
                            <button
                                type='button'
                                disabled={busy}
                                className='border border-danger-400/60 px-3 py-1.5 text-xs text-danger-400 hover:bg-danger-400/10 disabled:opacity-50'
                                onClick={() => onDelete(account.id)}
                            >
                                Really delete?
                            </button>
                        ) : (
                            <button
                                type='button'
                                disabled={busy}
                                className='border border-gold-600/30 px-3 py-1.5 text-xs text-gold-500 hover:border-danger-400/60 hover:text-danger-400 disabled:opacity-50'
                                onClick={() => setConfirmDelete(true)}
                            >
                                Delete
                            </button>
                        )}
                    </div>
                ) : null}

                <div className='flex justify-end gap-2 pt-1'>
                    <button
                        type='button'
                        className='border border-gold-600/30 px-3 py-1.5 text-xs text-gold-500 hover:border-gold-500'
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                    <button
                        type='submit'
                        disabled={busy}
                        className='border border-gold-400 bg-gold-400/15 px-3 py-1.5 text-xs text-gold-300 hover:bg-gold-400/25 disabled:opacity-50'
                    >
                        {account ? 'Save' : 'Save signed-in account'}
                    </button>
                </div>
            </form>
        </div>
    )
}
