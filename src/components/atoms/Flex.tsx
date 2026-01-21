import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface FlexProps {
  children: ReactNode
  direction?: 'row' | 'col' | 'row-reverse' | 'col-reverse'
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  wrap?: 'wrap' | 'nowrap' | 'wrap-reverse'
  grow?: boolean
  shrink?: boolean
  className?: string
}

const directionClasses = {
  row: 'flex-row',
  col: 'flex-col',
  'row-reverse': 'flex-row-reverse',
  'col-reverse': 'flex-col-reverse',
}

const alignClasses = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
  baseline: 'items-baseline',
}

const justifyClasses = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
}

const gapClasses = {
  none: 'gap-0',
  xs: 'gap-1',
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
}

const wrapClasses = {
  wrap: 'flex-wrap',
  nowrap: 'flex-nowrap',
  'wrap-reverse': 'flex-wrap-reverse',
}

export function Flex({
  children,
  direction = 'row',
  align = 'stretch',
  justify = 'start',
  gap = 'md',
  wrap = 'nowrap',
  grow = false,
  shrink = false,
  className,
}: FlexProps) {
  return (
    <div
      className={cn(
        'flex',
        directionClasses[direction],
        alignClasses[align],
        justifyClasses[justify],
        gapClasses[gap],
        wrapClasses[wrap],
        grow && 'flex-grow',
        shrink && 'flex-shrink',
        className
      )}
    >
      {children}
    </div>
  )
}
