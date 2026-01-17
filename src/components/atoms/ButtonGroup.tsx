import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface ButtonGroupProps {
  children: ReactNode
  orientation?: 'horizontal' | 'vertical'
  className?: string
}

export function ButtonGroup({
  children,
  orientation = 'horizontal',
  className,
}: ButtonGroupProps) {
  return (
    <div
      className={cn(
        'inline-flex',
        orientation === 'horizontal' ? 'flex-row' : 'flex-col',
        '[&>button]:rounded-none',
        '[&>button:first-child]:rounded-l-md',
        '[&>button:last-child]:rounded-r-md',
        orientation === 'vertical' && '[&>button:first-child]:rounded-t-md [&>button:first-child]:rounded-l-none',
        orientation === 'vertical' && '[&>button:last-child]:rounded-b-md [&>button:last-child]:rounded-r-none',
        '[&>button:not(:last-child)]:border-r-0',
        orientation === 'vertical' && '[&>button:not(:last-child)]:border-b-0 [&>button:not(:last-child)]:border-r',
        className
      )}
    >
      {children}
    </div>
  )
}
