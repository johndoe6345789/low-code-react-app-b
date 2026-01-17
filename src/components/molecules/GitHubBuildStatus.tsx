import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  GitBranch, 
  CheckCircle, 
  XCircle, 
  Clock, 
  ArrowSquareOut,
  Warning
} from '@phosphor-icons/react'
import { Skeleton } from '@/components/ui/skeleton'

interface WorkflowRun {
  id: number
  name: string
  status: string
  conclusion: string | null
  created_at: string
  updated_at: string
  html_url: string
  head_branch: string
  head_sha: string
  event: string
}

interface GitHubBuildStatusProps {
  owner: string
  repo: string
}

export function GitHubBuildStatus({ owner, repo }: GitHubBuildStatusProps) {
  const [workflows, setWorkflows] = useState<WorkflowRun[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchWorkflowRuns()
  }, [owner, repo])

  const fetchWorkflowRuns = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/actions/runs?per_page=5`,
        {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
          },
        }
      )

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`)
      }

      const data = await response.json()
      setWorkflows(data.workflow_runs || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch workflows')
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string, conclusion: string | null) => {
    if (status === 'completed') {
      if (conclusion === 'success') {
        return <CheckCircle size={20} weight="fill" className="text-green-500" />
      }
      if (conclusion === 'failure') {
        return <XCircle size={20} weight="fill" className="text-red-500" />
      }
      if (conclusion === 'cancelled') {
        return <Warning size={20} weight="fill" className="text-yellow-500" />
      }
    }
    return <Clock size={20} weight="duotone" className="text-blue-500 animate-pulse" />
  }

  const getStatusBadge = (status: string, conclusion: string | null) => {
    if (status === 'completed') {
      if (conclusion === 'success') {
        return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Success</Badge>
      }
      if (conclusion === 'failure') {
        return <Badge variant="destructive">Failed</Badge>
      }
      if (conclusion === 'cancelled') {
        return <Badge variant="secondary">Cancelled</Badge>
      }
    }
    return <Badge variant="outline" className="border-blue-500/50 text-blue-500">Running</Badge>
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return 'just now'
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch size={24} weight="duotone" />
            GitHub Actions
          </CardTitle>
          <CardDescription>Recent workflow runs</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-3 border border-border rounded-lg">
              <div className="flex items-center gap-3 flex-1">
                <Skeleton className="w-5 h-5 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
              </div>
              <Skeleton className="w-16 h-5 rounded" />
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="bg-red-500/10 border-red-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch size={24} weight="duotone" />
            GitHub Actions
          </CardTitle>
          <CardDescription>Unable to fetch workflow status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-3">
            <XCircle size={20} weight="fill" className="text-red-500 mt-0.5" />
            <div className="flex-1 space-y-2">
              <p className="text-sm text-red-500">{error}</p>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={fetchWorkflowRuns}
                className="text-xs"
              >
                Try Again
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (workflows.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch size={24} weight="duotone" />
            GitHub Actions
          </CardTitle>
          <CardDescription>No workflow runs found</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No GitHub Actions workflows have been run yet.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <GitBranch size={24} weight="duotone" />
              GitHub Actions
            </CardTitle>
            <CardDescription>Recent workflow runs from {owner}/{repo}</CardDescription>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={fetchWorkflowRuns}
            className="text-xs"
          >
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {workflows.map((workflow) => (
          <div
            key={workflow.id}
            className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-accent/50 transition-colors"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {getStatusIcon(workflow.status, workflow.conclusion)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium truncate">
                    {workflow.name}
                  </p>
                  {getStatusBadge(workflow.status, workflow.conclusion)}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                  <span className="truncate">{workflow.head_branch}</span>
                  <span>•</span>
                  <span>{formatTime(workflow.updated_at)}</span>
                  <span>•</span>
                  <span className="truncate">{workflow.event}</span>
                </div>
              </div>
            </div>
            <Button
              size="sm"
              variant="ghost"
              asChild
              className="ml-2"
            >
              <a
                href={workflow.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1"
              >
                <ArrowSquareOut size={16} />
              </a>
            </Button>
          </div>
        ))}
        <Button
          size="sm"
          variant="outline"
          asChild
          className="w-full text-xs"
        >
          <a
            href={`https://github.com/${owner}/${repo}/actions`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            View All Workflows
            <ArrowSquareOut size={14} />
          </a>
        </Button>
      </CardContent>
    </Card>
  )
}
