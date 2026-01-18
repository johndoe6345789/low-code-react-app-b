import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface HelperTextProps {
  children: ReactNode
  variant?: 'default' | 'error' | 'success'
  className?: string
}

const variantClasses = {
  default: 'text-muted-foreground',
  error: 'text-destructive',
  success: 'text-green-600',
}

export function HelperText({ children, variant = 'default', className }: HelperTextProps) {
  return (
    <p className={cn('text-xs mt-1', variantClasses[variant], className)}>
      {children}
    </p>
  )
}
