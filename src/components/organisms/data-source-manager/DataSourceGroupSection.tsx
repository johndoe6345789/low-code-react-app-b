import { DataSource } from '@/types/json-ui'
import { IconText, Section, Stack } from '@/components/atoms'
import { ReactNode } from 'react'

interface DataSourceGroupSectionProps {
  icon: ReactNode
  label: string
  dataSources: DataSource[]
  getDependents: (id: string) => string[]
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export function DataSourceGroupSection({
  icon,
  label,
  dataSources,
  getDependents,
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
          <div
            key={ds.id}
            className="p-3 border rounded-md hover:bg-gray-50"
          >
            <div className="font-medium text-sm">{ds.id}</div>
            <button
              onClick={() => onEdit(ds.id)}
              className="text-xs text-blue-600 hover:underline mr-2"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(ds.id)}
              className="text-xs text-red-600 hover:underline"
            >
              Delete
            </button>
          </div>
        ))}
      </Stack>
    </Section>
  )
}
