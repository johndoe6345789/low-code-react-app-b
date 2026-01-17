import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  GitBranch, 
  CheckCircle, 
  XCircle, 
  Clock, 
  ArrowSquareOut,
  Warning,
  Copy,
  CheckSquare
} from '@phosphor-icons/react'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'

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
  workflow_id: number
  path: string
}

interface Workflow {
  id: number
  name: string
  path: string
  state: string
  badge_url: string
}

interface GitHubBuildStatusProps {
  owner: string
  repo: string
  defaultBranch?: string
}

export function GitHubBuildStatus({ owner, repo, defaultBranch = 'main' }: GitHubBuildStatusProps) {
  const [workflows, setWorkflows] = useState<WorkflowRun[]>([])
  const [allWorkflows, setAllWorkflows] = useState<Workflow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copiedBadge, setCopiedBadge] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [owner, repo])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [runsResponse, workflowsResponse] = await Promise.all([
        fetch(`https://api.github.com/repos/${owner}/${repo}/actions/runs?per_page=5`, {
          headers: { 'Accept': 'application/vnd.github.v3+json' },
        }),
        fetch(`https://api.github.com/repos/${owner}/${repo}/actions/workflows`, {
          headers: { 'Accept': 'application/vnd.github.v3+json' },
        })
      ])

      if (!runsResponse.ok || !workflowsResponse.ok) {
        throw new Error(`GitHub API error: ${runsResponse.status}`)
      }

      const runsData = await runsResponse.json()
      const workflowsData = await workflowsResponse.json()
      
      setWorkflows(runsData.workflow_runs || [])
      setAllWorkflows(workflowsData.workflows || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch workflows')
    } finally {
      setLoading(false)
    }
  }

  const getBadgeUrl = (workflowPath: string, branch?: string) => {
    const workflowFile = workflowPath.split('/').pop()
    if (branch) {
      return `https://github.com/${owner}/${repo}/actions/workflows/${workflowFile}/badge.svg?branch=${branch}`
    }
    return `https://github.com/${owner}/${repo}/actions/workflows/${workflowFile}/badge.svg`
  }

  const getBadgeMarkdown = (workflowPath: string, workflowName: string, branch?: string) => {
    const badgeUrl = getBadgeUrl(workflowPath, branch)
    const actionUrl = `https://github.com/${owner}/${repo}/actions/workflows/${workflowPath.split('/').pop()}`
    return `[![${workflowName}](${badgeUrl})](${actionUrl})`
  }

  const copyBadgeMarkdown = (workflowPath: string, workflowName: string, branch?: string) => {
    const markdown = getBadgeMarkdown(workflowPath, workflowName, branch)
    navigator.clipboard.writeText(markdown)
    const key = `${workflowPath}-${branch || 'default'}`
    setCopiedBadge(key)
    toast.success('Badge markdown copied to clipboard')
    setTimeout(() => setCopiedBadge(null), 2000)
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
                onClick={fetchData}
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

  if (workflows.length === 0 && allWorkflows.length === 0) {
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

  const uniqueBranches = Array.from(new Set(workflows.map(w => w.head_branch)))

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <GitBranch size={24} weight="duotone" />
              GitHub Actions
            </CardTitle>
            <CardDescription>Build status badges and recent workflow runs</CardDescription>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={fetchData}
            className="text-xs"
          >
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="badges" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="badges">Status Badges</TabsTrigger>
            <TabsTrigger value="runs">Recent Runs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="badges" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-3">Workflow Badges</h3>
                <div className="space-y-3">
                  {allWorkflows.map((workflow) => (
                    <div
                      key={workflow.id}
                      className="p-3 border border-border rounded-lg space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{workflow.name}</p>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyBadgeMarkdown(workflow.path, workflow.name)}
                          className="h-7 text-xs"
                        >
                          {copiedBadge === `${workflow.path}-default` ? (
                            <CheckSquare size={14} className="text-green-500" />
                          ) : (
                            <Copy size={14} />
                          )}
                        </Button>
                      </div>
                      <img
                        src={getBadgeUrl(workflow.path)}
                        alt={`${workflow.name} status`}
                        className="h-5"
                      />
                      <p className="text-xs text-muted-foreground font-mono break-all">
                        {getBadgeMarkdown(workflow.path, workflow.name)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {uniqueBranches.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-3">Branch-Specific Badges</h3>
                  <div className="space-y-3">
                    {uniqueBranches.slice(0, 3).map((branch) => (
                      <div key={branch} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <GitBranch size={16} weight="duotone" />
                          <p className="text-sm font-medium">{branch}</p>
                        </div>
                        {allWorkflows.slice(0, 2).map((workflow) => (
                          <div
                            key={`${workflow.id}-${branch}`}
                            className="p-3 border border-border rounded-lg space-y-2 ml-6"
                          >
                            <div className="flex items-center justify-between">
                              <p className="text-xs text-muted-foreground">{workflow.name}</p>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => copyBadgeMarkdown(workflow.path, workflow.name, branch)}
                                className="h-7 text-xs"
                              >
                                {copiedBadge === `${workflow.path}-${branch}` ? (
                                  <CheckSquare size={14} className="text-green-500" />
                                ) : (
                                  <Copy size={14} />
                                )}
                              </Button>
                            </div>
                            <img
                              src={getBadgeUrl(workflow.path, branch)}
                              alt={`${workflow.name} status on ${branch}`}
                              className="h-5"
                            />
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="runs" className="space-y-3 mt-4">
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
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
