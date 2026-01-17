import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'

interface RangeSliderProps {
  value: [number, number]
  onChange: (value: [number, number]) => void
  min?: number
  max?: number
  step?: number
  label?: string
  showValue?: boolean
  className?: string
}

export function RangeSlider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  showValue = true,
  className,
}: RangeSliderProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between">
          {label && <span className="text-sm font-medium">{label}</span>}
          {showValue && (
            <span className="text-sm text-muted-foreground">
              {value[0]} - {value[1]}
            </span>
          )}
        </div>
      )}
      <Slider
        value={value}
        onValueChange={onChange as any}
        min={min}
        max={max}
        step={step}
        minStepsBetweenThumbs={1}
      />
    </div>
  )
}
