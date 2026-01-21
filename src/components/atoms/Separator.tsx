import { Separator as ShadcnSeparator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

interface SeparatorProps {
  orientation?: 'horizontal' | 'vertical'
  decorative?: boolean
  className?: string
}

export function Separator({
  orientation = 'horizontal',
  decorative = true,
  className,
}: SeparatorProps) {
  return (
    <ShadcnSeparator
      orientation={orientation}
      decorative={decorative}
      className={className}
    />
  )
}
