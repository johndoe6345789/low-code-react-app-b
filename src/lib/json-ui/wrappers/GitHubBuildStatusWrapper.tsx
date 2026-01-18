import { ComponentRenderer } from '@/lib/json-ui/component-renderer'
import { cn } from '@/lib/utils'
import gitHubBuildStatusDefinition from './definitions/github-build-status.json'
import type { GitHubBuildStatusWrapperProps, GitHubBuildStatusWorkflowItem } from './interfaces'

const getWorkflowStatus = (workflow: GitHubBuildStatusWorkflowItem) => {
  if (workflow.status === 'completed') {
    if (workflow.conclusion === 'success') {
      return {
        label: 'Success',
        className: 'bg-green-500/10 text-green-600 border-green-500/20',
      }
    }
    if (workflow.conclusion === 'failure') {
      return { label: 'Failed', className: 'bg-red-500/10 text-red-600 border-red-500/20' }
    }
    if (workflow.conclusion === 'cancelled') {
      return { label: 'Cancelled', className: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20' }
    }
  }

  return { label: 'Running', className: 'border-blue-500/50 text-blue-500' }
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
  const normalizedWorkflows = workflows.map((workflow) => {
    const status = getWorkflowStatus(workflow)
    return {
      ...workflow,
      statusLabel: status.label,
      statusClass: status.className,
      summaryLine: [workflow.branch, workflow.updatedAt, workflow.event].filter(Boolean).join(' • '),
    }
  })

  return (
    <ComponentRenderer
      component={gitHubBuildStatusDefinition}
      data={{
        title,
        description,
        workflows: normalizedWorkflows,
        isLoading,
        errorMessage,
        emptyMessage,
        loadingMessage: 'Loading workflows…',
        hasWorkflows: normalizedWorkflows.length > 0,
        footerLinkLabel,
        footerLinkUrl,
        className: cn(className),
      }}
    />
  )
}
