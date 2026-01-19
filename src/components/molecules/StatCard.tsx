import { Card, IconWrapper, Stack, Text } from '@/components/atoms'

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
      <Stack direction="horizontal" align="center" spacing="md">
        <IconWrapper 
          icon={icon} 
          size="lg" 
          variant={variant === 'default' ? 'muted' : variant}
        />
        <Stack direction="vertical" spacing="xs" className="flex-1">
          <Text variant="caption">{label}</Text>
          <Text className="text-2xl font-bold">{value}</Text>
        </Stack>
      </Stack>
    </Card>
  )
}
