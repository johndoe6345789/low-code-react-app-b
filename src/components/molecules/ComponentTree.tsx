import { UIComponent } from '@/types/json-ui'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ComponentTreeHeader } from '@/components/molecules/component-tree/ComponentTreeHeader'
import { ComponentTreeEmptyState } from '@/components/molecules/component-tree/ComponentTreeEmptyState'
import { ComponentTreeNodes } from '@/components/molecules/component-tree/ComponentTreeNodes'
import { useComponentTreeExpansion } from '@/hooks/use-component-tree-expansion'

interface ComponentTreeProps {
  components: UIComponent[]
  selectedId: string | null
  hoveredId: string | null
  draggedOverId: string | null
  dropPosition: 'before' | 'after' | 'inside' | null
  onSelect: (id: string) => void
  onHover: (id: string) => void
  onHoverEnd: () => void
  onDragStart: (id: string, e: React.DragEvent) => void
  onDragOver: (id: string, e: React.DragEvent) => void
  onDragLeave: (e: React.DragEvent) => void
  onDrop: (id: string, e: React.DragEvent) => void
}

export function ComponentTree({
  components,
  selectedId,
  hoveredId,
  draggedOverId,
  dropPosition,
  onSelect,
  onHover,
  onHoverEnd,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
}: ComponentTreeProps) {
  const { expandedIds, handleExpandAll, handleCollapseAll, toggleExpand } =
    useComponentTreeExpansion(components)

  return (
    <div className="h-full flex flex-col">
      <ComponentTreeHeader
        componentsCount={components.length}
        onExpandAll={handleExpandAll}
        onCollapseAll={handleCollapseAll}
      />

      <ScrollArea className="flex-1">
        {components.length === 0 ? (
          <ComponentTreeEmptyState />
        ) : (
          <div className="py-2">
            <ComponentTreeNodes
              components={components}
              expandedIds={expandedIds}
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
              onToggleExpand={toggleExpand}
            />
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
