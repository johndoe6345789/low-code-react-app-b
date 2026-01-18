import { useState, useCallback } from 'react'
import { UIComponent } from '@/types/json-ui'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ComponentTreeHeader } from '@/components/molecules/component-tree/ComponentTreeHeader'
import { ComponentTreeEmptyState } from '@/components/molecules/component-tree/ComponentTreeEmptyState'
import { ComponentTreeNodes } from '@/components/molecules/component-tree/ComponentTreeNodes'

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
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  const getAllComponentIds = useCallback((comps: UIComponent[]): string[] => {
    const ids: string[] = []
    const traverse = (nodes: UIComponent[]) => {
      nodes.forEach((comp) => {
        if (Array.isArray(comp.children) && comp.children.length > 0) {
          ids.push(comp.id)
          traverse(comp.children)
        }
      })
    }
    traverse(comps)
    return ids
  }, [])

  const handleExpandAll = useCallback(() => {
    const allIds = getAllComponentIds(components)
    setExpandedIds(new Set(allIds))
  }, [components, getAllComponentIds])

  const handleCollapseAll = useCallback(() => {
    setExpandedIds(new Set())
  }, [])

  const toggleExpand = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

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
