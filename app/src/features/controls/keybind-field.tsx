import { useState } from 'react'

import KeybindCapture from './keybind-capture'
import { UNBOUND, labelOfChord, slotOf } from '../../lib/keybind/keybind'

import type { Chord } from '../../lib/keybind/keybind'
import type { FieldProps } from './controls.types'

interface KeybindFieldProps extends FieldProps {
    /** Shown as the button's own caption when the row has no label of its own. */
    bare?: boolean
    onBind: (chord: Chord) => void
}

export default function KeybindField({ field, value, bare, onBind }: KeybindFieldProps) {
    const [capturing, setCapturing] = useState(false)

    if (field.control.kind !== 'keybind') return null
    const { slot } = field.control

    const chord = slotOf(value, slot)
    const shown = labelOfChord(chord)

    const finish = (next: Chord) => {
        setCapturing(false)
        onBind(next)
    }

    return (
        <>
            <button
                type='button'
                title={field.label}
                className={`w-full min-w-0 truncate border px-2 py-1.5 text-xs transition-colors ${
                    shown
                        ? 'border-gold-600/40 bg-ink-800 text-gold-300 hover:border-gold-400'
                        : 'border-ink-500 bg-ink-800/50 text-gold-600 hover:border-gold-600'
                }`}
                onClick={() => setCapturing(true)}
            >
                {shown || (bare ? '—' : 'Unbound')}
            </button>

            {capturing ? (
                <KeybindCapture
                    label={field.label}
                    onBind={finish}
                    onUnbind={() => finish([UNBOUND])}
                    onCancel={() => setCapturing(false)}
                />
            ) : null}
        </>
    )
}
