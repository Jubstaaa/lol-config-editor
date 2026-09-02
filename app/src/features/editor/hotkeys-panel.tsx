import { useState } from 'react'

import SettingField from '../controls/setting-field'
import { CASTABLE, HOTKEY_GROUPS, quickbindFor } from '../../lib/catalog/hotkeys'
import { quickbind } from '../../lib/catalog/catalog.builders'
import { useSettings } from './settings.context'

import type { HotkeyGroup, HotkeyTable } from '../../lib/catalog/hotkeys'

const Table = ({ table }: { table: HotkeyTable }) => (
    <div className='min-w-0'>
        <p className='mb-1.5 text-[11px] font-semibold tracking-[0.14em] text-gold-500 uppercase'>
            {table.label}
        </p>
        <div className='space-y-1'>
            {table.rows.map(row => (
                <div key={row[0].label} className='grid grid-cols-[1fr_auto_auto] items-center gap-2'>
                    <span className='truncate text-gold-300/80' title={row[0].label}>
                        {row[0].label}
                    </span>
                    {row.map(field => (
                        <div key={field.control.kind === 'keybind' ? field.control.slot : 0} className='w-28'>
                            <SettingField field={field} bare />
                        </div>
                    ))}
                </div>
            ))}
        </div>
    </div>
)

const Group = ({ group, open, onToggle }: { group: HotkeyGroup; open: boolean; onToggle: () => void }) => (
    <section className='border border-gold-600/25'>
        <button
            type='button'
            className='flex w-full items-center justify-between px-3 py-2 text-left hover:bg-ink-700/60'
            onClick={onToggle}
        >
            <span className='text-xs font-semibold tracking-[0.14em] text-gold-400 uppercase'>
                {group.label}
            </span>
            <span aria-hidden className='text-gold-500'>
                {open ? '−' : '+'}
            </span>
        </button>

        {open ? (
            <div className='grid gap-6 border-t border-gold-600/20 p-3 lg:grid-cols-2'>
                {group.tables.map(table => (
                    <Table key={table.label} table={table} />
                ))}
            </div>
        ) : null}
    </section>
)

/**
 * The quick-cast flags League keeps beside each default binding. Setting them all
 * at once is addressed by name; the first version walked
 * `files[1].sections[2].settings[0..12]` by index, which happened to be right
 * only for as long as Riot never reordered the file.
 */
const QuickCastAll = () => {
    const { set } = useSettings()

    const setAll = (value: string) => {
        for (const target of CASTABLE) set(quickbind(quickbindFor(target)), value)
    }

    return (
        <div className='flex flex-wrap items-center gap-2'>
            <span className='text-gold-500'>Set every ability and item to</span>
            <button
                type='button'
                className='border border-gold-600/50 px-3 py-1.5 text-xs text-gold-300 hover:border-gold-400'
                onClick={() => setAll('1')}
            >
                Quick cast
            </button>
            <button
                type='button'
                className='border border-gold-600/50 px-3 py-1.5 text-xs text-gold-300 hover:border-gold-400'
                onClick={() => setAll('0')}
            >
                Normal cast
            </button>
        </div>
    )
}

export default function HotkeysPanel() {
    const [open, setOpen] = useState<string[]>([HOTKEY_GROUPS[0].label])

    const toggle = (label: string) =>
        setOpen(current =>
            current.includes(label) ? current.filter(item => item !== label) : [...current, label]
        )

    return (
        <div className='space-y-4'>
            <QuickCastAll />

            <div className='space-y-2'>
                {HOTKEY_GROUPS.map(group => (
                    <Group
                        key={group.label}
                        group={group}
                        open={open.includes(group.label)}
                        onToggle={() => toggle(group.label)}
                    />
                ))}
            </div>
        </div>
    )
}
