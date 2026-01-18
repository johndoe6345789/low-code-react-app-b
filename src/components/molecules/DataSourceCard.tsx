import { Card, IconButton, Stack, Flex, Text } from '@/components/atoms'
import { DataSourceBadge } from '@/components/atoms/DataSourceBadge'
import { DataSource } from '@/types/json-ui'
import { Pencil, Trash } from '@phosphor-icons/react'

interface DataSourceCardProps {
  dataSource: DataSource
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export function DataSourceCard({ dataSource, onEdit, onDelete }: DataSourceCardProps) {
  const renderTypeSpecificInfo = () => {
    if (dataSource.type === 'kv') {
      return (
        <Text variant="caption" className="font-mono bg-muted/30 px-2 py-1 rounded">
          Key: {dataSource.key || 'Not set'}
        </Text>
      )
    }
    
    return null
  }

  return (
    <Card className="bg-card/50 backdrop-blur hover:bg-card/70 transition-colors">
      <div className="p-4">
        <Flex justify="between" align="start" gap="md">
          <Stack spacing="sm" className="flex-1 min-w-0">
            <Flex align="center" gap="sm">
              <DataSourceBadge type={dataSource.type} />
              <Text variant="small" className="font-mono font-medium truncate">
                {dataSource.id}
              </Text>
            </Flex>
            
            {renderTypeSpecificInfo()}
            
          </Stack>
          
          <Flex align="center" gap="xs">
            <IconButton
              icon={<Pencil className="w-4 h-4" />}
              variant="ghost"
              size="sm"
              onClick={() => onEdit(dataSource.id)}
            />
            <IconButton
              icon={<Trash className="w-4 h-4" />}
              variant="ghost"
              size="sm"
              onClick={() => onDelete(dataSource.id)}
              className="text-destructive hover:text-destructive"
            />
          </Flex>
        </Flex>
      </div>
    </Card>
  )
}
