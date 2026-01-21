import { Info, CheckCircle, Warning, XCircle } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface NotificationProps {
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message?: string
  onClose?: () => void
  className?: string
}

export function Notification({ type, title, message, onClose, className }: NotificationProps) {
  const config = {
    info: {
      icon: Info,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
    },
    success: {
      icon: CheckCircle,
      color: 'text-accent',
      bg: 'bg-accent/10',
      border: 'border-accent/20',
    },
    warning: {
      icon: Warning,
      color: 'text-yellow-500',
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/20',
    },
    error: {
      icon: XCircle,
      color: 'text-destructive',
      bg: 'bg-destructive/10',
      border: 'border-destructive/20',
    },
  }

  const { icon: Icon, color, bg, border } = config[type]

  return (
    <div
      className={cn(
        'flex gap-3 p-4 rounded-lg border',
        bg,
        border,
        className
      )}
    >
      <Icon className={cn('w-5 h-5 flex-shrink-0', color)} weight="fill" />
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm">{title}</h4>
        {message && <p className="text-sm text-muted-foreground mt-1">{message}</p>}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Close notification"
        >
          <XCircle className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
