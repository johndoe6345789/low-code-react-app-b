import { ReactNode } from 'react'

interface TextProps {
  children: ReactNode
  variant?: 'body' | 'caption' | 'muted' | 'small'
  className?: string
}

const variantClasses = {
  body: 'text-sm text-foreground',
  caption: 'text-xs text-muted-foreground',
  muted: 'text-sm text-muted-foreground',
  small: 'text-xs text-foreground',
}

export function Text({ children, variant = 'body', className = '' }: TextProps) {
  return (
    <p className={`${variantClasses[variant]} ${className}`}>
      {children}
    </p>
  )
}
