import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface InfoPanelProps {
  children: ReactNode
  variant?: 'info' | 'warning' | 'success' | 'error' | 'default'
  title?: string
  icon?: ReactNode
  className?: string
}

const variantClasses = {
  default: 'bg-card border-border',
  info: 'bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-300',
  warning: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-700 dark:text-yellow-300',
  success: 'bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-300',
  error: 'bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-300',
}

export function InfoPanel({
  children,
  variant = 'default',
  title,
  icon,
  className,
}: InfoPanelProps) {
  return (
    <div
      className={cn(
        'rounded-lg border p-4',
        variantClasses[variant],
        className
      )}
    >
      {(title || icon) && (
        <div className="flex items-center gap-2 mb-2">
          {icon && <div className="flex-shrink-0">{icon}</div>}
          {title && <div className="font-semibold">{title}</div>}
        </div>
      )}
      <div className="text-sm">{children}</div>
    </div>
  )
}
