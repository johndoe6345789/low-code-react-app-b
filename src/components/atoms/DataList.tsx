import { cn } from '@/lib/utils'

interface DataListProps<T> {
  items: T[]
  renderItem: (item: T, index: number) => React.ReactNode
  emptyMessage?: string
  className?: string
  itemClassName?: string
}

export function DataList<T>({ 
  items, 
  renderItem, 
  emptyMessage = 'No items to display', 
  className,
  itemClassName 
}: DataListProps<T>) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        {emptyMessage}
      </div>
    )
  }

  return (
    <div className={cn('space-y-2', className)}>
      {items.map((item, index) => (
        <div key={index} className={itemClassName}>
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  )
}
