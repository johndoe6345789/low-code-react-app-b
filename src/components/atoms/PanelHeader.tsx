import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'

interface PanelHeaderProps {
  title: string
  subtitle?: string | ReactNode
  icon?: ReactNode
  actions?: ReactNode
  className?: string
  showSeparator?: boolean
}

export function PanelHeader({
  title,
  subtitle,
  icon,
  actions,
  className,
  showSeparator = true,
}: PanelHeaderProps) {
  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {icon && (
            <div className="text-primary mt-0.5 shrink-0">
              {icon}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-foreground truncate">
              {title}
            </h2>
            {subtitle && (
              typeof subtitle === 'string' ? (
                <p className="text-sm text-muted-foreground mt-1">
                  {subtitle}
                </p>
              ) : (
                <div className="mt-1">
                  {subtitle}
                </div>
              )
            )}
          </div>
        </div>
        {actions && (
          <div className="flex items-center gap-2 shrink-0">
            {actions}
          </div>
        )}
      </div>
      {showSeparator && <Separator />}
    </div>
  )
}
