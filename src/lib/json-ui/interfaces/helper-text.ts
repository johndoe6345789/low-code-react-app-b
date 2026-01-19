import { ReactNode } from 'react'

export interface HelperTextProps {
  children: ReactNode
  variant?: 'default' | 'error' | 'success'
  className?: string
}
