// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import AccountDialog from './account-dialog'

afterEach(cleanup)

describe('the account dialog', () => {
    const handlers = () => ({
        onCancel: vi.fn(),
        onCapture: vi.fn(),
        onSave: vi.fn(),
        onRecapture: vi.fn(),
        onDelete: vi.fn(),
    })

    it('is a dialog named by its heading, focused on the label field', () => {
        render(<AccountDialog busy={false} account={null} {...handlers()} />)
        expect(screen.getByRole('dialog', { name: 'Add the signed-in account' })).toBeTruthy()
        expect(document.activeElement).toBe(screen.getByRole('textbox', { name: 'Label' }))
    })

    it('cancels on Escape', () => {
        const props = handlers()
        render(<AccountDialog busy={false} account={null} {...props} />)
        fireEvent.keyDown(document.activeElement ?? document.body, { key: 'Escape' })
        expect(props.onCancel).toHaveBeenCalledOnce()
    })
})
