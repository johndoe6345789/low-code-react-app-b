import { UIComponent } from '@/types/json-ui'
import { ComponentTreeNode } from '@/components/atoms/ComponentTreeNode'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Tree, Plus } from '@phosphor-icons/react'

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
  const renderTree = (comps: UIComponent[], depth = 0) => {
    return comps.map((comp) => (
      <div key={comp.id}>
        <ComponentTreeNode
          component={comp}
          isSelected={selectedId === comp.id}
          isHovered={hoveredId === comp.id}
          isDraggedOver={draggedOverId === comp.id}
          dropPosition={draggedOverId === comp.id ? dropPosition : null}
          onSelect={() => onSelect(comp.id)}
          onHover={() => onHover(comp.id)}
          onHoverEnd={onHoverEnd}
          onDragStart={(e) => onDragStart(comp.id, e)}
          onDragOver={(e) => onDragOver(comp.id, e)}
          onDragLeave={onDragLeave}
          onDrop={(e) => onDrop(comp.id, e)}
          depth={depth}
        />
        {Array.isArray(comp.children) && comp.children.length > 0 && (
          <div>{renderTree(comp.children, depth + 1)}</div>
        )}
      </div>
    ))
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Tree className="w-5 h-5 text-primary" weight="duotone" />
          <h2 className="text-lg font-semibold">Component Tree</h2>
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        {components.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <Tree className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">No components yet</p>
            <p className="text-xs mt-1">Drag components from the palette</p>
          </div>
        ) : (
          <div className="py-2">{renderTree(components)}</div>
        )}
      </ScrollArea>
    </div>
  )
}
