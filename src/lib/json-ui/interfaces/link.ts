import { ReactNode } from 'react'

export interface LinkProps {
  href: string
  children: ReactNode
  variant?: 'default' | 'muted' | 'accent' | 'destructive'
  external?: boolean
  className?: string
  onClick?: (e: React.MouseEvent) => void
}
