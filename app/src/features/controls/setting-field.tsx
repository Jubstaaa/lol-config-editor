import ChoiceField from './choice-field'
import KeybindField from './keybind-field'
import SliderField from './slider-field'
import ToggleField from './toggle-field'
import { useSettings } from '../editor/settings.context'

import type { FieldDef } from '../../lib/catalog.types'

interface SettingFieldProps {
    field: FieldDef
    bare?: boolean
}

/** Picks the control the catalogue asked for and wires it to the config. */
export default function SettingField({ field, bare }: SettingFieldProps) {
    const { valueOf, set, bind } = useSettings()

    const value = valueOf(field)
    const handleChange = (next: string) => set(field.ref, next)

    switch (field.control.kind) {
        case 'toggle':
            return <ToggleField field={field} value={value} onChange={handleChange} />
        case 'slider':
            return <SliderField field={field} value={value} onChange={handleChange} />
        case 'choice':
            return <ChoiceField field={field} value={value} onChange={handleChange} />
        case 'keybind':
            return (
                <KeybindField
                    field={field}
                    value={value}
                    bare={bare}
                    onChange={handleChange}
                    onBind={chord =>
                        bind(field.ref, field.control.kind === 'keybind' ? field.control.slot : 0, chord)
                    }
                />
            )
    }
}
