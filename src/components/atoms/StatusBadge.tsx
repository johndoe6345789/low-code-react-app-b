import { Badge } from '@/components/ui/badge'

interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'pending' | 'error' | 'success' | 'warning'
  label?: string
}

const statusConfig = {
  active: { variant: 'default' as const, label: 'Active' },
  inactive: { variant: 'secondary' as const, label: 'Inactive' },
  pending: { variant: 'outline' as const, label: 'Pending' },
  error: { variant: 'destructive' as const, label: 'Error' },
  success: { variant: 'default' as const, label: 'Success' },
  warning: { variant: 'outline' as const, label: 'Warning' },
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const config = statusConfig[status]
  
  return (
    <Badge variant={config.variant}>
      {label || config.label}
    </Badge>
  )
}
