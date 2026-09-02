import { open } from '@tauri-apps/plugin-dialog'
import { Toaster, toast } from 'sonner'
import { useCallback, useEffect, useMemo, useState } from 'react'

import HotkeysPanel from './features/editor/hotkeys-panel'
import ProfileList from './features/profiles/profile-list'
import SettingsEditor from './features/editor/settings-editor'
import { SettingsProvider } from './features/editor/settings.context'
import { TABS } from './lib/catalog'
import { UNBOUND, findConflicts, withSlot } from './lib/keybind'
import { notifyDone, notifyFailed, notifyIdle, notifyProgress } from './lib/notify'
import { checkForUpdate } from './lib/update'
import { readSettingOr, writeSetting } from './lib/settings'
import {
    applyConfig,
    deleteProfile,
    findConfig,
    getErrorMessage,
    listProfiles,
    readConfig,
    readProfile,
    saveProfile,
    setLock,
    useFolder,
} from './lib/core'

import type { Chord } from './lib/keybind'
import type { FieldDef } from './lib/catalog.types'
import type { Located, Profile } from './lib/core.types'
import type { PersistedSettings, SettingRef } from './lib/settings.types'

const HOTKEYS_TAB = 'hotkeys'

export default function App() {
    // ━━━ LOCAL STATE ━━━
    const [located, setLocated] = useState<Located | null>(null)
    const [config, setConfig] = useState<PersistedSettings | null>(null)
    const [profiles, setProfiles] = useState<Profile[]>([])
    const [profileName, setProfileName] = useState('')
    const [tab, setTab] = useState(HOTKEYS_TAB)
    const [busy, setBusy] = useState(false)
    const [ready, setReady] = useState(false)

    // ━━━ DERIVED STATE ━━━
    const tabs = useMemo(() => [{ id: HOTKEYS_TAB, label: 'Hotkeys' }, ...TABS], [])
    const current = useMemo(() => TABS.find(item => item.id === tab), [tab])

    // ━━━ EVENT HANDLERS ━━━
    const guard = useCallback(async (work: () => Promise<void>) => {
        setBusy(true)
        try {
            await work()
        } catch (cause) {
            notifyFailed(getErrorMessage(cause))
        } finally {
            setBusy(false)
        }
    }, [])

    const loadProfiles = useCallback(async () => setProfiles(await listProfiles()), [])

    const openConfig = useCallback(
        (found: Located) =>
            guard(async () => {
                setLocated(found)
                setConfig(await readConfig())
                await loadProfiles()
            }),
        [guard, loadProfiles]
    )

    const handlePickFolder = useCallback(
        () =>
            guard(async () => {
                const chosen = await open({
                    directory: true,
                    title: 'Select your League of Legends folder',
                })
                // Choosing nothing is a decision, not a failure — the first
                // version raised an error popup when the dialog was dismissed.
                if (typeof chosen !== 'string') return

                await openConfig(await useFolder(chosen))
            }),
        [guard, openConfig]
    )

    const valueOf = useCallback(
        (field: FieldDef) => (config ? readSettingOr(config, field.ref, field.fallback) : field.fallback),
        [config]
    )

    const set = useCallback(
        (ref: SettingRef, value: string) =>
            setConfig(current => (current ? writeSetting(current, ref, value) : current)),
        []
    )

    const bind = useCallback(
        (ref: SettingRef, slot: number, chord: Chord) =>
            setConfig(current => {
                if (!current) return current

                // Free the key everywhere else first, then take it here.
                const cleared = findConflicts(current, chord, ref).reduce(
                    (next, clash) =>
                        writeSetting(
                            next,
                            clash.ref,
                            withSlot(readSettingOr(next, clash.ref, ''), clash.slot, [UNBOUND])
                        ),
                    current
                )

                return writeSetting(cleared, ref, withSlot(readSettingOr(cleared, ref, ''), slot, chord))
            }),
        []
    )

    const handleApply = useCallback(
        () =>
            guard(async () => {
                if (!config) return

                notifyProgress('Writing your settings to League')
                const locked = await applyConfig(config)
                setLocated(found => (found ? { ...found, locked } : found))
                notifyDone('Applied to League')
            }),
        [config, guard]
    )

    const handleToggleLock = useCallback(
        () =>
            guard(async () => {
                if (!located) return

                const locked = await setLock(!located.locked)
                setLocated({ ...located, locked })
                notifyDone(locked ? 'League can no longer overwrite this file' : 'League can write this file')
            }),
        [guard, located]
    )

    const handleSaveProfile = useCallback(
        () =>
            guard(async () => {
                if (!config) return

                const saved = await saveProfile(profileName || `profile-${Date.now()}`, config)
                setProfileName(saved.name)
                await loadProfiles()
                notifyDone(`Saved ${saved.name}`)
            }),
        [config, guard, loadProfiles, profileName]
    )

    const handleLoadProfile = useCallback(
        (name: string) =>
            guard(async () => {
                setConfig(await readProfile(name))
                setProfileName(name)
                notifyDone(`Loaded ${name}`)
            }),
        [guard]
    )

    const handleDeleteProfile = useCallback(
        (name: string) =>
            guard(async () => {
                await deleteProfile(name)
                await loadProfiles()
                if (name === profileName) setProfileName('')
                notifyDone(`Deleted ${name}`)
            }),
        [guard, loadProfiles, profileName]
    )

    // ━━━ EFFECTS ━━━
    useEffect(() => {
        findConfig()
            .then(found => {
                if (found) return openConfig(found)
            })
            .catch(cause => notifyFailed(getErrorMessage(cause)))
            .finally(() => setReady(true))
        // Runs once, on the way in.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Asked once, on the way in. A failure here is never worth a word to anyone.
    useEffect(() => {
        checkForUpdate()
            .then(found => {
                if (!found) return

                toast(`Version ${found.version} is out`, {
                    duration: Infinity,
                    action: {
                        label: 'Install',
                        onClick: () => {
                            const id = toast.loading('Downloading the update…')
                            found
                                .install(fraction =>
                                    toast.loading(`Downloading the update — ${Math.round(fraction * 100)}%`, {
                                        id,
                                    })
                                )
                                .catch(cause => toast.error(getErrorMessage(cause), { id }))
                        },
                    },
                })
            })
            .catch(() => {})
    }, [])

    useEffect(() => {
        if (!busy) notifyIdle()
    }, [busy])

    // ━━━ RETURN ━━━
    if (!config) {
        return (
            <>
                <div className='grid h-full place-items-center p-8 text-center'>
                    <div className='max-w-md space-y-4'>
                        <h1 className='text-lg font-semibold text-gold-400'>LoL Config Editor</h1>
                        <p className='text-gold-500'>
                            {ready
                                ? 'No League settings found on this machine. Point the app at your League of Legends folder.'
                                : 'Looking for your League of Legends folder…'}
                        </p>
                        <button
                            type='button'
                            disabled={busy}
                            className='border border-gold-600/50 px-4 py-2 text-gold-300 hover:border-gold-400 disabled:opacity-50'
                            onClick={handlePickFolder}
                        >
                            Choose the folder
                        </button>
                        <p className='text-[11px] text-gold-600'>
                            League writes its settings only after you have played at least one game.
                        </p>
                    </div>
                </div>
                <Toaster position='bottom-center' theme='dark' />
            </>
        )
    }

    return (
        <SettingsProvider value={{ valueOf, set, bind }}>
            <div className='flex h-full flex-col'>
                <header className='flex items-center justify-between gap-4 border-b border-gold-600/25 px-4 py-2.5'>
                    <div className='flex min-w-0 items-center gap-3'>
                        <h1 className='shrink-0 font-semibold text-gold-400'>LoL Config Editor</h1>
                        <span className='truncate text-[11px] text-gold-600' title={located?.path}>
                            {located?.path}
                        </span>
                    </div>

                    <div className='flex shrink-0 items-center gap-2'>
                        <button
                            type='button'
                            disabled={busy}
                            title='League rewrites this file when it exits. Locking it keeps your settings.'
                            className='border border-gold-600/40 px-3 py-1.5 text-xs text-gold-300 hover:border-gold-400 disabled:opacity-50'
                            onClick={handleToggleLock}
                        >
                            {located?.locked ? 'Locked' : 'Unlocked'}
                        </button>
                        <button
                            type='button'
                            disabled={busy}
                            className='border border-gold-400 bg-gold-400/15 px-3 py-1.5 text-xs text-gold-300 hover:bg-gold-400/25 disabled:opacity-50'
                            onClick={handleApply}
                        >
                            Apply to League
                        </button>
                    </div>
                </header>

                <div className='flex min-h-0 flex-1'>
                    <nav className='flex w-40 shrink-0 flex-col border-r border-gold-600/25 py-2'>
                        {tabs.map(item => (
                            <button
                                key={item.id}
                                type='button'
                                className={`px-4 py-2 text-left transition-colors ${
                                    item.id === tab
                                        ? 'border-l-2 border-gold-400 bg-ink-700 text-gold-400'
                                        : 'border-l-2 border-transparent text-gold-500 hover:text-gold-300'
                                }`}
                                onClick={() => setTab(item.id)}
                            >
                                {item.label}
                            </button>
                        ))}
                    </nav>

                    <main className='min-w-0 flex-1 overflow-y-auto p-5'>
                        {current ? <SettingsEditor tab={current} /> : <HotkeysPanel />}
                    </main>

                    <aside className='flex w-64 shrink-0 flex-col gap-3 border-l border-gold-600/25 p-4'>
                        <h2 className='text-[11px] font-semibold tracking-[0.18em] text-gold-400 uppercase'>
                            Profiles
                        </h2>

                        <input
                            type='text'
                            value={profileName}
                            placeholder='Profile name'
                            className='border border-gold-600/40 bg-ink-800 px-2.5 py-1.5 text-gold-300 placeholder:text-gold-600 focus:border-gold-400'
                            onChange={pointer => setProfileName(pointer.target.value)}
                        />
                        <button
                            type='button'
                            disabled={busy}
                            className='border border-gold-600/50 px-3 py-1.5 text-xs text-gold-300 hover:border-gold-400 disabled:opacity-50'
                            onClick={handleSaveProfile}
                        >
                            Save current settings
                        </button>

                        <div className='min-h-0 flex-1 overflow-y-auto'>
                            <ProfileList
                                busy={busy}
                                profiles={profiles}
                                active={profileName}
                                onLoad={handleLoadProfile}
                                onDelete={handleDeleteProfile}
                            />
                        </div>
                    </aside>
                </div>
            </div>

            <Toaster position='bottom-center' theme='dark' />
        </SettingsProvider>
    )
}
