import { Plus, Folder } from '@phosphor-icons/react'
import { EmptyState, ActionButton, Stack } from '@/components/atoms'

interface EmptyCanvasStateProps {
  onAddFirstComponent?: () => void
  onImportSchema?: () => void
}

export function EmptyCanvasState({ onAddFirstComponent, onImportSchema }: EmptyCanvasStateProps) {
  return (
    <div className="h-full flex flex-col items-center justify-center p-8 bg-muted/20">
      <EmptyState
        icon={<Folder size={64} weight="duotone" />}
        title="Empty Canvas"
        description="Start building your UI by dragging components from the left panel, or import an existing schema."
      >
        <Stack direction="horizontal" spacing="md" className="mt-4">
          {onImportSchema && (
            <ActionButton
              icon={<Folder size={16} />}
              label="Import Schema"
              onClick={onImportSchema}
              variant="outline"
            />
          )}
          {onAddFirstComponent && (
            <ActionButton
              icon={<Plus size={16} />}
              label="Add Component"
              onClick={onAddFirstComponent}
              variant="default"
            />
          )}
        </Stack>
      </EmptyState>
    </div>
  )
}
