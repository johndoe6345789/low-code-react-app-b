import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ActionButton, Heading, Stack, Text } from '@/components/atoms'
import { Plus, Database, Function, FileText } from '@phosphor-icons/react'
import { DataSourceType } from '@/types/json-ui'

interface DataSourceManagerHeaderCopy {
  title: string
  description: string
  addLabel: string
  menu: {
    kv: string
    computed: string
    static: string
  }
}

interface DataSourceManagerHeaderProps {
  copy: DataSourceManagerHeaderCopy
  onAdd: (type: DataSourceType) => void
}

export function DataSourceManagerHeader({ copy, onAdd }: DataSourceManagerHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <Stack direction="vertical" spacing="xs">
        <Heading level={2}>{copy.title}</Heading>
        <Text variant="muted">
          {copy.description}
        </Text>
      </Stack>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div>
            <ActionButton
              icon={<Plus size={16} />}
              label={copy.addLabel}
              variant="default"
              onClick={() => {}}
            />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onAdd('kv')}>
            <Database className="w-4 h-4 mr-2" />
            {copy.menu.kv}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAdd('computed')}>
            <Function className="w-4 h-4 mr-2" />
            {copy.menu.computed}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAdd('static')}>
            <FileText className="w-4 h-4 mr-2" />
            {copy.menu.static}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
