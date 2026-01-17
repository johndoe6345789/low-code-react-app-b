import { cn } from '@/lib/utils'
import { Check } from '@phosphor-icons/react'

interface StepIndicatorProps {
  steps: Array<{
    id: string
    label: string
  }>
  currentStep: string
  completedSteps?: string[]
  onStepClick?: (stepId: string) => void
  className?: string
}

export function StepIndicator({ 
  steps, 
  currentStep, 
  completedSteps = [], 
  onStepClick,
  className 
}: StepIndicatorProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {steps.map((step, index) => {
        const isCompleted = completedSteps.includes(step.id)
        const isCurrent = step.id === currentStep
        const isClickable = !!onStepClick

        return (
          <div key={step.id} className="flex items-center gap-2">
            <div
              className={cn(
                'flex items-center gap-2',
                isClickable && 'cursor-pointer'
              )}
              onClick={() => isClickable && onStepClick(step.id)}
            >
              <div
                className={cn(
                  'flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors',
                  isCompleted && 'bg-accent text-accent-foreground',
                  isCurrent && !isCompleted && 'bg-primary text-primary-foreground',
                  !isCurrent && !isCompleted && 'bg-muted text-muted-foreground'
                )}
              >
                {isCompleted ? <Check size={16} weight="bold" /> : index + 1}
              </div>
              <span className={cn(
                'text-sm font-medium',
                isCurrent && 'text-foreground',
                !isCurrent && 'text-muted-foreground'
              )}>
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={cn(
                'w-8 h-0.5',
                completedSteps.includes(steps[index + 1].id) ? 'bg-accent' : 'bg-border'
              )} />
            )}
          </div>
        )
      })}
    </div>
  )
}
