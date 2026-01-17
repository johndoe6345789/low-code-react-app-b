import { cn } from '@/lib/utils'

interface BasicPageHeaderProps {
  title: string
  description?: string
  actions?: React.ReactNode
  className?: string
}

export function BasicPageHeader({ title, description, actions, className }: BasicPageHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between mb-6', className)}>
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex gap-2">{actions}</div>
      )}
    </div>
  )
}
