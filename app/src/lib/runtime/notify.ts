import { toast } from 'sonner'

const WORK = 'lol-config-work'

// Only a spinner left behind should be cleared; finished results must stay readable.
let loading = false

/** One toast per operation, updated in place as progress arrives. */
export const notifyProgress = (message: string) => {
    loading = true
    toast.loading(message, { id: WORK, duration: Infinity })
}

export const notifyDone = (message: string) => {
    loading = false
    toast.success(message, { id: WORK, duration: 2200 })
}

export const notifyFailed = (message: string) => {
    loading = false
    toast.error(message, { id: WORK, duration: 6000 })
}

export const notifyIdle = () => {
    if (loading) toast.dismiss(WORK)
    loading = false
}
