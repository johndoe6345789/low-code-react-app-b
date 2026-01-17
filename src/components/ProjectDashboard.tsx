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
} from '@phosphor-icons/react'
import { ProjectFile, PrismaModel, ComponentNode, ThemeConfig, PlaywrightTest, StorybookStory, UnitTest, FlaskConfig, NextJsConfig } from '@/types/project'
import { SeedDataStatus, DetailRow, CompletionCard, TipsCard } from '@/components/atoms'
import { GitHubBuildStatus } from '@/components/molecules/GitHubBuildStatus'
import { StatCard } from '@/components/molecules'
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

      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
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
