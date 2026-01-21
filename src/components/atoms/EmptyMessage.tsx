import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface EmptyMessageProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function EmptyMessage({ icon, title, description, action, className }: EmptyMessageProps) {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center text-center p-8 rounded-lg border border-dashed bg-muted/20',
      className
    )}>
      {icon && (
        <div className="mb-4 text-muted-foreground/50">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground mb-4 max-w-sm">
          {description}
        </p>
      )}
      {action && (
        <Button onClick={action.onClick} size="sm">
          {action.label}
        </Button>
      )}
    </div>
  )
}
