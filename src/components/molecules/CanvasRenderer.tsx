import { UIComponent } from '@/types/json-ui'
import { getUIComponent } from '@/lib/json-ui/component-registry'
import { getComponentDef } from '@/lib/component-definition-utils'
import { cn } from '@/lib/utils'
import { createElement, ReactNode } from 'react'

interface CanvasRendererProps {
  components: UIComponent[]
  selectedId: string | null
  hoveredId: string | null
  draggedOverId: string | null
  dropPosition: 'before' | 'after' | 'inside' | null
  onSelect: (id: string) => void
  onHover: (id: string) => void
  onHoverEnd: () => void
  onDragOver: (id: string, e: React.DragEvent) => void
  onDragLeave: (e: React.DragEvent) => void
  onDrop: (id: string, e: React.DragEvent) => void
}

export function CanvasRenderer({
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
}: CanvasRendererProps) {
  const renderComponent = (comp: UIComponent): ReactNode => {
    const Component = getUIComponent(comp.type)
    const def = getComponentDef(comp.type)
    
    if (!Component) {
      return null
    }

    const isSelected = selectedId === comp.id
    const isHovered = hoveredId === comp.id
    const isDraggedOver = draggedOverId === comp.id

    const wrapperClasses = cn(
      'relative transition-all',
      isSelected && 'ring-2 ring-accent ring-offset-2 ring-offset-background',
      isHovered && !isSelected && 'ring-1 ring-primary/50',
      isDraggedOver && dropPosition === 'inside' && 'ring-2 ring-primary ring-offset-2'
    )

    const props = {
      ...comp.props,
      onClick: (e: React.MouseEvent) => {
        e.stopPropagation()
        onSelect(comp.id)
      },
      onMouseEnter: (e: React.MouseEvent) => {
        e.stopPropagation()
        onHover(comp.id)
      },
      onMouseLeave: (e: React.MouseEvent) => {
        e.stopPropagation()
        onHoverEnd()
      },
      onDragOver: (e: React.DragEvent) => {
        e.stopPropagation()
        onDragOver(comp.id, e)
      },
      onDragLeave: (e: React.DragEvent) => {
        onDragLeave(e)
      },
      onDrop: (e: React.DragEvent) => {
        e.stopPropagation()
        onDrop(comp.id, e)
      },
    }

    let children: ReactNode = null
    if (Array.isArray(comp.children)) {
      children = comp.children.map(renderComponent)
    } else if (typeof comp.children === 'string') {
      children = comp.children
    } else if (comp.props?.children) {
      children = comp.props.children
    }

    return (
      <div key={comp.id} className={wrapperClasses}>
        {isDraggedOver && dropPosition === 'before' && (
          <div className="absolute -top-1 left-0 right-0 h-1 bg-accent rounded" />
        )}
        {createElement(Component, props, children)}
        {isDraggedOver && dropPosition === 'after' && (
          <div className="absolute -bottom-1 left-0 right-0 h-1 bg-accent rounded" />
        )}
      </div>
    )
  }

  return (
    <div className="h-full w-full overflow-auto p-8 bg-gradient-to-br from-background via-muted/10 to-muted/20">
      <div 
        className="min-h-full bg-card border border-border rounded-lg shadow-lg p-8"
        onDragOver={(e) => {
          if (components.length === 0) {
            e.preventDefault()
          }
        }}
        onDrop={(e) => {
          if (components.length === 0) {
            e.preventDefault()
            onDrop('root', e)
          }
        }}
      >
        {components.length === 0 ? (
          <div className="h-96 flex items-center justify-center text-muted-foreground border-2 border-dashed border-border rounded-lg">
            <div className="text-center">
              <p className="text-lg font-medium mb-2">Drop components here</p>
              <p className="text-sm">Drag components from the palette to start building</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {components.map(renderComponent)}
          </div>
        )}
      </div>
    </div>
  )
}
