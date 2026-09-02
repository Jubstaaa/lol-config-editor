import type { FieldProps } from './controls.types'

export default function ChoiceField({ field, value, onChange }: FieldProps) {
    if (field.control.kind !== 'choice') return null
    const { options } = field.control

    return (
        <label className='block py-1'>
            <span className='mb-1.5 block text-gold-300/90'>{field.label}</span>
            <select
                value={value}
                className='w-full appearance-none border border-gold-600/40 bg-ink-800 px-2.5 py-1.5 text-gold-300 hover:border-gold-500 focus:border-gold-400'
                onChange={pointer => onChange(pointer.target.value)}
            >
                {options.map(option => (
                    <option key={option.value} value={option.value} className='bg-ink-800'>
                        {option.label}
                    </option>
                ))}
            </select>
            {field.hint ? <span className='mt-1 block text-[11px] text-gold-500'>{field.hint}</span> : null}
        </label>
    )
}
