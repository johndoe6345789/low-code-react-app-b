import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Code, 
  Database, 
  Tree, 
  PaintBrush, 
  Flask, 
  Play, 
  Cube, 
  FileText,
  Rocket,
  GitBranch,
  Package,
} from '@phosphor-icons/react'
import { ProjectFile, PrismaModel, ComponentNode, ThemeConfig, PlaywrightTest, StorybookStory, UnitTest, FlaskConfig, NextJsConfig } from '@/types/project'
import { 
  SeedDataStatus, 
  DetailRow, 
  CompletionCard, 
  TipsCard, 
  StatCard,
  QuickActionButton,
  PanelHeader,
} from '@/components/atoms'
import { GitHubBuildStatus } from '@/components/molecules/GitHubBuildStatus'
import { useDashboardMetrics } from '@/hooks/ui/use-dashboard-metrics'
import { useDashboardTips } from '@/hooks/ui/use-dashboard-tips'

interface ProjectDashboardProps {
  files: ProjectFile[]
  models: PrismaModel[]
  components: ComponentNode[]
  theme: ThemeConfig
  playwrightTests: PlaywrightTest[]
  storybookStories: StorybookStory[]
  unitTests: UnitTest[]
  flaskConfig: FlaskConfig
  nextjsConfig: NextJsConfig
  onNavigate?: (page: string) => void
}

export function ProjectDashboard(props: ProjectDashboardProps) {
  const {
    files,
    models,
    components,
    theme,
    playwrightTests,
    storybookStories,
    unitTests,
    flaskConfig,
    nextjsConfig,
    onNavigate,
  } = props

  const metrics = useDashboardMetrics({
    files,
    models,
    components,
    theme,
    playwrightTests,
    storybookStories,
    unitTests,
    flaskConfig,
  })

  const tips = useDashboardTips({
    totalFiles: metrics.totalFiles,
    totalModels: metrics.totalModels,
    totalComponents: metrics.totalComponents,
    totalThemeVariants: metrics.totalThemeVariants,
    totalTests: metrics.totalTests,
  })

  return (
    <div className="h-full overflow-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Project Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your CodeForge project
        </p>
      </div>

      <CompletionCard 
        completionScore={metrics.completionScore}
        completionMessage={metrics.completionMessage}
        isReadyToExport={metrics.isReadyToExport}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          icon={<Code size={24} weight="duotone" />}
          title="Code Files"
          value={metrics.totalFiles}
          description={`${metrics.totalFiles} file${metrics.totalFiles !== 1 ? 's' : ''} in your project`}
          color="text-blue-500"
        />
        
        <StatCard
          icon={<Database size={24} weight="duotone" />}
          title="Database Models"
          value={metrics.totalModels}
          description={`${metrics.totalModels} Prisma model${metrics.totalModels !== 1 ? 's' : ''} defined`}
          color="text-purple-500"
        />
        
        <StatCard
          icon={<Tree size={24} weight="duotone" />}
          title="Components"
          value={metrics.totalComponents}
          description={`${metrics.totalComponents} component${metrics.totalComponents !== 1 ? 's' : ''} in tree`}
          color="text-green-500"
        />
        
        <StatCard
          icon={<PaintBrush size={24} weight="duotone" />}
          title="Theme Variants"
          value={metrics.totalThemeVariants}
          description={`${metrics.totalThemeVariants} theme${metrics.totalThemeVariants !== 1 ? 's' : ''} configured`}
          color="text-pink-500"
        />
        
        <StatCard
          icon={<Flask size={24} weight="duotone" />}
          title="API Endpoints"
          value={metrics.totalEndpoints}
          description={`${metrics.totalEndpoints} Flask endpoint${metrics.totalEndpoints !== 1 ? 's' : ''}`}
          color="text-orange-500"
        />
        
        <StatCard
          icon={<Cube size={24} weight="duotone" />}
          title="Tests"
          value={metrics.totalTests}
          description={`${metrics.totalTests} test${metrics.totalTests !== 1 ? 's' : ''} written`}
          color="text-cyan-500"
        />
      </div>

      <SeedDataStatus />

      {nextjsConfig?.githubRepo && (
        <GitHubBuildStatus 
          owner={nextjsConfig.githubRepo.owner} 
          repo={nextjsConfig.githubRepo.repo} 
        />
      )}

      <div>
        <PanelHeader
          title="Quick Actions"
          subtitle="Jump to commonly used tools"
          icon={<Rocket size={24} weight="duotone" />}
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-4">
          <QuickActionButton
            icon={<Code size={32} weight="duotone" />}
            label="Code Editor"
            description="Edit files"
            variant="primary"
            onClick={() => onNavigate?.('code')}
          />
          <QuickActionButton
            icon={<Database size={32} weight="duotone" />}
            label="Models"
            description="Design schema"
            variant="primary"
            onClick={() => onNavigate?.('models')}
          />
          <QuickActionButton
            icon={<Tree size={32} weight="duotone" />}
            label="Components"
            description="Build UI"
            variant="accent"
            onClick={() => onNavigate?.('components')}
          />
          <QuickActionButton
            icon={<Package size={32} weight="duotone" />}
            label="Deploy"
            description="Export project"
            variant="accent"
            onClick={() => onNavigate?.('export')}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch size={20} />
            Project Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <DetailRow
            icon={<Play size={18} />}
            label="Playwright Tests"
            value={metrics.playwrightCount}
          />
          <DetailRow
            icon={<FileText size={18} />}
            label="Storybook Stories"
            value={metrics.storybookCount}
          />
          <DetailRow
            icon={<Cube size={18} />}
            label="Unit Tests"
            value={metrics.unitTestCount}
          />
          <DetailRow
            icon={<Flask size={18} />}
            label="Flask Blueprints"
            value={metrics.blueprintCount}
          />
        </CardContent>
      </Card>

      <TipsCard tips={tips} />
    </div>
  )
}
