import { DataSource } from '@/types/json-ui'
import { DataSourceCard } from '@/components/molecules/DataSourceCard'
import { IconText, Section, Stack } from '@/components/atoms'
import { ReactNode } from 'react'

interface DataSourceGroupSectionProps {
  icon: ReactNode
  label: string
  dataSources: DataSource[]
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export function DataSourceGroupSection({
  icon,
  label,
  dataSources,
  onEdit,
  onDelete,
}: DataSourceGroupSectionProps) {
  if (dataSources.length === 0) {
    return null
  }

  return (
    <Section>
      <IconText
        icon={icon}
        className="text-sm font-semibold mb-3"
      >
        {label} ({dataSources.length})
      </IconText>
      <Stack direction="vertical" spacing="sm">
        {dataSources.map(ds => (
          <DataSourceCard
            key={ds.id}
            dataSource={ds}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </Stack>
    </Section>
  )
}
