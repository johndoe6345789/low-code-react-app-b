import { ReactNode } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export interface StatCardProps {
  icon?: ReactNode
  title: string
  value: string | number
  description?: string
  color?: string
  trend?: {
    value: number
    direction: 'up' | 'down'
  }
  className?: string
}

export function StatCard({
  icon,
  title,
  value,
  description,
  color = 'text-primary',
  trend,
  className,
}: StatCardProps) {
  return (
    <Card className={cn('transition-all hover:shadow-lg', className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold mt-2">{value}</p>
            {description && (
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            )}
            {trend && (
              <div className={cn(
                'text-sm font-medium mt-2',
                trend.direction === 'up' ? 'text-green-600' : 'text-red-600'
              )}>
                {trend.direction === 'up' ? '↑' : '↓'} {Math.abs(trend.value)}%
              </div>
            )}
          </div>
          {icon && (
            <div className={cn('text-2xl', color)}>
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
