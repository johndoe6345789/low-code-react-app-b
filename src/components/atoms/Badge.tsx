import { Badge as ShadcnBadge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  variant?: 'default' | 'secondary' | 'destructive' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  icon?: ReactNode
  className?: string
}

const sizeClasses = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-0.5',
  lg: 'text-base px-3 py-1',
}

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  icon,
  className,
}: BadgeProps) {
  return (
    <ShadcnBadge
      variant={variant}
      className={cn(
        'inline-flex items-center gap-1.5',
        sizeClasses[size],
        className
      )}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </ShadcnBadge>
  )
}
