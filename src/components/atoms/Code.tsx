import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface CodeProps {
  children: ReactNode
  inline?: boolean
  className?: string
}

export function Code({ children, inline = true, className }: CodeProps) {
  if (inline) {
    return (
      <code
        className={cn(
          'px-1.5 py-0.5 rounded bg-muted text-foreground font-mono text-sm',
          className
        )}
      >
        {children}
      </code>
    )
  }

  return (
    <pre
      className={cn(
        'p-4 rounded-lg bg-muted text-foreground font-mono text-sm overflow-x-auto',
        className
      )}
    >
      <code>{children}</code>
    </pre>
  )
}
