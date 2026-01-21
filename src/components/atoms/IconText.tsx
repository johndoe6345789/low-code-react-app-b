import { cn } from '@/lib/utils'

interface IconTextProps {
  icon: React.ReactNode
  children: React.ReactNode
  gap?: 'sm' | 'md' | 'lg'
  align?: 'start' | 'center' | 'end'
  className?: string
}

export function IconText({ 
  icon, 
  children, 
  gap = 'md', 
  align = 'center',
  className 
}: IconTextProps) {
  const gapStyles = {
    sm: 'gap-1',
    md: 'gap-2',
    lg: 'gap-3',
  }

  const alignStyles = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
  }

  return (
    <div className={cn('flex', gapStyles[gap], alignStyles[align], className)}>
      <span className="flex-shrink-0">{icon}</span>
      <span className="flex-1">{children}</span>
    </div>
  )
}
