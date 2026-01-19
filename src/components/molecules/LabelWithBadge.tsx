import { Badge, Flex, Text } from '@/components/atoms'

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
    <Flex align="center" gap="sm">
      <Text variant="small" className="font-medium">{label}</Text>
      {badge !== undefined && (
        <Badge variant={badgeVariant} className="text-xs">
          {badge}
        </Badge>
      )}
    </Flex>
  )
}
