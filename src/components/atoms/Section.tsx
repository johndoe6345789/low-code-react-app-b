import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SectionProps {
  children: ReactNode
  spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const spacingClasses = {
  none: '',
  sm: 'py-4',
  md: 'py-8',
  lg: 'py-12',
  xl: 'py-16',
}

export function Section({ children, spacing = 'md', className }: SectionProps) {
  return (
    <section className={cn(spacingClasses[spacing], className)}>
      {children}
    </section>
  )
}
