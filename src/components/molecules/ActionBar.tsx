import { ReactNode } from 'react'
import { Button, Flex, Heading } from '@/components/atoms'

interface ActionBarProps {
  title?: string
  actions?: {
    label: string
    icon?: ReactNode
    onClick: () => void
    variant?: 'default' | 'outline' | 'ghost' | 'destructive'
    disabled?: boolean
  }[]
  children?: ReactNode
  className?: string
}

export function ActionBar({ title, actions = [], children, className = '' }: ActionBarProps) {
  return (
    <Flex justify="between" align="center" gap="md" className={className}>
      {title && (
        <Heading level={2} className="text-xl font-semibold">
          {title}
        </Heading>
      )}
      {children}
      {actions.length > 0 && (
        <Flex gap="sm">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant || 'default'}
              onClick={action.onClick}
              disabled={action.disabled}
              size="sm"
              leftIcon={action.icon}
            >
              {action.label}
            </Button>
          ))}
        </Flex>
      )}
    </Flex>
  )
}
