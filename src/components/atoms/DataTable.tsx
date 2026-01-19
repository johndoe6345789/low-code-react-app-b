import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

export interface Column<T> {
  key: string
  header: string | ReactNode
  cell?: (item: T) => ReactNode
  sortable?: boolean
  width?: string
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  onRowClick?: (item: T) => void
  emptyMessage?: string
  className?: string
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  onRowClick,
  emptyMessage = 'No data available',
  className,
}: DataTableProps<T>) {
  return (
    <div className={cn('rounded-md border', className)}>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead
                key={column.key}
                style={{ width: column.width }}
                className={cn(column.sortable && 'cursor-pointer select-none')}
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center py-8 text-muted-foreground">
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            data.map((item, rowIndex) => (
              <TableRow
                key={rowIndex}
                onClick={() => onRowClick?.(item)}
                className={cn(onRowClick && 'cursor-pointer')}
              >
                {columns.map((column) => (
                  <TableCell key={column.key}>
                    {column.cell ? column.cell(item) : item[column.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
