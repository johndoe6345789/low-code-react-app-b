import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface KbdProps {
  children: ReactNode
  className?: string
}

export function Kbd({ children, className }: KbdProps) {
  return (
    <kbd
      className={cn(
        'inline-flex items-center justify-center px-2 py-1 text-xs font-mono font-semibold',
        'bg-muted text-foreground border border-border rounded shadow-sm',
        className
      )}
    >
      {children}
    </kbd>
  )
}
