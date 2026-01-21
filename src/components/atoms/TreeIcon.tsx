import { Tree } from '@phosphor-icons/react'

interface TreeIconProps {
  size?: number
  weight?: 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone'
  className?: string
}

export function TreeIcon({ size = 20, weight = 'duotone', className = '' }: TreeIconProps) {
  return <Tree size={size} weight={weight} className={className} />
}
