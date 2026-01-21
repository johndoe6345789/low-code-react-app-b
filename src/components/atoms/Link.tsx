import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface LinkProps {
  href: string
  children: ReactNode
  variant?: 'default' | 'muted' | 'accent' | 'destructive'
  external?: boolean
  className?: string
  onClick?: (e: React.MouseEvent) => void
}

const variantClasses = {
  default: 'text-foreground hover:text-primary underline-offset-4 hover:underline',
  muted: 'text-muted-foreground hover:text-foreground underline-offset-4 hover:underline',
  accent: 'text-accent hover:text-accent/80 underline-offset-4 hover:underline',
  destructive: 'text-destructive hover:text-destructive/80 underline-offset-4 hover:underline',
}

export function Link({ 
  href, 
  children, 
  variant = 'default', 
  external = false,
  className,
  onClick 
}: LinkProps) {
  const externalProps = external ? { target: '_blank', rel: 'noopener noreferrer' } : {}
  
  return (
    <a
      href={href}
      className={cn('transition-colors duration-150', variantClasses[variant], className)}
      onClick={onClick}
      {...externalProps}
    >
      {children}
    </a>
  )
}
