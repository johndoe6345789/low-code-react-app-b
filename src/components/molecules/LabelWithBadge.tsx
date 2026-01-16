import { Badge } from '@/components/ui/badge'

interface LabelWithBadgeProps {
  label: string
  badge?: number | string
  badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline'
}

export function LabelWithBadge({ 
  label, 
  badge, 
  badgeVariant = 'secondary' 
}: LabelWithBadgeProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">{label}</span>
      {badge !== undefined && (
        <Badge variant={badgeVariant} className="text-xs">
          {badge}
        </Badge>
      )}
    </div>
  )
}
