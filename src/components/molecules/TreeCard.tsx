import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ActionIcon } from '@/components/atoms'
import { ComponentTree } from '@/types/project'

interface TreeCardProps {
  tree: ComponentTree
  isSelected: boolean
  onSelect: () => void
  onEdit: () => void
  onDuplicate: () => void
  onDelete: () => void
  disableDelete?: boolean
}

export function TreeCard({
  tree,
  isSelected,
  onSelect,
  onEdit,
  onDuplicate,
  onDelete,
  disableDelete = false,
}: TreeCardProps) {
  return (
    <Card
      className={`cursor-pointer transition-all ${
        isSelected ? 'ring-2 ring-primary bg-accent' : 'hover:bg-accent/50'
      }`}
      onClick={onSelect}
    >
      <CardHeader className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-sm truncate">{tree.name}</CardTitle>
            {tree.description && (
              <CardDescription className="text-xs mt-1 line-clamp-2">
                {tree.description}
              </CardDescription>
            )}
            <div className="flex gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                {tree.rootNodes.length} components
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex gap-1 mt-2" onClick={(e) => e.stopPropagation()}>
          <Button size="sm" variant="ghost" onClick={onEdit} title="Edit tree">
            <ActionIcon action="edit" size={14} />
          </Button>
          <Button size="sm" variant="ghost" onClick={onDuplicate} title="Duplicate tree">
            <ActionIcon action="copy" size={14} />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={onDelete}
            disabled={disableDelete}
            title="Delete tree"
          >
            <ActionIcon action="delete" size={14} />
          </Button>
        </div>
      </CardHeader>
    </Card>
  )
}
