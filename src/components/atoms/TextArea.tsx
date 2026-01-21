import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
  helperText?: string
  label?: string
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ error, helperText, label, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium mb-1.5 text-foreground">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={cn(
            'flex min-h-[80px] w-full rounded-md border bg-background px-3 py-2 text-sm',
            'placeholder:text-muted-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'resize-vertical transition-colors',
            error ? 'border-destructive focus-visible:ring-destructive' : 'border-input',
            className
          )}
          {...props}
        />
        {helperText && (
          <p className={cn('text-xs mt-1.5', error ? 'text-destructive' : 'text-muted-foreground')}>
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

TextArea.displayName = 'TextArea'
