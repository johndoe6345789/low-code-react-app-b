import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface DataCardProps {
  title?: string
  value: string | number
  description?: string
  icon?: React.ReactNode
  trend?: {
    value: number
    label: string
    positive?: boolean
  }
  isLoading?: boolean
  className?: string
}

export function DataCard({ 
  title, 
  value, 
  description, 
  icon, 
  trend,
  isLoading = false,
  className = '' 
}: DataCardProps) {
  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="pt-6">
          <Skeleton className="h-4 w-20 mb-2" />
          <Skeleton className="h-8 w-16 mb-1" />
          <Skeleton className="h-3 w-24" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {title && (
              <div className="text-sm font-medium text-muted-foreground mb-1">
                {title}
              </div>
            )}
            <div className="text-3xl font-bold">
              {value}
            </div>
            {description && (
              <div className="text-xs text-muted-foreground mt-1">
                {description}
              </div>
            )}
            {trend && (
              <div className={`text-xs mt-2 ${trend.positive ? 'text-green-500' : 'text-red-500'}`}>
                {trend.positive ? '↑' : '↓'} {trend.value} {trend.label}
              </div>
            )}
          </div>
          {icon && (
            <div className="text-muted-foreground">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
