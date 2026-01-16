import { Badge } from '@/components/ui/badge'

interface ErrorBadgeProps {
  count: number
  variant?: 'default' | 'destructive'
  size?: 'sm' | 'md'
}

export function ErrorBadge({ count, variant = 'destructive', size = 'md' }: ErrorBadgeProps) {
  if (count === 0) return null

  const sizeClasses = {
    sm: 'h-5 w-5 text-[10px]',
    md: 'h-6 w-6 text-xs',
  }

  return (
    <Badge
      variant={variant}
      className={`${sizeClasses[size]} p-0 flex items-center justify-center absolute -top-1 -right-1`}
    >
      {count}
    </Badge>
  )
}
