import { cn } from '@/lib/utils'

interface TextHighlightProps {
  children: React.ReactNode
  variant?: 'primary' | 'accent' | 'success' | 'warning' | 'error'
  className?: string
}

export function TextHighlight({ children, variant = 'primary', className }: TextHighlightProps) {
  const variantClasses = {
    primary: 'bg-primary/10 text-primary border-primary/20',
    accent: 'bg-accent/10 text-accent-foreground border-accent/20',
    success: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20',
    warning: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20',
    error: 'bg-destructive/10 text-destructive border-destructive/20',
  }

  return (
    <span className={cn(
      'inline-flex items-center px-2 py-0.5 rounded border font-medium text-sm',
      variantClasses[variant],
      className
    )}>
      {children}
    </span>
  )
}
