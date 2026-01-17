import { CanvasRenderer } from '@/components/molecules/CanvasRenderer'
import { UIComponent } from '@/types/json-ui'

interface SchemaEditorCanvasProps {
  components: UIComponent[]
  selectedId: string | null
  hoveredId: string | null
  draggedOverId: string | null
  dropPosition: 'before' | 'after' | 'inside' | null
  onSelect: (id: string | null) => void
  onHover: (id: string | null) => void
  onHoverEnd: () => void
  onDragOver: (id: string, e: React.DragEvent) => void
  onDragLeave: (e: React.DragEvent) => void
  onDrop: (targetId: string, e: React.DragEvent) => void
}

export function SchemaEditorCanvas({
  components,
  selectedId,
  hoveredId,
  draggedOverId,
  dropPosition,
  onSelect,
  onHover,
  onHoverEnd,
  onDragOver,
  onDragLeave,
  onDrop,
}: SchemaEditorCanvasProps) {
  return (
    <div className="flex-1 flex flex-col">
      <CanvasRenderer
        components={components}
        selectedId={selectedId}
        hoveredId={hoveredId}
        draggedOverId={draggedOverId}
        dropPosition={dropPosition}
        onSelect={onSelect}
        onHover={onHover}
        onHoverEnd={onHoverEnd}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      />
    </div>
  )
}
