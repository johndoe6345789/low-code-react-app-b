import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface DataListProps {
  items: any[]
  renderItem: (item: any, index: number) => ReactNode
  emptyMessage?: string
  className?: string
  itemClassName?: string
}

export function DataList({
  items,
  renderItem,
  emptyMessage = 'No items',
  className,
  itemClassName,
}: DataListProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {emptyMessage}
      </div>
    )
  }

  return (
    <div className={cn('space-y-2', className)}>
      {items.map((item, index) => (
        <div key={index} className={cn('transition-colors', itemClassName)}>
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  )
}
