import { cn } from '@/lib/utils'
import type { UIComponent } from '@/types/json-ui'
import type { ComponentTreeWrapperProps } from './interfaces'

const renderTreeNodes = (
  components: UIComponent[],
  depth: number,
  selectedId: string | null,
  onSelect?: (id: string) => void
) => {
  return components.map((component) => {
    const hasChildren = Array.isArray(component.children) && component.children.length > 0
    const isSelected = selectedId === component.id

    return (
      <div key={component.id}>
        <button
          type="button"
          onClick={() => onSelect?.(component.id)}
          className={cn(
            'flex w-full items-center gap-2 rounded-md px-2 py-1 text-left text-sm transition-colors',
            isSelected ? 'bg-accent/40 text-foreground' : 'hover:bg-muted'
          )}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
        >
          <span className="font-medium">{component.type}</span>
          <span className="text-xs text-muted-foreground">{component.id}</span>
        </button>
        {hasChildren && (
          <div className="mt-1">
            {renderTreeNodes(component.children as UIComponent[], depth + 1, selectedId, onSelect)}
          </div>
        )}
      </div>
    )
  })
}

export function ComponentTreeWrapper({
  components = [],
  selectedId = null,
  emptyMessage = 'No components available.',
  onSelect,
  className,
}: ComponentTreeWrapperProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {components.length === 0 ? (
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      ) : (
        <div className="space-y-1">{renderTreeNodes(components, 0, selectedId, onSelect)}</div>
      )}
    </div>
  )
}
