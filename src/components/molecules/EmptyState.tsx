import { EmptyStateIcon, Stack, Heading, Text } from '@/components/atoms'

interface EmptyStateProps {
  icon: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <Stack 
      direction="vertical" 
      align="center" 
      justify="center" 
      spacing="md" 
      className="py-12 px-4 text-center"
    >
      <EmptyStateIcon icon={icon} />
      <Stack direction="vertical" spacing="sm">
        <Heading level={3} className="text-lg">{title}</Heading>
        {description && (
          <Text variant="muted" className="max-w-md">{description}</Text>
        )}
      </Stack>
      {action && <div className="mt-2">{action}</div>}
    </Stack>
  )
}
