import { useState } from 'react'
import { CheckCircle, Info, Warning, Wrench, X } from '@phosphor-icons/react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ActionButton, Badge, Code, Flex, Text } from '@/components/atoms'
import { CodeError } from '@/types/errors'

interface ErrorPanelErrorItemProps {
  error: CodeError
  isRepairing: boolean
  lineLabel: string
  fixedLabel: string
  showCodeLabel: string
  hideCodeLabel: string
  onRepair: (error: CodeError) => void
}

const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case 'error':
      return <X size={16} weight="bold" className="text-destructive" />
    case 'warning':
      return <Warning size={16} weight="bold" className="text-yellow-500" />
    case 'info':
      return <Info size={16} weight="bold" className="text-blue-500" />
    default:
      return <Info size={16} />
  }
}

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'error':
      return 'destructive'
    case 'warning':
      return 'secondary'
    case 'info':
      return 'outline'
    default:
      return 'outline'
  }
}

export function ErrorPanelErrorItem({
  error,
  isRepairing,
  lineLabel,
  fixedLabel,
  showCodeLabel,
  hideCodeLabel,
  onRepair,
}: ErrorPanelErrorItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
      <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
        <div className="mt-0.5">{getSeverityIcon(error.severity)}</div>
        <div className="flex-1 min-w-0">
          <Flex align="center" gap="sm" className="mb-1">
            <Badge variant={getSeverityColor(error.severity) as any} size="sm">
              {error.type}
            </Badge>
            {error.line && (
              <Text variant="caption">
                {lineLabel} {error.line}
              </Text>
            )}
            {error.isFixed && (
              <Badge variant="outline" size="sm" className="text-green-500 border-green-500">
                <CheckCircle size={12} className="mr-1" />
                {fixedLabel}
              </Badge>
            )}
          </Flex>
          <Text variant="body" className="mb-2">
            {error.message}
          </Text>
          {error.code && (
            <CollapsibleTrigger asChild>
              <button className="text-xs text-accent hover:text-accent/80 underline">
                {isExpanded ? hideCodeLabel : showCodeLabel}
              </button>
            </CollapsibleTrigger>
          )}
        </div>
        <ActionButton
          icon={<Wrench size={14} />}
          label=""
          onClick={() => onRepair(error)}
          disabled={isRepairing || error.isFixed}
          variant="outline"
          size="sm"
        />
      </div>
      {error.code && (
        <CollapsibleContent>
          <div className="ml-8 mt-2 p-3 bg-muted rounded">
            <Code className="text-xs">{error.code}</Code>
          </div>
        </CollapsibleContent>
      )}
    </Collapsible>
  )
}
