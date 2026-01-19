import { ReactNode } from 'react'

export interface InfoBoxProps {
  type?: 'info' | 'warning' | 'success' | 'error'
  title?: string
  children: ReactNode
  className?: string
}
