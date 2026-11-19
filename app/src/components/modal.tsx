import * as Dialog from '@radix-ui/react-dialog'

import type { ReactNode, RefObject } from 'react'

interface ModalProps {
    children: ReactNode
    /** Panel classes; the backdrop is shared. */
    className: string
    onClose: () => void
    /** What takes focus on open, when the first control would be the wrong default. */
    initialFocus?: RefObject<HTMLElement | null>
    /** For a dialog that handles Escape itself. */
    keepOpenOnEscape?: boolean
}

/**
 * Every overlay in the app: a labelled modal dialog that traps focus, closes on
 * Escape and gives focus back to whatever opened it. Clicking the backdrop does
 * nothing, as before — the keybind capture records clicks there.
 *
 * Callers name it with `Modal.Title` and describe it with `Modal.Description`.
 */
export default function Modal({ children, className, onClose, initialFocus, keepOpenOnEscape }: ModalProps) {
    return (
        <Dialog.Root
            open
            onOpenChange={open => {
                if (!open) onClose()
            }}
        >
            <Dialog.Portal>
                <Dialog.Overlay className='fixed inset-0 z-50 grid place-items-center bg-ink-900/80 p-6'>
                    <Dialog.Content
                        className={className}
                        onInteractOutside={event => event.preventDefault()}
                        onEscapeKeyDown={event => {
                            if (keepOpenOnEscape) event.preventDefault()
                        }}
                        onOpenAutoFocus={event => {
                            if (!initialFocus?.current) return
                            event.preventDefault()
                            initialFocus.current.focus()
                        }}
                    >
                        {children}
                    </Dialog.Content>
                </Dialog.Overlay>
            </Dialog.Portal>
        </Dialog.Root>
    )
}

Modal.Title = Dialog.Title
Modal.Description = Dialog.Description
