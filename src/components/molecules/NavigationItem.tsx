import { Badge } from '@/components/ui/badge'

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
      <span className={isActive ? 'text-primary-foreground' : 'text-muted-foreground'}>
        {icon}
      </span>
      <span className="flex-1 text-left text-sm font-medium">
        {label}
      </span>
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
