import { cn } from '@/lib/utils'

interface KeyValueProps {
  label: string
  value: React.ReactNode
  orientation?: 'horizontal' | 'vertical'
  className?: string
  labelClassName?: string
  valueClassName?: string
}

export function KeyValue({ 
  label, 
  value, 
  orientation = 'horizontal', 
  className,
  labelClassName,
  valueClassName 
}: KeyValueProps) {
  return (
    <div className={cn(
      'flex gap-2',
      orientation === 'vertical' ? 'flex-col' : 'flex-row items-center justify-between',
      className
    )}>
      <span className={cn('text-sm text-muted-foreground', labelClassName)}>
        {label}
      </span>
      <span className={cn('text-sm font-medium', valueClassName)}>
        {value}
      </span>
    </div>
  )
}
