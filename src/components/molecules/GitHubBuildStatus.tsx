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
  CheckSquare,
} from '@phosphor-icons/react'
import { Skeleton } from '@/components/ui/skeleton'
import copy from '@/data/github-build-status.json'
import { useGithubBuildStatus, Workflow, WorkflowRun } from '@/hooks/use-github-build-status'

interface GitHubBuildStatusProps {
  owner: string
  repo: string
  defaultBranch?: string
}

interface WorkflowRunStatusProps {
  status: string
  conclusion: string | null
}

interface WorkflowRunDetailsProps {
  branch: string
  updatedAt: string
  event: string
}

interface WorkflowRunItemProps {
  workflow: WorkflowRun
  renderStatus: (status: string, conclusion: string | null) => React.ReactNode
  renderBadge: (status: string, conclusion: string | null) => React.ReactNode
  formatTime: (dateString: string) => string
}

interface WorkflowBadgeListProps {
  workflows: Workflow[]
  copiedBadge: string | null
  defaultBranch: string
  onCopyBadge: (workflowPath: string, workflowName: string, branch?: string) => void
  getBadgeUrl: (workflowPath: string, branch?: string) => string
  getBadgeMarkdown: (workflowPath: string, workflowName: string, branch?: string) => string
}

interface BranchBadgeListProps {
  branches: string[]
  workflows: Workflow[]
  copiedBadge: string | null
  onCopyBadge: (workflowPath: string, workflowName: string, branch: string) => void
  getBadgeUrl: (workflowPath: string, branch?: string) => string
}

