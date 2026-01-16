import { Button } from '@/components/ui/button'
import { TreeIcon, ActionIcon } from '@/components/atoms'

interface TreeListHeaderProps {
  onCreateNew: () => void
  onImportJson: () => void
  onExportJson: () => void
  hasSelectedTree?: boolean
}

export function TreeListHeader({
  onCreateNew,
  onImportJson,
  onExportJson,
  hasSelectedTree = false,
}: TreeListHeaderProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <TreeIcon size={20} />
          Component Trees
        </h2>
        <Button size="sm" onClick={onCreateNew}>
          <ActionIcon action="add" size={16} />
        </Button>
      </div>
      
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={onImportJson}
          className="flex-1 text-xs"
        >
          <ActionIcon action="upload" size={14} className="mr-1.5" />
          Import JSON
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={onExportJson}
          disabled={!hasSelectedTree}
          className="flex-1 text-xs"
        >
          <ActionIcon action="download" size={14} className="mr-1.5" />
          Export JSON
        </Button>
      </div>
    </div>
  )
}
