import { useState } from 'react'

import type { Profile } from '../../lib/runtime/core.types'

interface ProfileListProps {
    busy: boolean
    profiles: Profile[]
    active: string
    onLoad: (name: string) => void
    onDelete: (name: string) => void
}

export default function ProfileList({ busy, profiles, active, onLoad, onDelete }: ProfileListProps) {
    // Null until something is actually being deleted, and the dialog only exists
    // while it is set — the first version read `.name` off it unconditionally.
    const [pending, setPending] = useState<Profile | null>(null)

    if (profiles.length === 0) {
        return <p className='px-1 py-3 text-[11px] text-gold-600'>No saved profiles yet.</p>
    }

    return (
        <>
            <ul className='divide-y divide-gold-600/15 border border-gold-600/25'>
                {profiles.map(profile => (
                    <li key={profile.name} className='flex items-center'>
                        <button
                            type='button'
                            disabled={busy}
                            className={`min-w-0 flex-1 truncate px-2.5 py-2 text-left hover:bg-ink-700/60 disabled:opacity-50 ${
                                profile.name === active ? 'text-gold-400' : 'text-gold-300/85'
                            }`}
                            onClick={() => onLoad(profile.name)}
                        >
                            {profile.name}
                        </button>
                        <button
                            type='button'
                            aria-label={`Delete ${profile.name}`}
                            disabled={busy}
                            className='px-2.5 py-2 text-gold-600 hover:text-danger-400 disabled:opacity-50'
                            onClick={() => setPending(profile)}
                        >
                            ✕
                        </button>
                    </li>
                ))}
            </ul>

            {pending ? (
                <div className='fixed inset-0 z-50 grid place-items-center bg-ink-900/80 p-6'>
                    <div className='w-full max-w-sm border border-gold-600/50 bg-ink-800 p-5'>
                        <p className='text-sm text-gold-300'>
                            Delete the profile <b className='text-gold-400'>{pending.name}</b>?
                        </p>
                        <p className='mt-1 text-[11px] text-gold-600'>
                            This removes the saved copy. It does not change League.
                        </p>
                        <div className='mt-4 flex justify-end gap-2'>
                            <button
                                type='button'
                                className='border border-gold-600/30 px-3 py-1.5 text-xs text-gold-500 hover:border-gold-500'
                                onClick={() => setPending(null)}
                            >
                                Cancel
                            </button>
                            <button
                                type='button'
                                className='border border-danger-400/60 px-3 py-1.5 text-xs text-danger-400 hover:bg-danger-400/10'
                                onClick={() => {
                                    onDelete(pending.name)
                                    setPending(null)
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    )
}
