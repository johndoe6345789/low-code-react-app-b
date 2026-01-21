import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface MetricCardProps {
  label: string
  value: string | number
  icon?: ReactNode
  trend?: {
    value: number
    direction: 'up' | 'down'
  }
  className?: string
}

export function MetricCard({ label, value, icon, trend, className }: MetricCardProps) {
  return (
    <Card className={cn('bg-card/50 backdrop-blur', className)}>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="text-sm text-muted-foreground mb-1">{label}</div>
            <div className="text-3xl font-bold">{value}</div>
            {trend && (
              <div
                className={cn(
                  'text-sm mt-2',
                  trend.direction === 'up' ? 'text-green-500' : 'text-red-500'
                )}
              >
                {trend.direction === 'up' ? '↑' : '↓'} {Math.abs(trend.value)}%
              </div>
            )}
          </div>
          {icon && <div className="text-muted-foreground">{icon}</div>}
        </div>
      </CardContent>
    </Card>
  )
}
