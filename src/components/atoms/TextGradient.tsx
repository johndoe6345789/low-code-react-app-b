import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface TextGradientProps {
  children: ReactNode
  from?: string
  to?: string
  via?: string
  direction?: 'to-r' | 'to-l' | 'to-b' | 'to-t' | 'to-br' | 'to-bl' | 'to-tr' | 'to-tl'
  className?: string
  animate?: boolean
}

export function TextGradient({
  children,
  from = 'from-primary',
  to = 'to-accent',
  via,
  direction = 'to-r',
  className,
  animate = false,
}: TextGradientProps) {
  const gradientClasses = cn(
    'bg-gradient-to-r',
    from,
    via,
    to,
    direction !== 'to-r' && `bg-gradient-${direction}`,
    'bg-clip-text text-transparent',
    animate && 'animate-gradient-x'
  )

  return (
    <span className={cn(gradientClasses, className)}>
      {children}
    </span>
  )
}
