import type { FieldDef } from '../../lib/catalog.types'

export interface FieldProps {
    field: FieldDef
    value: string
    onChange: (value: string) => void
}
