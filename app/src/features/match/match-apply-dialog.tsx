interface MatchApplyDialogProps {
    onReconnect: () => void
    onAfterMatch: () => void
    onCancel: () => void
}

/** Shown when "Apply" is pressed while a match is running. */
export default function MatchApplyDialog({ onReconnect, onAfterMatch, onCancel }: MatchApplyDialogProps) {
    return (
        <div className='fixed inset-0 z-50 grid place-items-center bg-ink-900/80 p-6'>
            <div className='w-full max-w-sm space-y-3 border border-gold-600/50 bg-ink-800 p-5'>
                <h2 className='text-sm font-semibold text-gold-400'>A match is running</h2>
                <p className='text-[11px] text-gold-600'>
                    League only reads settings when a match loads, and writes its own back when it closes — so
                    a change written now would be ignored, then overwritten.
                </p>

                <div className='space-y-2'>
                    <button
                        type='button'
                        className='w-full border border-gold-400 bg-gold-400/15 px-3 py-2 text-left text-xs text-gold-300 hover:bg-gold-400/25'
                        onClick={onReconnect}
                    >
                        <span className='block font-semibold'>Apply now and reconnect</span>
                        <span className='block text-[11px] text-gold-500'>
                            Closes the game and rejoins the match with the new settings.
                        </span>
                    </button>
                    <button
                        type='button'
                        className='w-full border border-gold-600/40 px-3 py-2 text-left text-xs text-gold-300 hover:border-gold-400'
                        onClick={onAfterMatch}
                    >
                        <span className='block font-semibold'>Apply after the match</span>
                        <span className='block text-[11px] text-gold-500'>
                            Waits for the game to close, then writes them for the next one.
                        </span>
                    </button>
                </div>

                <div className='flex justify-end pt-1'>
                    <button
                        type='button'
                        className='border border-gold-600/30 px-3 py-1.5 text-xs text-gold-500 hover:border-gold-500'
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}
