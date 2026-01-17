import { Card, Stack, Text, Heading, Skeleton, Flex, IconWrapper } from '@/components/atoms'

interface DataCardProps {
  title?: string
  value: string | number
  description?: string
  icon?: React.ReactNode
  trend?: {
    value: number
    label: string
    positive?: boolean
  }
  isLoading?: boolean
  className?: string
}

export function DataCard({ 
  title, 
  value, 
  description, 
  icon, 
  trend,
  isLoading = false,
  className = '' 
}: DataCardProps) {
  if (isLoading) {
    return (
      <Card className={className}>
        <div className="pt-6 px-6 pb-6">
          <Stack spacing="sm">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-24" />
          </Stack>
        </div>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <div className="pt-6 px-6 pb-6">
        <Flex justify="between" align="start" gap="md">
          <Stack spacing="xs" className="flex-1">
            {title && (
              <Text variant="muted" className="font-medium">
                {title}
              </Text>
            )}
            <Heading level={1} className="text-3xl font-bold">
              {value}
            </Heading>
            {description && (
              <Text variant="caption">
                {description}
              </Text>
            )}
            {trend && (
              <Text 
                variant="small" 
                className={trend.positive ? 'text-green-500' : 'text-red-500'}
              >
                {trend.positive ? '↑' : '↓'} {trend.value} {trend.label}
              </Text>
            )}
          </Stack>
          {icon && (
            <IconWrapper icon={icon} size="lg" variant="muted" />
          )}
        </Flex>
      </div>
    </Card>
  )
}
