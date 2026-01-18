import { cn } from '@/lib/utils'
import { TrendUp, TrendDown } from '@phosphor-icons/react'

interface MetricDisplayProps {
  label: string
  value: string | number
  trend?: {
    value: number
    direction: 'up' | 'down'
  }
  icon?: React.ReactNode
  className?: string
  variant?: 'default' | 'primary' | 'accent'
}

export function MetricDisplay({ 
  label, 
  value, 
  trend, 
  icon, 
  className,
  variant = 'default' 
}: MetricDisplayProps) {
  const variantClasses = {
    default: 'text-foreground',
    primary: 'text-primary',
    accent: 'text-accent',
  }

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {icon && <span className="text-muted-foreground">{icon}</span>}
        {label}
      </div>
      <div className="flex items-baseline gap-2">
        <span className={cn('text-2xl font-bold', variantClasses[variant])}>
          {value}
        </span>
        {trend && (
          <span className={cn(
            'flex items-center gap-0.5 text-xs font-medium',
            trend.direction === 'up' ? 'text-green-600 dark:text-green-400' : 'text-destructive'
          )}>
            {trend.direction === 'up' ? <TrendUp size={14} /> : <TrendDown size={14} />}
            {Math.abs(trend.value)}%
          </span>
        )}
      </div>
    </div>
  )
}
