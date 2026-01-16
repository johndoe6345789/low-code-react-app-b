import {
  ChartBar,
  Code,
  Database,
  Tree,
  FlowArrow,
  PaintBrush,
  Flask,
  Play,
  BookOpen,
  Cube,
  Wrench,
  FileText,
  Gear,
  DeviceMobile,
  Image,
  Faders,
  Lightbulb,
} from '@phosphor-icons/react'

interface PageHeaderProps {
  activeTab: string
}

const tabInfo: Record<string, { title: string; icon: React.ReactNode; description?: string }> = {
  dashboard: {
    title: 'Dashboard',
    icon: <ChartBar size={24} weight="duotone" />,
    description: 'Project overview and statistics',
  },
  code: {
    title: 'Code Editor',
    icon: <Code size={24} weight="duotone" />,
    description: 'Edit project files',
  },
  models: {
    title: 'Models',
    icon: <Database size={24} weight="duotone" />,
    description: 'Define Prisma data models',
  },
  components: {
    title: 'Components',
    icon: <Tree size={24} weight="duotone" />,
    description: 'Create React components',
  },
  'component-trees': {
    title: 'Component Trees',
    icon: <Tree size={24} weight="duotone" />,
    description: 'Manage component hierarchies',
  },
  workflows: {
    title: 'Workflows',
    icon: <FlowArrow size={24} weight="duotone" />,
    description: 'Design automation workflows',
  },
  lambdas: {
    title: 'Lambdas',
    icon: <Code size={24} weight="duotone" />,
    description: 'Serverless functions',
  },
  styling: {
    title: 'Styling',
    icon: <PaintBrush size={24} weight="duotone" />,
    description: 'Theme and design tokens',
  },
  sass: {
    title: 'Sass Styles',
    icon: <PaintBrush size={24} weight="duotone" />,
    description: 'Custom Sass stylesheets',
  },
  favicon: {
    title: 'Favicon Designer',
    icon: <Image size={24} weight="duotone" />,
    description: 'Design app icons',
  },
  flask: {
    title: 'Flask API',
    icon: <Flask size={24} weight="duotone" />,
    description: 'Backend API configuration',
  },
  playwright: {
    title: 'Playwright',
    icon: <Play size={24} weight="duotone" />,
    description: 'E2E test scenarios',
  },
  storybook: {
    title: 'Storybook',
    icon: <BookOpen size={24} weight="duotone" />,
    description: 'Component documentation',
  },
  'unit-tests': {
    title: 'Unit Tests',
    icon: <Cube size={24} weight="duotone" />,
    description: 'Unit test suites',
  },
  errors: {
    title: 'Error Repair',
    icon: <Wrench size={24} weight="duotone" />,
    description: 'Automated error detection and fixing',
  },
  docs: {
    title: 'Documentation',
    icon: <FileText size={24} weight="duotone" />,
    description: 'Project guides and references',
  },
  settings: {
    title: 'Settings',
    icon: <Gear size={24} weight="duotone" />,
    description: 'Project configuration',
  },
  pwa: {
    title: 'PWA',
    icon: <DeviceMobile size={24} weight="duotone" />,
    description: 'Progressive Web App settings',
  },
  features: {
    title: 'Features',
    icon: <Faders size={24} weight="duotone" />,
    description: 'Toggle feature modules',
  },
  ideas: {
    title: 'Feature Ideas',
    icon: <Lightbulb size={24} weight="duotone" />,
    description: 'Brainstorm and organize feature ideas',
  },
}

export function PageHeader({ activeTab }: PageHeaderProps) {
  const info = tabInfo[activeTab] || {
    title: 'Unknown',
    icon: <Code size={24} weight="duotone" />,
  }

  return (
    <div className="border-b border-border bg-card px-4 sm:px-6 py-3 sm:py-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-primary shrink-0">
          {info.icon}
        </div>
        <div className="min-w-0">
          <h2 className="text-lg sm:text-xl font-bold truncate">{info.title}</h2>
          {info.description && (
            <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
              {info.description}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
