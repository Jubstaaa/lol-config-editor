// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import KeybindCapture from './keybind-capture'

afterEach(cleanup)

const renderCapture = () => {
    const handlers = { onBind: vi.fn(), onUnbind: vi.fn(), onCancel: vi.fn() }
    render(<KeybindCapture label='Cast spell 1' {...handlers} />)
    return handlers
}

const click = (element: HTMLElement) => {
    fireEvent.mouseDown(element, { button: 0 })
    fireEvent.mouseUp(element, { button: 0 })
    fireEvent.click(element)
}

describe('the keybind capture', () => {
    it('is a dialog named after the setting being bound', () => {
        renderCapture()
        expect(screen.getByRole('dialog', { name: /press a key to bind/i })).toHaveProperty(
            'textContent',
            expect.stringContaining('Cast spell 1')
        )
    })

    it('records a key press as the binding', () => {
        const { onBind } = renderCapture()
        fireEvent.keyDown(document, { key: 'q' })
        fireEvent.keyUp(document, { key: 'q' })
        expect(onBind).toHaveBeenCalledWith(['q'])
    })

    it('records a click on the backdrop as a mouse binding', () => {
        const { onBind } = renderCapture()
        fireEvent.mouseDown(document.body, { button: 0 })
        fireEvent.mouseUp(document.body, { button: 0 })
        expect(onBind).toHaveBeenCalledWith(['Button 1'])
    })

    it('treats a click on Unbind as unbinding, not as binding the left button', () => {
        const { onBind, onUnbind } = renderCapture()
        click(screen.getByRole('button', { name: 'Unbind' }))
        expect(onBind).not.toHaveBeenCalled()
        expect(onUnbind).toHaveBeenCalledOnce()
    })

    it('treats a click on Cancel as cancelling', () => {
        const { onBind, onCancel } = renderCapture()
        click(screen.getByRole('button', { name: 'Cancel' }))
        expect(onBind).not.toHaveBeenCalled()
        expect(onCancel).toHaveBeenCalledOnce()
    })

    it('closes on Escape without binding anything', () => {
        const { onBind, onCancel } = renderCapture()
        fireEvent.keyDown(document, { key: 'Escape' })
        expect(onCancel).toHaveBeenCalled()
        expect(onBind).not.toHaveBeenCalled()
    })
})
