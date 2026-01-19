import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface CountBadgeProps {
  count: number
  max?: number
  variant?: 'default' | 'secondary' | 'destructive' | 'outline'
  className?: string
}

export function CountBadge({ count, max, variant = 'default', className }: CountBadgeProps) {
  const displayValue = max && count > max ? `${max}+` : count.toString()

  if (count === 0) return null

  return (
    <Badge variant={variant} className={cn('ml-2 px-2 py-0.5 text-xs', className)}>
      {displayValue}
    </Badge>
  )
}
