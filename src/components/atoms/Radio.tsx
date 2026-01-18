import { cn } from '@/lib/utils'

interface RadioOption {
  value: string
  label: string
  disabled?: boolean
}

interface RadioGroupProps {
  options: RadioOption[]
  value: string
  onChange: (value: string) => void
  name: string
  orientation?: 'horizontal' | 'vertical'
  className?: string
}

export function RadioGroup({ 
  options, 
  value, 
  onChange, 
  name, 
  orientation = 'vertical',
  className 
}: RadioGroupProps) {
  return (
    <div
      role="radiogroup"
      className={cn(
        'flex gap-3',
        orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap',
        className
      )}
    >
      {options.map((option) => (
        <label
          key={option.value}
          className={cn(
            'flex items-center gap-2 cursor-pointer',
            option.disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={(e) => !option.disabled && onChange(e.target.value)}
            disabled={option.disabled}
            className="sr-only"
          />
          <span
            className={cn(
              'w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors',
              value === option.value
                ? 'border-primary bg-primary'
                : 'border-input bg-background'
            )}
          >
            {value === option.value && (
              <span className="w-2 h-2 rounded-full bg-primary-foreground" />
            )}
          </span>
          <span className="text-sm font-medium">{option.label}</span>
        </label>
      ))}
    </div>
  )
}
