import { cn } from '@/lib/utils'
import { Info, Warning, CheckCircle, XCircle } from '@phosphor-icons/react'

interface InfoBoxProps {
  type?: 'info' | 'warning' | 'success' | 'error'
  title?: string
  children: React.ReactNode
  className?: string
}

const iconMap = {
  info: Info,
  warning: Warning,
  success: CheckCircle,
  error: XCircle,
}

const variantClasses = {
  info: 'bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-300',
  warning: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-700 dark:text-yellow-300',
  success: 'bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-300',
  error: 'bg-destructive/10 border-destructive/20 text-destructive',
}

export function InfoBox({ type = 'info', title, children, className }: InfoBoxProps) {
  const Icon = iconMap[type]

  return (
    <div className={cn(
      'flex gap-3 p-4 rounded-lg border',
      variantClasses[type],
      className
    )}>
      <Icon size={20} weight="fill" className="flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        {title && <div className="font-semibold mb-1">{title}</div>}
        <div className="text-sm opacity-90">{children}</div>
      </div>
    </div>
  )
}
