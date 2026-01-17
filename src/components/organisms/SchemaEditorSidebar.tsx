import { ComponentPalette } from '@/components/molecules/ComponentPalette'
import { ComponentDefinition } from '@/lib/component-definitions'

interface SchemaEditorSidebarProps {
  onDragStart: (component: ComponentDefinition, e: React.DragEvent) => void
}

export function SchemaEditorSidebar({ onDragStart }: SchemaEditorSidebarProps) {
  return (
    <div className="w-64 border-r border-border bg-card">
      <ComponentPalette onDragStart={onDragStart} />
    </div>
  )
}
