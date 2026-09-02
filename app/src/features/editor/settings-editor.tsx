import SettingField from '../controls/setting-field'

import type { GroupDef, TabDef } from '../../lib/catalog/catalog.types'

const Group = ({ group }: { group: GroupDef }) => (
    <section className='space-y-2'>
        <header>
            <h3 className='text-[11px] font-semibold tracking-[0.18em] text-gold-400 uppercase'>
                {group.label}
            </h3>
            {group.hint ? <p className='mt-0.5 text-[11px] text-gold-600'>{group.hint}</p> : null}
        </header>

        <div className='grid grid-cols-1 gap-x-8 gap-y-0.5 md:grid-cols-2'>
            {group.fields.map(field => (
                <div key={`${field.ref.key}-${field.label}`} className={field.wide ? 'md:col-span-2' : ''}>
                    <SettingField field={field} />
                </div>
            ))}
        </div>
    </section>
)

export default function SettingsEditor({ tab }: { tab: TabDef }) {
    return (
        <div className='space-y-7'>
            {tab.groups.map(group => (
                <Group key={group.label} group={group} />
            ))}
        </div>
    )
}
