import { Card } from '@/components/ui/card'
import { IconWrapper } from '@/components/atoms'

interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: string | number
  variant?: 'default' | 'primary' | 'destructive'
}

export function StatCard({ icon, label, value, variant = 'default' }: StatCardProps) {
  const variantClasses = {
    default: 'border-border',
    primary: 'border-primary/50 bg-primary/5',
    destructive: 'border-destructive/50 bg-destructive/5',
  }

  return (
    <Card className={`p-4 ${variantClasses[variant]}`}>
      <div className="flex items-center gap-3">
        <IconWrapper 
          icon={icon} 
          size="lg" 
          variant={variant === 'default' ? 'muted' : variant}
        />
        <div className="flex-1">
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </Card>
  )
}
