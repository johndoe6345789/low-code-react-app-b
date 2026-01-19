import { ReactNode } from 'react'

interface ListProps<T> {
  items: T[]
  renderItem: (item: T, index: number) => ReactNode
  emptyMessage?: string
  className?: string
  itemClassName?: string
}

export function List<T>({ 
  items, 
  renderItem, 
  emptyMessage = 'No items to display',
  className = '',
  itemClassName = ''
}: ListProps<T>) {
  if (items.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        {emptyMessage}
      </div>
    )
  }

  return (
    <div className={className}>
      {items.map((item, index) => (
        <div key={index} className={itemClassName}>
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  )
}
