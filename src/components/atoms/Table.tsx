import { cn } from '@/lib/utils'

interface TableColumn<T> {
  key: keyof T | string
  header: string
  render?: (item: T) => React.ReactNode
  width?: string
}

interface TableProps<T> {
  data: T[]
  columns: TableColumn<T>[]
  onRowClick?: (item: T) => void
  striped?: boolean
  hoverable?: boolean
  compact?: boolean
  className?: string
}

export function Table<T extends Record<string, any>>({
  data,
  columns,
  onRowClick,
  striped = false,
  hoverable = true,
  compact = false,
  className,
}: TableProps<T>) {
  return (
    <div className={cn('w-full overflow-auto', className)}>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            {columns.map((column, index) => (
              <th
                key={index}
                className={cn(
                  'text-left font-medium text-sm text-muted-foreground',
                  compact ? 'px-3 py-2' : 'px-4 py-3',
                  column.width && `w-[${column.width}]`
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, rowIndex) => (
            <tr
              key={rowIndex}
              onClick={() => onRowClick?.(item)}
              className={cn(
                'border-b border-border transition-colors',
                striped && rowIndex % 2 === 1 && 'bg-muted/30',
                hoverable && 'hover:bg-muted/50',
                onRowClick && 'cursor-pointer'
              )}
            >
              {columns.map((column, colIndex) => (
                <td
                  key={colIndex}
                  className={cn(
                    'text-sm',
                    compact ? 'px-3 py-2' : 'px-4 py-3'
                  )}
                >
                  {column.render
                    ? column.render(item)
                    : item[column.key as keyof T]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No data available
        </div>
      )}
    </div>
  )
}