const WorkflowRunStatus = ({ status, conclusion }: WorkflowRunStatusProps) => {
  const getStatusIcon = () => {
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

  return <div className="flex items-center">{getStatusIcon()}</div>
}

const WorkflowRunBadge = ({ status, conclusion }: WorkflowRunStatusProps) => {
  if (status === 'completed') {
    if (conclusion === 'success') {
      return (
        <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
          {copy.status.success}
        </Badge>
      )
    }
    if (conclusion === 'failure') {
      return <Badge variant="destructive">{copy.status.failed}</Badge>
    }
    if (conclusion === 'cancelled') {
      return <Badge variant="secondary">{copy.status.cancelled}</Badge>
    }
  }
  return (
    <Badge variant="outline" className="border-blue-500/50 text-blue-500">
      {copy.status.running}
    </Badge>
  )
}

const WorkflowRunDetails = ({ branch, updatedAt, event }: WorkflowRunDetailsProps) => (
  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
    <span className="truncate">{branch}</span>
    <span>•</span>
    <span>{updatedAt}</span>
    <span>•</span>
    <span className="truncate">{event}</span>
  </div>
)

const WorkflowRunItem = ({ workflow, renderStatus, renderBadge, formatTime }: WorkflowRunItemProps) => (
  <div
    className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-accent/50 transition-colors"
  >
    <div className="flex items-center gap-3 flex-1 min-w-0">
      {renderStatus(workflow.status, workflow.conclusion)}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium truncate">{workflow.name}</p>
          {renderBadge(workflow.status, workflow.conclusion)}
        </div>
        <WorkflowRunDetails
          branch={workflow.head_branch}
          updatedAt={formatTime(workflow.updated_at)}
          event={workflow.event}
        />
      </div>
    </div>
    <Button size="sm" variant="ghost" asChild className="ml-2">
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
)

const WorkflowBadgeList = ({
  workflows,
  copiedBadge,
  defaultBranch,
  onCopyBadge,
  getBadgeUrl,
  getBadgeMarkdown,
}: WorkflowBadgeListProps) => (
  <div>
    <h3 className="text-sm font-medium mb-3">{copy.sections.workflowBadges}</h3>
    <div className="space-y-3">
      {workflows.map((workflow) => (
        <div
          key={workflow.id}
          className="p-3 border border-border rounded-lg space-y-2"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">{workflow.name}</p>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onCopyBadge(workflow.path, workflow.name)}
              className="h-7 text-xs"
            >
              {copiedBadge === `${workflow.path}-${defaultBranch}` ? (
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
)

const BranchBadgeList = ({
  branches,
  workflows,
  copiedBadge,
  onCopyBadge,
  getBadgeUrl,
}: BranchBadgeListProps) => (
  <div>
    <h3 className="text-sm font-medium mb-3">{copy.sections.branchBadges}</h3>
    <div className="space-y-3">
      {branches.slice(0, 3).map((branch) => (
        <div key={branch} className="space-y-2">
          <div className="flex items-center gap-2">
            <GitBranch size={16} weight="duotone" />
            <p className="text-sm font-medium">{branch}</p>
          </div>
          {workflows.slice(0, 2).map((workflow) => (
            <div
              key={`${workflow.id}-${branch}`}
              className="p-3 border border-border rounded-lg space-y-2 ml-6"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">{workflow.name}</p>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onCopyBadge(workflow.path, workflow.name, branch)}
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
)

export function GitHubBuildStatus({ owner, repo, defaultBranch = 'main' }: GitHubBuildStatusProps) {
  const {
    workflows,
    allWorkflows,
    loading,
    error,
    copiedBadge,
    actions,
  } = useGithubBuildStatus({ owner, repo, defaultBranch })
  const { refresh, copyBadgeMarkdown, getBadgeUrl, getBadgeMarkdown, formatTime } = actions

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch size={24} weight="duotone" />
            {copy.title}
          </CardTitle>
          <CardDescription>{copy.loading.description}</CardDescription>
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
            {copy.title}
          </CardTitle>
          <CardDescription>{copy.error.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-3">
            <XCircle size={20} weight="fill" className="text-red-500 mt-0.5" />
            <div className="flex-1 space-y-2">
              <p className="text-sm text-red-500">{error}</p>
              <Button size="sm" variant="outline" onClick={refresh} className="text-xs">
                {copy.error.retry}
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
            {copy.title}
          </CardTitle>
          <CardDescription>{copy.empty.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{copy.empty.body}</p>
        </CardContent>
      </Card>
    )
  }

  const uniqueBranches = Array.from(new Set(workflows.map((workflow) => workflow.head_branch)))

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <GitBranch size={24} weight="duotone" />
              {copy.title}
            </CardTitle>
            <CardDescription>{copy.header.description}</CardDescription>
          </div>
          <Button size="sm" variant="ghost" onClick={refresh} className="text-xs">
            {copy.header.refresh}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="badges" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="badges">{copy.tabs.badges}</TabsTrigger>
            <TabsTrigger value="runs">{copy.tabs.runs}</TabsTrigger>
          </TabsList>

          <TabsContent value="badges" className="space-y-4 mt-4">
            <div className="space-y-4">
              <WorkflowBadgeList
                workflows={allWorkflows}
                copiedBadge={copiedBadge}
                defaultBranch={defaultBranch}
                onCopyBadge={copyBadgeMarkdown}
                getBadgeUrl={getBadgeUrl}
                getBadgeMarkdown={getBadgeMarkdown}
              />

              {uniqueBranches.length > 0 && (
                <BranchBadgeList
                  branches={uniqueBranches}
                  workflows={allWorkflows}
                  copiedBadge={copiedBadge}
                  onCopyBadge={copyBadgeMarkdown}
                  getBadgeUrl={getBadgeUrl}
                />
              )}
            </div>
          </TabsContent>

          <TabsContent value="runs" className="space-y-3 mt-4">
            {workflows.map((workflow) => (
              <WorkflowRunItem
                key={workflow.id}
                workflow={workflow}
                renderStatus={(status, conclusion) => (
                  <WorkflowRunStatus status={status} conclusion={conclusion} />
                )}
                renderBadge={(status, conclusion) => (
                  <WorkflowRunBadge status={status} conclusion={conclusion} />
                )}
                formatTime={formatTime}
              />
            ))}
            <Button size="sm" variant="outline" asChild className="w-full text-xs">
              <a
                href={`https://github.com/${owner}/${repo}/actions`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                {copy.actions.viewAllWorkflows}
                <ArrowSquareOut size={14} />
              </a>
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
