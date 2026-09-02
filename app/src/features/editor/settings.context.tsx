import { createContext, useContext } from 'react'

import type { Chord } from '../../lib/keybind'
import type { FieldDef } from '../../lib/catalog.types'
import type { SettingRef } from '../../lib/settings.types'

export interface SettingsCommands {
    /** What League has, or what League would use when it has never written the key. */
    valueOf: (field: FieldDef) => string
    set: (ref: SettingRef, value: string) => void
    /** Binds a key and clears the same key wherever else it is bound. */
    bind: (ref: SettingRef, slot: number, chord: Chord) => void
}

const SettingsContext = createContext<SettingsCommands | null>(null)

export const SettingsProvider = SettingsContext.Provider

export const useSettings = (): SettingsCommands => {
    const commands = useContext(SettingsContext)
    if (!commands) throw new Error('useSettings needs a SettingsProvider above it')

    return commands
}
