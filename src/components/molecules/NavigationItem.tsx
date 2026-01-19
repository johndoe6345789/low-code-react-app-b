import { Badge, Flex, Text, IconWrapper } from '@/components/atoms'

interface NavigationItemProps {
  icon: React.ReactNode
  label: string
  isActive: boolean
  badge?: number
  onClick: () => void
}

export function NavigationItem({
  icon,
  label,
  isActive,
  badge,
  onClick,
}: NavigationItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
        isActive
          ? 'bg-primary text-primary-foreground'
          : 'hover:bg-muted text-foreground'
      }`}
    >
      <IconWrapper
        icon={icon}
        size="md"
        variant={isActive ? 'default' : 'muted'}
      />
      <Text className="flex-1 text-left font-medium" variant="small">
        {label}
      </Text>
      {badge !== undefined && badge > 0 && (
        <Badge
          variant={isActive ? 'secondary' : 'destructive'}
          className="ml-auto"
        >
          {badge}
        </Badge>
      )}
    </button>
  )
}
