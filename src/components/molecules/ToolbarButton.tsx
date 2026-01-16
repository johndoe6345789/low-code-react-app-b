import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

interface ToolbarButtonProps {
  icon: React.ReactNode
  label: string
  onClick: () => void
  variant?: 'default' | 'outline' | 'ghost' | 'destructive'
  disabled?: boolean
  className?: string
}

export function ToolbarButton({
  icon,
  label,
  onClick,
  variant = 'outline',
  disabled = false,
  className = '',
}: ToolbarButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={variant}
          size="icon"
          onClick={onClick}
          disabled={disabled}
          className={`shrink-0 ${className}`}
        >
          {icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}
