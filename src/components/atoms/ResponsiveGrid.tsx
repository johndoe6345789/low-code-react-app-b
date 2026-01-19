import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface GridProps {
  children: ReactNode
  columns?: 1 | 2 | 3 | 4 | 5 | 6
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  responsive?: boolean
  className?: string
}

const columnClasses = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
  6: 'grid-cols-6',
}

const gapClasses = {
  none: 'gap-0',
  xs: 'gap-1',
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
}

const responsiveClasses = {
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  5: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
  6: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
}

export function ResponsiveGrid({
  children,
  columns = 3,
  gap = 'md',
  responsive = true,
  className,
}: GridProps) {
  return (
    <div
      className={cn(
        'grid',
        responsive && columns > 1 ? responsiveClasses[columns] : columnClasses[columns],
        gapClasses[gap],
        className
      )}
    >
      {children}
    </div>
  )
}
