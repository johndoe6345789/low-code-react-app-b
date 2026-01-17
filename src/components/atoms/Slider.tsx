import { cn } from '@/lib/utils'

interface SliderProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  label?: string
  showValue?: boolean
  disabled?: boolean
  className?: string
}

export function Slider({ 
  value, 
  onChange, 
  min = 0, 
  max = 100, 
  step = 1, 
  label, 
  showValue = false,
  disabled = false,
  className 
}: SliderProps) {
  const percentage = ((value - min) / (max - min)) * 100

  return (
    <div className={cn('w-full', className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-2">
          {label && <span className="text-sm font-medium">{label}</span>}
          {showValue && <span className="text-sm text-muted-foreground">{value}</span>}
        </div>
      )}
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          disabled={disabled}
          className={cn(
            'w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer',
            'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
            disabled && 'opacity-50 cursor-not-allowed',
            '[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5',
            '[&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:rounded-full',
            '[&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-transform',
            '[&::-webkit-slider-thumb]:hover:scale-110',
            '[&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:bg-primary',
            '[&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:rounded-full',
            '[&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:transition-transform',
            '[&::-moz-range-thumb]:hover:scale-110'
          )}
          style={{
            background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${percentage}%, hsl(var(--secondary)) ${percentage}%, hsl(var(--secondary)) 100%)`
          }}
        />
      </div>
    </div>
  )
}
