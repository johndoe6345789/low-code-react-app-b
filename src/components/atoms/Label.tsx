import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface LabelProps {
  children: ReactNode
  htmlFor?: string
  required?: boolean
  className?: string
}

export function Label({ children, htmlFor, required, className }: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        'text-sm font-medium text-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        className
      )}
    >
      {children}
      {required && <span className="text-destructive ml-1">*</span>}
    </label>
  )
}
