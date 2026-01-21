import { ReactNode } from 'react'
import { Info, Warning, CheckCircle, XCircle } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface AlertProps {
  variant?: 'info' | 'warning' | 'success' | 'error'
  title?: string
  children: ReactNode
  className?: string
}

const variantConfig = {
  info: {
    icon: Info,
    classes: 'bg-blue-50 border-blue-200 text-blue-900',
  },
  warning: {
    icon: Warning,
    classes: 'bg-yellow-50 border-yellow-200 text-yellow-900',
  },
  success: {
    icon: CheckCircle,
    classes: 'bg-green-50 border-green-200 text-green-900',
  },
  error: {
    icon: XCircle,
    classes: 'bg-red-50 border-red-200 text-red-900',
  },
}

export function Alert({ variant = 'info', title, children, className }: AlertProps) {
  const config = variantConfig[variant]
  const Icon = config.icon

  return (
    <div
      className={cn(
        'flex gap-3 p-4 rounded-lg border',
        config.classes,
        className
      )}
      role="alert"
    >
      <Icon size={20} weight="bold" className="flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        {title && <div className="font-semibold mb-1">{title}</div>}
        <div className="text-sm">{children}</div>
      </div>
    </div>
  )
}
