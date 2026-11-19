// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import ProfileList from './profile-list'

afterEach(cleanup)

describe('deleting a profile', () => {
    const renderList = () => {
        const handlers = { onLoad: vi.fn(), onDelete: vi.fn() }
        render(
            <ProfileList
                busy={false}
                profiles={[{ name: 'ranked', path: '/p/ranked.json' }]}
                active=''
                {...handlers}
            />
        )
        fireEvent.click(screen.getByRole('button', { name: 'Delete ranked' }))
        return handlers
    }

    it('asks in a dialog that starts on Cancel', () => {
        renderList()
        expect(screen.getByRole('dialog', { name: /delete the profile ranked/i })).toBeTruthy()
        expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Cancel' }))
    })

    it('keeps the profile when Escape is pressed', () => {
        const { onDelete } = renderList()
        fireEvent.keyDown(document.activeElement ?? document.body, { key: 'Escape' })
        expect(screen.queryByRole('dialog')).toBeNull()
        expect(onDelete).not.toHaveBeenCalled()
    })
})
