import { ComponentTree } from '@/components/molecules/ComponentTree'
import { PropertyEditor } from '@/components/molecules/PropertyEditor'
import { Separator } from '@/components/ui/separator'
import { UIComponent } from '@/types/json-ui'

interface SchemaEditorPropertiesPanelProps {
  components: UIComponent[]
  selectedId: string | null
  hoveredId: string | null
  draggedOverId: string | null
  dropPosition: 'before' | 'after' | 'inside' | null
  selectedComponent: UIComponent | null
  onSelect: (id: string | null) => void
  onHover: (id: string | null) => void
  onHoverEnd: () => void
  onDragStart: (id: string, e: React.DragEvent) => void
  onDragOver: (id: string, e: React.DragEvent) => void
  onDragLeave: (e: React.DragEvent) => void
  onDrop: (targetId: string, e: React.DragEvent) => void
  onUpdate: (updates: Partial<UIComponent>) => void
  onDelete: () => void
}

export function SchemaEditorPropertiesPanel({
  components,
  selectedId,
  hoveredId,
  draggedOverId,
  dropPosition,
  selectedComponent,
  onSelect,
  onHover,
  onHoverEnd,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onUpdate,
  onDelete,
}: SchemaEditorPropertiesPanelProps) {
  return (
    <div className="w-80 border-l border-border bg-card flex flex-col">
      <div className="flex-1 overflow-hidden">
        <ComponentTree
          components={components}
          selectedId={selectedId}
          hoveredId={hoveredId}
          draggedOverId={draggedOverId}
          dropPosition={dropPosition}
          onSelect={onSelect}
          onHover={onHover}
          onHoverEnd={onHoverEnd}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        />
      </div>
      
      <Separator />
      
      <div className="flex-1 overflow-hidden">
        <PropertyEditor
          component={selectedComponent}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      </div>
    </div>
  )
}
