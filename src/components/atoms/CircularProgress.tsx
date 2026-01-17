import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

interface CircularProgressProps {
  value: number
  max?: number
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showLabel?: boolean
  strokeWidth?: number
  className?: string
}

const sizeClasses = {
  sm: { dimension: 48, stroke: 4, fontSize: 'text-xs' },
  md: { dimension: 64, stroke: 5, fontSize: 'text-sm' },
  lg: { dimension: 96, stroke: 6, fontSize: 'text-base' },
  xl: { dimension: 128, stroke: 8, fontSize: 'text-lg' },
}

export function CircularProgress({
  value,
  max = 100,
  size = 'md',
  showLabel = true,
  strokeWidth,
  className,
}: CircularProgressProps) {
  const { dimension, stroke, fontSize } = sizeClasses[size]
  const actualStroke = strokeWidth || stroke
  const percentage = Math.min((value / max) * 100, 100)
  const radius = (dimension - actualStroke) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg width={dimension} height={dimension} className="transform -rotate-90">
        <circle
          cx={dimension / 2}
          cy={dimension / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={actualStroke}
          fill="none"
          className="text-muted opacity-20"
        />
        <circle
          cx={dimension / 2}
          cy={dimension / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={actualStroke}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="text-primary transition-all duration-300"
        />
      </svg>
      {showLabel && (
        <span className={cn('absolute font-semibold', fontSize)}>
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  )
}
