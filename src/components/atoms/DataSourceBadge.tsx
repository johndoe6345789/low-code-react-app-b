import { Badge } from '@/components/ui/badge'
import { DataSourceType } from '@/types/json-ui'
import { Database, Function, File } from '@phosphor-icons/react'

interface DataSourceBadgeProps {
  type: DataSourceType
  className?: string
}

const dataSourceConfig = {
  kv: {
    icon: Database,
    label: 'KV Storage',
    className: 'bg-accent/20 text-accent border-accent/30'
  },
  computed: {
    icon: Function,
    label: 'Computed',
    className: 'bg-primary/20 text-primary border-primary/30'
  },
  static: {
    icon: File,
    label: 'Static',
    className: 'bg-muted text-muted-foreground border-border'
  }
}

export function DataSourceBadge({ type, className = '' }: DataSourceBadgeProps) {
  const config = dataSourceConfig[type]
  const Icon = config.icon
  
  return (
    <Badge className={`flex items-center gap-1 ${config.className} ${className}`} variant="outline">
      <Icon className="w-3 h-3" weight="bold" />
      <span>{config.label}</span>
    </Badge>
  )
}
