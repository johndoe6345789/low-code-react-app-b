import { UIComponent } from '@/types/json-ui'
import { getComponentDef } from '@/lib/component-definitions-utils'
import { cn } from '@/lib/utils'
import * as Icons from '@phosphor-icons/react'

interface ComponentTreeNodeProps {
  component: UIComponent
  isSelected: boolean
  isHovered: boolean
  isDraggedOver: boolean
  dropPosition: 'before' | 'after' | 'inside' | null
  onSelect: () => void
  onHover: () => void
  onHoverEnd: () => void
  onDragStart: (e: React.DragEvent) => void
  onDragOver: (e: React.DragEvent) => void
  onDragLeave: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent) => void
  depth?: number
  hasChildren?: boolean
  isExpanded?: boolean
  onToggleExpand?: () => void
}

export function ComponentTreeNode({
  component,
  isSelected,
  isHovered,
  isDraggedOver,
  dropPosition,
  onSelect,
  onHover,
  onHoverEnd,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  depth = 0,
  hasChildren = false,
  isExpanded = false,
  onToggleExpand,
}: ComponentTreeNodeProps) {
  const def = getComponentDef(component.type)
  const IconComponent = def ? (Icons as any)[def.icon] || Icons.Cube : Icons.Cube
  
  return (
    <div className="relative">
      {isDraggedOver && dropPosition === 'before' && (
        <div className="absolute -top-0.5 left-0 right-0 h-0.5 bg-accent" />
      )}
      
      <div
        draggable
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={(e) => {
          e.stopPropagation()
          onSelect()
        }}
        onMouseEnter={onHover}
        onMouseLeave={onHoverEnd}
        style={{ paddingLeft: `${depth * 16}px` }}
        className={cn(
          'flex items-center gap-2 px-3 py-2 text-sm cursor-pointer',
          'hover:bg-muted/50 transition-colors',
          'border-l-2 border-transparent',
          isSelected && 'bg-accent/20 border-l-accent',
          isHovered && !isSelected && 'bg-muted/30',
          isDraggedOver && dropPosition === 'inside' && 'bg-primary/10'
        )}
      >
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onToggleExpand?.()
            }}
            className="hover:text-accent"
          >
            {isExpanded ? (
              <Icons.CaretDown className="w-3 h-3 text-muted-foreground" />
            ) : (
              <Icons.CaretRight className="w-3 h-3 text-muted-foreground" />
            )}
          </button>
        ) : (
          <div className="w-3" />
        )}
        <IconComponent className="w-4 h-4 text-primary" weight="duotone" />
        <span className="flex-1 text-foreground truncate">{def?.label || component.type}</span>
        <span className="text-xs text-muted-foreground font-mono">{component.id}</span>
      </div>
      
      {isDraggedOver && dropPosition === 'after' && (
        <div className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-accent" />
      )}
    </div>
  )
}
