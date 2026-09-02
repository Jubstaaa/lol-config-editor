import { Component } from 'react'

import type { ErrorInfo, ReactNode } from 'react'

interface CrashBoundaryProps {
    children: ReactNode
}

interface CrashBoundaryState {
    error: Error | null
    where: string
}

/** Without this a render error unmounts everything and the window just goes black. */
export default class CrashBoundary extends Component<CrashBoundaryProps, CrashBoundaryState> {
    state: CrashBoundaryState = { error: null, where: '' }

    static getDerivedStateFromError(error: Error): Partial<CrashBoundaryState> {
        return { error }
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        this.setState({ where: info.componentStack ?? '' })
        console.error('render failed', error, info.componentStack)
    }

    render() {
        const { error, where } = this.state
        if (!error) return this.props.children

        return (
            <div className='grid h-full place-items-center p-6'>
                <div className='max-w-full space-y-3 overflow-auto'>
                    <p className='text-sm font-semibold text-danger-400'>Something in the editor crashed</p>
                    <pre className='text-[11px] whitespace-pre-wrap text-gold-300'>
                        {String(error?.stack ?? error)}
                    </pre>
                    <pre className='text-[10px] whitespace-pre-wrap text-gold-500'>
                        {where.split('\n').slice(0, 12).join('\n')}
                    </pre>
                    <button
                        type='button'
                        className='rounded-sm bg-ink-600 px-3 py-1.5 text-xs ring-1 ring-gold-600/40'
                        onClick={() => this.setState({ error: null, where: '' })}
                    >
                        Try again
                    </button>
                </div>
            </div>
        )
    }
}
