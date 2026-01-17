import { Card, Badge, IconButton, Stack, Flex, Text } from '@/components/atoms'
import { DataSourceBadge } from '@/components/atoms/DataSourceBadge'
import { DataSource } from '@/types/json-ui'
import { Pencil, Trash, ArrowsDownUp } from '@phosphor-icons/react'

interface DataSourceCardProps {
  dataSource: DataSource
  dependents?: DataSource[]
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export function DataSourceCard({ dataSource, dependents = [], onEdit, onDelete }: DataSourceCardProps) {
  const getDependencyCount = () => {
    if (dataSource.type === 'computed') {
      return dataSource.dependencies?.length || 0
    }
    return 0
  }

  const renderTypeSpecificInfo = () => {
    if (dataSource.type === 'kv') {
      return (
        <Text variant="caption" className="font-mono bg-muted/30 px-2 py-1 rounded">
          Key: {dataSource.key || 'Not set'}
        </Text>
      )
    }
    
    if (dataSource.type === 'computed') {
      const depCount = getDependencyCount()
      return (
        <Flex align="center" gap="sm">
          <Badge variant="outline" className="text-xs">
            <ArrowsDownUp className="w-3 h-3 mr-1" />
            {depCount} {depCount === 1 ? 'dependency' : 'dependencies'}
          </Badge>
        </Flex>
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
            
            {dependents.length > 0 && (
              <div className="pt-2 border-t border-border/50">
                <Text variant="caption">
                  Used by {dependents.length} computed {dependents.length === 1 ? 'source' : 'sources'}
                </Text>
              </div>
            )}
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
              disabled={dependents.length > 0}
            />
          </Flex>
        </Flex>
      </div>
    </Card>
  )
}
