import { ReactNode } from 'react'
import { Button } from '@/components/ui/button'

interface ActionBarProps {
  title?: string
  actions?: {
    label: string
    icon?: ReactNode
    onClick: () => void
    variant?: 'default' | 'outline' | 'ghost' | 'destructive'
    disabled?: boolean
  }[]
  children?: ReactNode
  className?: string
}

export function ActionBar({ title, actions = [], children, className = '' }: ActionBarProps) {
  return (
    <div className={`flex items-center justify-between gap-4 ${className}`}>
      {title && (
        <h2 className="text-xl font-semibold">{title}</h2>
      )}
      {children}
      {actions.length > 0 && (
        <div className="flex gap-2">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant || 'default'}
              onClick={action.onClick}
              disabled={action.disabled}
              size="sm"
            >
              {action.icon}
              {action.label && action.icon ? <span className="ml-2">{action.label}</span> : action.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}
