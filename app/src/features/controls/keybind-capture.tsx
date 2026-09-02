import { useCallback, useEffect, useRef, useState } from 'react'

import { orderTokens, tokenForButton, tokenForKey } from '../../lib/keys'
import { labelOfChord } from '../../lib/keybind'

import type { Chord } from '../../lib/keybind'

interface KeybindCaptureProps {
    label: string
    onBind: (chord: Chord) => void
    onUnbind: () => void
    onCancel: () => void
}

/**
 * Records the next key or mouse press.
 *
 * Every listener is a named function so the cleanup can actually remove it. The
 * first version passed a fresh arrow to both add and remove for `contextmenu`,
 * which removed nothing — right-click stayed dead for the rest of the session
 * and another listener piled up each time the dialog opened.
 */
export default function KeybindCapture({ label, onBind, onUnbind, onCancel }: KeybindCaptureProps) {
    const [held, setHeld] = useState<Chord>([])
    // The listeners are registered once; a ref keeps them reading the live chord
    // instead of the one captured when they were created.
    const holding = useRef<Chord>([])
    const settled = useRef(false)

    const add = useCallback((token: string) => {
        if (settled.current || holding.current.includes(token)) return

        holding.current = orderTokens([...holding.current, token])
        setHeld(holding.current)
    }, [])

    const settle = useCallback(() => {
        if (settled.current || holding.current.length === 0) return

        settled.current = true
        onBind(holding.current)
    }, [onBind])

    useEffect(() => {
        const handleKeyDown = (moment: KeyboardEvent) => {
            moment.preventDefault()
            if (moment.key === 'Escape' && holding.current.length === 0) {
                onCancel()
                return
            }
            add(tokenForKey(moment.key))
        }

        const handleMouseDown = (moment: MouseEvent) => {
            moment.preventDefault()
            add(tokenForButton(moment.button))
        }

        const handleRelease = (moment: Event) => {
            moment.preventDefault()
            settle()
        }

        const handleContextMenu = (moment: Event) => moment.preventDefault()

        document.addEventListener('keydown', handleKeyDown, true)
        document.addEventListener('keyup', handleRelease, true)
        document.addEventListener('mousedown', handleMouseDown, true)
        document.addEventListener('mouseup', handleRelease, true)
        document.addEventListener('contextmenu', handleContextMenu, true)

        return () => {
            document.removeEventListener('keydown', handleKeyDown, true)
            document.removeEventListener('keyup', handleRelease, true)
            document.removeEventListener('mousedown', handleMouseDown, true)
            document.removeEventListener('mouseup', handleRelease, true)
            document.removeEventListener('contextmenu', handleContextMenu, true)
        }
    }, [add, onCancel, settle])

    return (
        <div className='fixed inset-0 z-50 grid place-items-center bg-ink-900/80 p-6'>
            <div className='w-full max-w-sm border border-gold-600/50 bg-ink-800 p-5 text-center shadow-2xl'>
                <p className='text-[11px] tracking-[0.18em] text-gold-500 uppercase'>Press a key to bind</p>
                <p className='mt-2 text-sm text-gold-300'>{label}</p>

                <p className='my-5 min-h-8 text-xl font-semibold text-gold-400'>
                    {labelOfChord(held) || <span className='text-gold-600'>waiting…</span>}
                </p>

                <div className='flex justify-center gap-2'>
                    <button
                        type='button'
                        className='border border-gold-600/50 px-3 py-1.5 text-xs text-gold-300 hover:border-gold-400'
                        onClick={onUnbind}
                    >
                        Unbind
                    </button>
                    <button
                        type='button'
                        className='border border-gold-600/30 px-3 py-1.5 text-xs text-gold-500 hover:border-gold-500'
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                </div>
                <p className='mt-3 text-[11px] text-gold-600'>Esc closes this without changing anything.</p>
            </div>
        </div>
    )
}
