import { IconButton, Tooltip } from '@/components/atoms'
import { TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

interface ToolbarButtonProps {
  icon: React.ReactNode
  label: string
  onClick: () => void
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive'
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
    <Tooltip content={label}>
      <IconButton
        icon={icon}
        onClick={onClick}
        variant={variant}
        disabled={disabled}
        className={`shrink-0 ${className}`}
      />
    </Tooltip>
  )
}
