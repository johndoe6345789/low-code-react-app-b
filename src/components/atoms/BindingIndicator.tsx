import { Link } from '@phosphor-icons/react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface BindingIndicatorProps {
  sourceId: string
  path?: string
  className?: string
}

export function BindingIndicator({ sourceId, path, className = '' }: BindingIndicatorProps) {
  const bindingText = path ? `${sourceId}.${path}` : sourceId
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs bg-accent/10 text-accent border border-accent/30 ${className}`}>
            <Link weight="bold" className="w-3 h-3" />
            <span className="font-mono">{bindingText}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">Bound to: {bindingText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
