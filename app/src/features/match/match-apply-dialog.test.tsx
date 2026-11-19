// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import MatchApplyDialog from './match-apply-dialog'

afterEach(cleanup)

describe('the mid-match apply dialog', () => {
    const renderDialog = () => {
        const handlers = { onReconnect: vi.fn(), onAfterMatch: vi.fn(), onCancel: vi.fn() }
        render(<MatchApplyDialog {...handlers} />)
        return handlers
    }

    it('is a modal dialog named by its heading', () => {
        renderDialog()
        expect(screen.getByRole('dialog', { name: 'A match is running' })).toBeTruthy()
    })

    it('starts on Cancel, so Enter cannot close the game by accident', () => {
        renderDialog()
        expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Cancel' }))
    })

    it('cancels on Escape', () => {
        const { onCancel, onReconnect } = renderDialog()
        fireEvent.keyDown(document.activeElement ?? document.body, { key: 'Escape' })
        expect(onCancel).toHaveBeenCalledOnce()
        expect(onReconnect).not.toHaveBeenCalled()
    })
})
