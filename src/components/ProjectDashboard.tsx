import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Code, 
  Database, 
  Tree, 
  PaintBrush, 
  Flask, 
  Play, 
  Cube, 
  FileText,
  CheckCircle,
  Warning
} from '@phosphor-icons/react'
import { ProjectFile, PrismaModel, ComponentNode, ThemeConfig, PlaywrightTest, StorybookStory, UnitTest, FlaskConfig } from '@/types/project'
import { SeedDataStatus } from '@/components/atoms'

interface ProjectDashboardProps {
  files: ProjectFile[]
  models: PrismaModel[]
  components: ComponentNode[]
  theme: ThemeConfig
  playwrightTests: PlaywrightTest[]
  storybookStories: StorybookStory[]
  unitTests: UnitTest[]
  flaskConfig: FlaskConfig
}

export function ProjectDashboard({
  files,
  models,
  components,
  theme,
  playwrightTests,
  storybookStories,
  unitTests,
  flaskConfig,
}: ProjectDashboardProps) {
  const totalFiles = files.length
  const totalModels = models.length
  const totalComponents = components.length
  const totalThemeVariants = theme?.variants?.length || 0
  const totalEndpoints = flaskConfig.blueprints.reduce((acc, bp) => acc + bp.endpoints.length, 0)
  const totalTests = playwrightTests.length + storybookStories.length + unitTests.length

  const completionScore = calculateCompletionScore({
    files: totalFiles,
    models: totalModels,
    components: totalComponents,
    tests: totalTests,
  })

  return (
    <div className="h-full overflow-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Project Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your CodeForge project
        </p>
      </div>

      <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle size={24} weight="duotone" className="text-primary" />
            Project Completeness
          </CardTitle>
          <CardDescription>Overall progress of your application</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-4xl font-bold">{completionScore}%</span>
            <Badge variant={completionScore >= 70 ? 'default' : 'secondary'} className="text-sm">
              {completionScore >= 70 ? 'Ready to Export' : 'In Progress'}
            </Badge>
          </div>
          <Progress value={completionScore} className="h-3" />
          <p className="text-sm text-muted-foreground">
            {getCompletionMessage(completionScore)}
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          icon={<Code size={24} weight="duotone" />}
          title="Code Files"
          value={totalFiles}
          description={`${totalFiles} file${totalFiles !== 1 ? 's' : ''} in your project`}
          color="text-blue-500"
        />
        
        <StatCard
          icon={<Database size={24} weight="duotone" />}
          title="Database Models"
          value={totalModels}
          description={`${totalModels} Prisma model${totalModels !== 1 ? 's' : ''} defined`}
          color="text-purple-500"
        />
        
        <StatCard
          icon={<Tree size={24} weight="duotone" />}
          title="Components"
          value={totalComponents}
          description={`${totalComponents} component${totalComponents !== 1 ? 's' : ''} in tree`}
          color="text-green-500"
        />
        
        <StatCard
          icon={<PaintBrush size={24} weight="duotone" />}
          title="Theme Variants"
          value={totalThemeVariants}
          description={`${totalThemeVariants} theme${totalThemeVariants !== 1 ? 's' : ''} configured`}
          color="text-pink-500"
        />
        
        <StatCard
          icon={<Flask size={24} weight="duotone" />}
          title="API Endpoints"
          value={totalEndpoints}
          description={`${totalEndpoints} Flask endpoint${totalEndpoints !== 1 ? 's' : ''}`}
          color="text-orange-500"
        />
        
        <StatCard
          icon={<Cube size={24} weight="duotone" />}
          title="Tests"
          value={totalTests}
          description={`${totalTests} test${totalTests !== 1 ? 's' : ''} written`}
          color="text-cyan-500"
        />
      </div>

      <SeedDataStatus />

      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <DetailRow
            icon={<Play size={18} />}
            label="Playwright Tests"
            value={playwrightTests.length}
          />
          <DetailRow
            icon={<FileText size={18} />}
            label="Storybook Stories"
            value={storybookStories.length}
          />
          <DetailRow
            icon={<Cube size={18} />}
            label="Unit Tests"
            value={unitTests.length}
          />
          <DetailRow
            icon={<Flask size={18} />}
            label="Flask Blueprints"
            value={flaskConfig.blueprints.length}
          />
        </CardContent>
      </Card>

      {(totalModels === 0 || totalFiles === 0) && (
        <Card className="bg-yellow-500/10 border-yellow-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Warning size={24} weight="duotone" className="text-yellow-500" />
              Quick Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {totalFiles === 0 && (
              <p>• Start by creating some code files in the Code Editor tab</p>
            )}
            {totalModels === 0 && (
              <p>• Define your data models in the Models tab to set up your database</p>
            )}
            {totalComponents === 0 && (
              <p>• Build your UI structure in the Components tab</p>
            )}
            {totalThemeVariants <= 1 && (
              <p>• Create additional theme variants (dark mode) in the Styling tab</p>
            )}
            {totalTests === 0 && (
              <p>• Add tests for better code quality and reliability</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function StatCard({ 
  icon, 
  title, 
  value, 
  description, 
  color 
}: { 
  icon: React.ReactNode
  title: string
  value: number
  description: string
  color: string
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
          <div className={color}>{icon}</div>
        </div>
      </CardContent>
    </Card>
  )
}

function DetailRow({ 
  icon, 
  label, 
  value 
}: { 
  icon: React.ReactNode
  label: string
  value: number
}) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground">{icon}</span>
        <span className="text-sm font-medium">{label}</span>
      </div>
      <Badge variant="secondary">{value}</Badge>
    </div>
  )
}

function calculateCompletionScore(data: {
  files: number
  models: number
  components: number
  tests: number
}): number {
  const weights = {
    files: 25,
    models: 25,
    components: 25,
    tests: 25,
  }

  const scores = {
    files: Math.min(data.files / 5, 1) * weights.files,
    models: Math.min(data.models / 3, 1) * weights.models,
    components: Math.min(data.components / 5, 1) * weights.components,
    tests: Math.min(data.tests / 5, 1) * weights.tests,
  }

  return Math.round(
    scores.files + scores.models + scores.components + scores.tests
  )
}

function getCompletionMessage(score: number): string {
  if (score >= 90) return 'Excellent! Your project is comprehensive and ready to deploy.'
  if (score >= 70) return 'Great progress! Your project has most essential features.'
  if (score >= 50) return 'Good start! Keep adding more features and tests.'
  if (score >= 30) return 'Getting there! Add more components and models.'
  return 'Just starting! Begin by creating models and components.'
}
