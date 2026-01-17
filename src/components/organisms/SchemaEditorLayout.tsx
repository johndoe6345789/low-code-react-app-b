import { UIComponent, PageSchema } from '@/types/json-ui'
import { ComponentDefinition } from '@/lib/component-definitions'
import { SchemaEditorToolbar } from './SchemaEditorToolbar'
import { SchemaEditorSidebar } from './SchemaEditorSidebar'
import { SchemaEditorCanvas } from './SchemaEditorCanvas'
import { SchemaEditorPropertiesPanel } from './SchemaEditorPropertiesPanel'

interface SchemaEditorLayoutProps {
  components: UIComponent[]
  selectedId: string | null
  hoveredId: string | null
  draggedOverId: string | null
  dropPosition: 'before' | 'after' | 'inside' | null
  selectedComponent: UIComponent | null
  onSelect: (id: string | null) => void
  onHover: (id: string | null) => void
  onHoverEnd: () => void
  onComponentDragStart: (component: ComponentDefinition, e: React.DragEvent) => void
  onTreeDragStart: (id: string, e: React.DragEvent) => void
  onDragOver: (id: string, e: React.DragEvent) => void
  onDragLeave: (e: React.DragEvent) => void
  onDrop: (targetId: string, e: React.DragEvent) => void
  onUpdate: (updates: Partial<UIComponent>) => void
  onDelete: () => void
  onImport: () => void
  onExport: () => void
  onCopy: () => void
  onPreview: () => void
  onClear: () => void
}

export function SchemaEditorLayout({
  components,
  selectedId,
  hoveredId,
  draggedOverId,
  dropPosition,
  selectedComponent,
  onSelect,
  onHover,
  onHoverEnd,
  onComponentDragStart,
  onTreeDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onUpdate,
  onDelete,
  onImport,
  onExport,
  onCopy,
  onPreview,
  onClear,
}: SchemaEditorLayoutProps) {
  return (
    <div className="h-full flex flex-col bg-background">
      <SchemaEditorToolbar
        onImport={onImport}
        onExport={onExport}
        onCopy={onCopy}
        onPreview={onPreview}
        onClear={onClear}
      />

      <div className="flex-1 flex overflow-hidden">
        <SchemaEditorSidebar onDragStart={onComponentDragStart} />

        <SchemaEditorCanvas
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

        <SchemaEditorPropertiesPanel
          components={components}
          selectedId={selectedId}
          hoveredId={hoveredId}
          draggedOverId={draggedOverId}
          dropPosition={dropPosition}
          selectedComponent={selectedComponent}
          onSelect={onSelect}
          onHover={onHover}
          onHoverEnd={onHoverEnd}
          onDragStart={onTreeDragStart}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      </div>
    </div>
  )
}
