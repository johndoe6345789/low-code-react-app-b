import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  ArrowSquareOut,
  CheckCircle,
  Clock,
  WarningCircle,
  XCircle,
} from '@phosphor-icons/react'
import type { GitHubBuildStatusWrapperProps, GitHubBuildStatusWorkflowItem } from './interfaces'

const getStatusBadge = (workflow: GitHubBuildStatusWorkflowItem) => {
  if (workflow.status === 'completed') {
    if (workflow.conclusion === 'success') {
      return <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Success</Badge>
    }
    if (workflow.conclusion === 'failure') {
      return <Badge variant="destructive">Failed</Badge>
    }
    if (workflow.conclusion === 'cancelled') {
      return <Badge variant="secondary">Cancelled</Badge>
    }
  }

  return (
    <Badge variant="outline" className="border-blue-500/50 text-blue-500">
      Running
    </Badge>
  )
}

const getStatusIcon = (workflow: GitHubBuildStatusWorkflowItem) => {
  if (workflow.status === 'completed') {
    if (workflow.conclusion === 'success') {
      return <CheckCircle size={18} className="text-green-500" weight="fill" />
    }
    if (workflow.conclusion === 'failure') {
      return <XCircle size={18} className="text-red-500" weight="fill" />
    }
    if (workflow.conclusion === 'cancelled') {
      return <WarningCircle size={18} className="text-yellow-500" weight="fill" />
    }
  }

  return <Clock size={18} className="text-blue-500" weight="duotone" />
}

export function GitHubBuildStatusWrapper({
  title = 'GitHub Build Status',
  description = 'Latest workflow runs and status badges.',
  workflows = [],
  isLoading = false,
  errorMessage,
  emptyMessage = 'No workflows to display yet.',
  footerLinkLabel = 'View on GitHub',
  footerLinkUrl,
  className,
}: GitHubBuildStatusWrapperProps) {
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowSquareOut size={18} weight="duotone" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading && <p className="text-sm text-muted-foreground">Loading workflows…</p>}

        {!isLoading && errorMessage && (
          <div className="flex items-center gap-2 text-sm text-red-500">
            <WarningCircle size={16} weight="fill" />
            <span>{errorMessage}</span>
          </div>
        )}

        {!isLoading && !errorMessage && workflows.length === 0 && (
          <p className="text-sm text-muted-foreground">{emptyMessage}</p>
        )}

        {!isLoading && !errorMessage && workflows.length > 0 && (
          <div className="space-y-3">
            {workflows.map((workflow) => (
              <div
                key={workflow.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-border p-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {getStatusIcon(workflow)}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium truncate">{workflow.name}</p>
                      {getStatusBadge(workflow)}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {[workflow.branch, workflow.updatedAt, workflow.event]
                        .filter(Boolean)
                        .join(' • ')}
                    </div>
                  </div>
                </div>
                {workflow.url && (
                  <Button variant="ghost" size="sm" asChild>
                    <a href={workflow.url} target="_blank" rel="noopener noreferrer">
                      <ArrowSquareOut size={14} />
                    </a>
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}

        {footerLinkUrl && (
          <Button variant="outline" size="sm" asChild className="w-full">
            <a href={footerLinkUrl} target="_blank" rel="noopener noreferrer">
              {footerLinkLabel}
            </a>
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
