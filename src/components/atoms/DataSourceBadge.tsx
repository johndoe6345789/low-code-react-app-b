import { Badge } from '@/components/ui/badge'
import { Database, Function, FileText } from '@phosphor-icons/react'
import { DataSourceType } from '@/types/json-ui'

interface DataSourceBadgeProps {
  type: DataSourceType
  className?: string
}

const icons = {
  kv: Database,
  computed: Function,
  static: FileText,
}

const labels = {
  kv: 'KV Store',
  computed: 'Computed',
  static: 'Static',
}

const variants = {
  kv: 'bg-accent/20 text-accent border-accent/40',
  computed: 'bg-primary/20 text-primary border-primary/40',
  static: 'bg-muted text-muted-foreground border-border',
}

export function DataSourceBadge({ type, className = '' }: DataSourceBadgeProps) {
  const Icon = icons[type]
  
  return (
    <Badge variant="outline" className={`${variants[type]} ${className}`}>
      <Icon className="w-3 h-3 mr-1" />
      {labels[type]}
    </Badge>
  )
}
