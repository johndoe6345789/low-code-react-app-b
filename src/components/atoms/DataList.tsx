import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface DataListProps {
  items: any[]
  renderItem?: (item: any, index: number) => ReactNode
  emptyMessage?: string
  className?: string
  itemClassName?: string
  itemKey?: string
}

export function DataList({
  items,
  renderItem,
  emptyMessage = 'No items',
  className,
  itemClassName,
  itemKey,
}: DataListProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {emptyMessage}
      </div>
    )
  }

  const renderFallbackItem = (item: any) => {
    if (itemKey && item && typeof item === 'object') {
      const value = item[itemKey]
      if (value !== undefined && value !== null) {
        return typeof value === 'string' || typeof value === 'number'
          ? value
          : JSON.stringify(value)
      }
    }

    if (typeof item === 'string' || typeof item === 'number') {
      return item
    }

    return JSON.stringify(item)
  }

  return (
    <div className={cn('space-y-2', className)}>
      {items.map((item, index) => (
        <div key={index} className={cn('transition-colors', itemClassName)}>
          {renderItem ? renderItem(item, index) : renderFallbackItem(item)}
        </div>
      ))}
    </div>
  )
}
