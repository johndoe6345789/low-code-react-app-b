import { ReactNode } from 'react'

interface GridProps {
  children: ReactNode
  cols?: 1 | 2 | 3 | 4 | 6 | 12
  gap?: 1 | 2 | 3 | 4 | 6 | 8
  className?: string
}

const colsClasses = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  6: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
  12: 'grid-cols-3 md:grid-cols-6 lg:grid-cols-12',
}

const gapClasses = {
  1: 'gap-1',
  2: 'gap-2',
  3: 'gap-3',
  4: 'gap-4',
  6: 'gap-6',
  8: 'gap-8',
}

export function Grid({ children, cols = 1, gap = 4, className = '' }: GridProps) {
  return (
    <div className={`grid ${colsClasses[cols]} ${gapClasses[gap]} ${className}`}>
      {children}
    </div>
  )
}
