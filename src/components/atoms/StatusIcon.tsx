import { CheckCircle, CloudCheck } from '@phosphor-icons/react'

interface StatusIconProps {
  type: 'saved' | 'synced'
  size?: number
  animate?: boolean
}

export function StatusIcon({ type, size = 14, animate = false }: StatusIconProps) {
  const baseClassName = type === 'saved' ? 'text-accent' : ''
  const animateClassName = animate ? 'animate-in zoom-in duration-200' : ''
  const className = [baseClassName, animateClassName].filter(Boolean).join(' ')

  if (type === 'saved') {
    return (
      <CheckCircle
        size={size}
        weight="fill"
        className={className}
      />
    )
  }

  return <CloudCheck size={size} weight="duotone" />
}
