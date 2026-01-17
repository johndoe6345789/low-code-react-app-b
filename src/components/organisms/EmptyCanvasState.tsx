import { Button } from '@/components/ui/button'
import { Plus, Folder } from '@phosphor-icons/react'

interface EmptyCanvasStateProps {
  onAddFirstComponent?: () => void
  onImportSchema?: () => void
}

export function EmptyCanvasState({ onAddFirstComponent, onImportSchema }: EmptyCanvasStateProps) {
  return (
    <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-muted/20">
      <div className="mb-6 relative">
        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
          <Folder className="w-12 h-12 text-primary" weight="duotone" />
        </div>
      </div>
      
      <h3 className="text-xl font-semibold mb-2">Empty Canvas</h3>
      <p className="text-sm text-muted-foreground max-w-md mb-6">
        Start building your UI by dragging components from the left panel, or import an existing schema.
      </p>
      
      <div className="flex items-center gap-3">
        {onImportSchema && (
          <Button variant="outline" onClick={onImportSchema}>
            <Folder className="w-4 h-4 mr-2" />
            Import Schema
          </Button>
        )}
        {onAddFirstComponent && (
          <Button onClick={onAddFirstComponent}>
            <Plus className="w-4 h-4 mr-2" />
            Add Component
          </Button>
        )}
      </div>
    </div>
  )
}
