import { CheckCircle, CloudCheck } from '@phosphor-icons/react'

interface StatusIconProps {
  type: 'saved' | 'synced'
  size?: number
  animate?: boolean
}

export function StatusIcon({ type, size = 14, animate = false }: StatusIconProps) {
  if (type === 'saved') {
    return (
      <CheckCircle
        size={size}
        weight="fill"
        className={`text-accent ${animate ? 'animate-in zoom-in duration-200' : ''}`}
      />
    )
  }

  return <CloudCheck size={size} weight="duotone" />
}
