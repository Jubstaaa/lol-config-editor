import type { FieldProps } from './controls.types'

/**
 * League stores most of these as 0–1 floats with four decimals. The control
 * works in whole units and converts on the way back, so the file keeps the shape
 * League expects.
 */
export default function SliderField({ field, value, onChange }: FieldProps) {
    if (field.control.kind !== 'slider') return null
    const { min, max, step, scale, unit } = field.control

    const shown = Math.round(Number(value) * scale)
    const safe = Number.isFinite(shown) ? Math.min(Math.max(shown, min), max) : min

    const handleChange = (next: number) => onChange(scale === 1 ? String(next) : (next / scale).toFixed(4))

    return (
        <label className='block py-1'>
            <span className='mb-1.5 flex items-baseline justify-between gap-3'>
                <span className='text-gold-300/90'>{field.label}</span>
                <span className='tabular-nums text-gold-400'>
                    {safe}
                    {unit ?? ''}
                </span>
            </span>
            <input
                type='range'
                min={min}
                max={max}
                step={step}
                value={safe}
                className='h-1 w-full cursor-pointer appearance-none rounded-full bg-ink-500 accent-gold-400'
                onChange={pointer => handleChange(Number(pointer.target.value))}
            />
            {field.hint ? <span className='mt-1 block text-[11px] text-gold-500'>{field.hint}</span> : null}
        </label>
    )
}
