import { useState, useCallback } from 'react'
import { UIComponent } from '@/types/json-ui'
import { ComponentTreeNode } from '@/components/atoms/ComponentTreeNode'
import { PanelHeader } from '@/components/atoms'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Tree, CaretDown, CaretRight } from '@phosphor-icons/react'

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
    const traverse = (components: UIComponent[]) => {
      components.forEach((comp) => {
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

  const renderTree = (comps: UIComponent[], depth = 0) => {
    return comps.map((comp) => {
      const hasChildren = Array.isArray(comp.children) && comp.children.length > 0
      const isExpanded = expandedIds.has(comp.id)

      return (
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
            hasChildren={hasChildren}
            isExpanded={isExpanded}
            onToggleExpand={() => toggleExpand(comp.id)}
          />
          {hasChildren && isExpanded && comp.children && (
            <div>{renderTree(comp.children, depth + 1)}</div>
          )}
        </div>
      )
    })
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <PanelHeader
            title="Component Tree"
            subtitle={`${components.length} component${components.length !== 1 ? 's' : ''}`}
            icon={<Tree size={20} weight="duotone" />}
          />
          {components.length > 0 && (
            <div className="flex gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleExpandAll}
                    className="h-7 w-7 p-0"
                  >
                    <CaretDown size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Expand All</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCollapseAll}
                    className="h-7 w-7 p-0"
                  >
                    <CaretRight size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Collapse All</TooltipContent>
              </Tooltip>
            </div>
          )}
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
