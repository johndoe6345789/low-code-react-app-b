import { cn } from '@/lib/utils'

interface ListItemProps {
  icon?: React.ReactNode
  children: React.ReactNode
  onClick?: () => void
  active?: boolean
  className?: string
  endContent?: React.ReactNode
}

export function ListItem({ icon, children, onClick, active, className, endContent }: ListItemProps) {
  const isInteractive = !!onClick

  return (
    <div
      className={cn(
        'flex items-center gap-3 px-3 py-2 rounded-md transition-colors',
        isInteractive && 'cursor-pointer hover:bg-accent',
        active && 'bg-accent',
        className
      )}
      onClick={onClick}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
    >
      {icon && <div className="flex-shrink-0 text-muted-foreground">{icon}</div>}
      <div className="flex-1 min-w-0 text-sm">{children}</div>
      {endContent && <div className="flex-shrink-0">{endContent}</div>}
    </div>
  )
}
