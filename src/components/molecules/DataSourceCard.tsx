import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DataSourceBadge } from '@/components/atoms/DataSourceBadge'
import { DataSource } from '@/types/json-ui'
import { Pencil, Trash, ArrowsDownUp } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'

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
        <div className="text-xs text-muted-foreground font-mono bg-muted/30 px-2 py-1 rounded">
          Key: {dataSource.key || 'Not set'}
        </div>
      )
    }
    
    if (dataSource.type === 'computed') {
      const depCount = getDependencyCount()
      return (
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            <ArrowsDownUp className="w-3 h-3 mr-1" />
            {depCount} {depCount === 1 ? 'dependency' : 'dependencies'}
          </Badge>
        </div>
      )
    }
    
    return null
  }

  return (
    <Card className="bg-card/50 backdrop-blur hover:bg-card/70 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <DataSourceBadge type={dataSource.type} />
              <span className="font-mono text-sm font-medium truncate">
                {dataSource.id}
              </span>
            </div>
            
            {renderTypeSpecificInfo()}
            
            {dependents.length > 0 && (
              <div className="mt-2 pt-2 border-t border-border/50">
                <span className="text-xs text-muted-foreground">
                  Used by {dependents.length} computed {dependents.length === 1 ? 'source' : 'sources'}
                </span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onEdit(dataSource.id)}
              className="h-8 w-8 p-0"
            >
              <Pencil className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(dataSource.id)}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              disabled={dependents.length > 0}
            >
              <Trash className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
