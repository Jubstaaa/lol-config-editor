import type { FieldProps } from './controls.types'

/** League writes '1' and '0'; a few settings mean the opposite of their label. */
export default function ToggleField({ field, value, onChange }: FieldProps) {
    const invert = field.control.kind === 'toggle' && field.control.invert === true
    const checked = invert ? value === '0' : value === '1'

    const handleChange = (next: boolean) => onChange((invert ? !next : next) ? '1' : '0')

    return (
        <label className='group flex cursor-pointer items-start gap-2.5 py-1'>
            <input
                type='checkbox'
                checked={checked}
                className='sr-only'
                onChange={pointer => handleChange(pointer.target.checked)}
            />
            <span
                aria-hidden
                className={`mt-px grid size-4 shrink-0 place-items-center border transition-colors ${
                    checked
                        ? 'border-gold-400 bg-gold-400/20'
                        : 'border-gold-600/50 bg-ink-800 group-hover:border-gold-500'
                }`}
            >
                {checked ? <span className='size-2 bg-gold-400' /> : null}
            </span>
            <span className='leading-snug text-gold-300/90'>
                {field.label}
                {field.hint ? <span className='block text-[11px] text-gold-500'>{field.hint}</span> : null}
            </span>
        </label>
    )
}
