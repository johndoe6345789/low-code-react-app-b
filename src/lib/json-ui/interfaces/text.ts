import { ReactNode } from 'react'

export interface TextProps {
  children: ReactNode
  variant?: 'body' | 'caption' | 'muted' | 'small'
  className?: string
}
