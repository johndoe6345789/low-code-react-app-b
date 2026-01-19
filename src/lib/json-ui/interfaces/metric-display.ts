import { ReactNode } from 'react'

export interface MetricDisplayProps {
  label: string
  value: string | number
  trend?: {
    value: number
    direction: 'up' | 'down'
  }
  icon?: ReactNode
  className?: string
  variant?: 'default' | 'primary' | 'accent'
}
