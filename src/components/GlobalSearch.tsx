import { useState, useMemo, useEffect } from 'react'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import {
  Code,
  Database,
  Tree,
  PaintBrush,
  Flask,
  Play,
  BookOpen,
  Cube,
  FlowArrow,
  Wrench,
  FileText,
  Gear,
  DeviceMobile,
  Faders,
  ChartBar,
  Image,
  File,
  Folder,
  MagnifyingGlass,
} from '@phosphor-icons/react'
import { ProjectFile, PrismaModel, ComponentNode, ComponentTree, Workflow, Lambda, PlaywrightTest, StorybookStory, UnitTest } from '@/types/project'
import { Badge } from '@/components/ui/badge'

interface SearchResult {
  id: string
  title: string
  subtitle?: string
  category: string
  icon: React.ReactNode
  action: () => void
  tags?: string[]
}

interface GlobalSearchProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  files: ProjectFile[]
  models: PrismaModel[]
  components: ComponentNode[]
  componentTrees: ComponentTree[]
  workflows: Workflow[]
  lambdas: Lambda[]
  playwrightTests: PlaywrightTest[]
  storybookStories: StorybookStory[]
  unitTests: UnitTest[]
  onNavigate: (tab: string, itemId?: string) => void
  onFileSelect: (fileId: string) => void
}

export function GlobalSearch({
  open,
  onOpenChange,
  files,
  models,
  components,
  componentTrees,
  workflows,
  lambdas,
  playwrightTests,
  storybookStories,
  unitTests,
  onNavigate,
  onFileSelect,
}: GlobalSearchProps) {
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (!open) {
      setSearchQuery('')
    }
  }, [open])

  const allResults = useMemo<SearchResult[]>(() => {
    const results: SearchResult[] = []

    results.push({
      id: 'nav-dashboard',
      title: 'Dashboard',
      subtitle: 'View project overview and statistics',
      category: 'Navigation',
      icon: <ChartBar size={18} weight="duotone" />,
      action: () => onNavigate('dashboard'),
      tags: ['home', 'overview', 'stats', 'metrics'],
    })

    results.push({
      id: 'nav-code',
      title: 'Code Editor',
      subtitle: 'Edit project files with Monaco',
      category: 'Navigation',
      icon: <Code size={18} weight="duotone" />,
      action: () => onNavigate('code'),
      tags: ['editor', 'monaco', 'typescript', 'javascript'],
    })

    results.push({
      id: 'nav-models',
      title: 'Models',
      subtitle: 'Design Prisma database models',
      category: 'Navigation',
      icon: <Database size={18} weight="duotone" />,
      action: () => onNavigate('models'),
      tags: ['prisma', 'database', 'schema', 'orm'],
    })

    results.push({
      id: 'nav-components',
      title: 'Components',
      subtitle: 'Build React components',
      category: 'Navigation',
      icon: <Tree size={18} weight="duotone" />,
      action: () => onNavigate('components'),
      tags: ['react', 'mui', 'ui', 'design'],
    })

    results.push({
      id: 'nav-component-trees',
      title: 'Component Trees',
      subtitle: 'Manage component hierarchies',
      category: 'Navigation',
      icon: <Tree size={18} weight="duotone" />,
      action: () => onNavigate('component-trees'),
      tags: ['hierarchy', 'structure', 'layout'],
    })

    results.push({
      id: 'nav-workflows',
      title: 'Workflows',
      subtitle: 'Design n8n-style workflows',
      category: 'Navigation',
      icon: <FlowArrow size={18} weight="duotone" />,
      action: () => onNavigate('workflows'),
      tags: ['automation', 'n8n', 'flow', 'pipeline'],
    })

    results.push({
      id: 'nav-lambdas',
      title: 'Lambdas',
      subtitle: 'Create serverless functions',
      category: 'Navigation',
      icon: <Code size={18} weight="duotone" />,
      action: () => onNavigate('lambdas'),
      tags: ['serverless', 'functions', 'api'],
    })

    results.push({
      id: 'nav-styling',
      title: 'Styling',
      subtitle: 'Design themes and colors',
      category: 'Navigation',
      icon: <PaintBrush size={18} weight="duotone" />,
      action: () => onNavigate('styling'),
      tags: ['theme', 'colors', 'css', 'design'],
    })

    results.push({
      id: 'nav-flask',
      title: 'Flask API',
      subtitle: 'Configure Flask backend',
      category: 'Navigation',
      icon: <Flask size={18} weight="duotone" />,
      action: () => onNavigate('flask'),
      tags: ['python', 'backend', 'api', 'rest'],
    })

    results.push({
      id: 'nav-playwright',
      title: 'Playwright Tests',
      subtitle: 'E2E testing configuration',
      category: 'Navigation',
      icon: <Play size={18} weight="duotone" />,
      action: () => onNavigate('playwright'),
      tags: ['testing', 'e2e', 'automation'],
    })

    results.push({
      id: 'nav-storybook',
      title: 'Storybook',
      subtitle: 'Component documentation',
      category: 'Navigation',
      icon: <BookOpen size={18} weight="duotone" />,
      action: () => onNavigate('storybook'),
      tags: ['documentation', 'components', 'stories'],
    })

    results.push({
      id: 'nav-unit-tests',
      title: 'Unit Tests',
      subtitle: 'Configure unit testing',
      category: 'Navigation',
      icon: <Cube size={18} weight="duotone" />,
      action: () => onNavigate('unit-tests'),
      tags: ['testing', 'jest', 'vitest'],
    })

    results.push({
      id: 'nav-errors',
      title: 'Error Repair',
      subtitle: 'Auto-detect and fix errors',
      category: 'Navigation',
      icon: <Wrench size={18} weight="duotone" />,
      action: () => onNavigate('errors'),
      tags: ['debugging', 'errors', 'fixes'],
    })

    results.push({
      id: 'nav-docs',
      title: 'Documentation',
      subtitle: 'View project documentation',
      category: 'Navigation',
      icon: <FileText size={18} weight="duotone" />,
      action: () => onNavigate('docs'),
      tags: ['readme', 'guide', 'help'],
    })

    results.push({
      id: 'nav-sass',
      title: 'Sass Styles',
      subtitle: 'Custom Sass styling',
      category: 'Navigation',
      icon: <PaintBrush size={18} weight="duotone" />,
      action: () => onNavigate('sass'),
      tags: ['sass', 'scss', 'styles', 'css'],
    })

    results.push({
      id: 'nav-favicon',
      title: 'Favicon Designer',
      subtitle: 'Design app icons',
      category: 'Navigation',
      icon: <Image size={18} weight="duotone" />,
      action: () => onNavigate('favicon'),
      tags: ['icon', 'logo', 'design'],
    })

    results.push({
      id: 'nav-settings',
      title: 'Settings',
      subtitle: 'Configure Next.js and npm',
      category: 'Navigation',
      icon: <Gear size={18} weight="duotone" />,
      action: () => onNavigate('settings'),
      tags: ['config', 'nextjs', 'npm', 'packages'],
    })

    results.push({
      id: 'nav-pwa',
      title: 'PWA Settings',
      subtitle: 'Progressive Web App config',
      category: 'Navigation',
      icon: <DeviceMobile size={18} weight="duotone" />,
      action: () => onNavigate('pwa'),
      tags: ['mobile', 'install', 'offline'],
    })

    results.push({
      id: 'nav-features',
      title: 'Feature Toggles',
      subtitle: 'Enable or disable features',
      category: 'Navigation',
      icon: <Faders size={18} weight="duotone" />,
      action: () => onNavigate('features'),
      tags: ['settings', 'toggles', 'enable'],
    })

    files.forEach((file) => {
      results.push({
        id: `file-${file.id}`,
        title: file.name,
        subtitle: file.path,
        category: 'Files',
        icon: <File size={18} weight="duotone" />,
        action: () => {
          onNavigate('code')
          onFileSelect(file.id)
        },
        tags: [file.language, file.path, 'code', 'file'],
      })
    })

    models.forEach((model) => {
      results.push({
        id: `model-${model.id}`,
        title: model.name,
        subtitle: `${model.fields.length} fields`,
        category: 'Models',
        icon: <Database size={18} weight="duotone" />,
        action: () => onNavigate('models', model.id),
        tags: ['prisma', 'database', 'schema', model.name.toLowerCase()],
      })
    })

    components.forEach((component) => {
      results.push({
        id: `component-${component.id}`,
        title: component.name,
        subtitle: component.type,
        category: 'Components',
        icon: <Tree size={18} weight="duotone" />,
        action: () => onNavigate('components', component.id),
        tags: ['react', 'component', component.type.toLowerCase(), component.name.toLowerCase()],
      })
    })

    componentTrees.forEach((tree) => {
      results.push({
        id: `tree-${tree.id}`,
        title: tree.name,
        subtitle: tree.description || `${tree.rootNodes.length} root nodes`,
        category: 'Component Trees',
        icon: <Folder size={18} weight="duotone" />,
        action: () => onNavigate('component-trees', tree.id),
        tags: ['hierarchy', 'structure', tree.name.toLowerCase()],
      })
    })

    workflows.forEach((workflow) => {
      results.push({
        id: `workflow-${workflow.id}`,
        title: workflow.name,
        subtitle: workflow.description || `${workflow.nodes.length} nodes`,
        category: 'Workflows',
        icon: <FlowArrow size={18} weight="duotone" />,
        action: () => onNavigate('workflows', workflow.id),
        tags: ['automation', 'flow', workflow.name.toLowerCase()],
      })
    })

    lambdas.forEach((lambda) => {
      results.push({
        id: `lambda-${lambda.id}`,
        title: lambda.name,
        subtitle: lambda.description || lambda.runtime,
        category: 'Lambdas',
        icon: <Code size={18} weight="duotone" />,
        action: () => onNavigate('lambdas', lambda.id),
        tags: ['serverless', 'function', lambda.runtime, lambda.name.toLowerCase()],
      })
    })

    playwrightTests.forEach((test) => {
      results.push({
        id: `playwright-${test.id}`,
        title: test.name,
        subtitle: test.description,
        category: 'Playwright Tests',
        icon: <Play size={18} weight="duotone" />,
        action: () => onNavigate('playwright', test.id),
        tags: ['testing', 'e2e', test.name.toLowerCase()],
      })
    })

    storybookStories.forEach((story) => {
      results.push({
        id: `storybook-${story.id}`,
        title: story.storyName,
        subtitle: story.componentName,
        category: 'Storybook Stories',
        icon: <BookOpen size={18} weight="duotone" />,
        action: () => onNavigate('storybook', story.id),
        tags: ['documentation', 'story', story.componentName.toLowerCase()],
      })
    })

    unitTests.forEach((test) => {
      results.push({
        id: `unit-test-${test.id}`,
        title: test.name,
        subtitle: test.description,
        category: 'Unit Tests',
        icon: <Cube size={18} weight="duotone" />,
        action: () => onNavigate('unit-tests', test.id),
        tags: ['testing', 'unit', test.name.toLowerCase()],
      })
    })

    return results
  }, [
    files,
    models,
    components,
    componentTrees,
    workflows,
    lambdas,
    playwrightTests,
    storybookStories,
    unitTests,
    onNavigate,
    onFileSelect,
  ])

  const filteredResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return allResults.slice(0, 50)
    }

    const query = searchQuery.toLowerCase().trim()
    const queryWords = query.split(/\s+/)

    return allResults
      .map((result) => {
        let score = 0
        const titleLower = result.title.toLowerCase()
        const subtitleLower = result.subtitle?.toLowerCase() || ''
        const categoryLower = result.category.toLowerCase()
        const tagsLower = result.tags?.map(t => t.toLowerCase()) || []

        if (titleLower === query) score += 100
        else if (titleLower.startsWith(query)) score += 50
        else if (titleLower.includes(query)) score += 30

        if (subtitleLower.includes(query)) score += 20
        if (categoryLower.includes(query)) score += 15

        tagsLower.forEach(tag => {
          if (tag === query) score += 40
          else if (tag.includes(query)) score += 10
        })

        queryWords.forEach(word => {
          if (titleLower.includes(word)) score += 5
          if (subtitleLower.includes(word)) score += 3
          if (tagsLower.some(tag => tag.includes(word))) score += 2
        })

        return { result, score }
      })
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 50)
      .map(({ result }) => result)
  }, [allResults, searchQuery])

  const groupedResults = useMemo(() => {
    const groups: Record<string, SearchResult[]> = {}
    filteredResults.forEach((result) => {
      if (!groups[result.category]) {
        groups[result.category] = []
      }
      groups[result.category].push(result)
    })
    return groups
  }, [filteredResults])

  const handleSelect = (result: SearchResult) => {
    result.action()
    onOpenChange(false)
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput 
        placeholder="Search features, files, models, components..." 
        value={searchQuery}
        onValueChange={setSearchQuery}
      />
      <CommandList>
        <CommandEmpty>
          <div className="flex flex-col items-center gap-2 py-6">
            <MagnifyingGlass size={48} weight="duotone" className="text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No results found</p>
          </div>
        </CommandEmpty>
        {Object.entries(groupedResults).map(([category, results], index) => (
          <div key={category}>
            {index > 0 && <CommandSeparator />}
            <CommandGroup heading={category}>
              {results.map((result) => (
                <CommandItem
                  key={result.id}
                  value={result.id}
                  onSelect={() => handleSelect(result)}
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer"
                >
                  <div className="flex-shrink-0 text-muted-foreground">
                    {result.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{result.title}</div>
                    {result.subtitle && (
                      <div className="text-xs text-muted-foreground truncate">
                        {result.subtitle}
                      </div>
                    )}
                  </div>
                  <Badge variant="outline" className="flex-shrink-0 text-xs">
                    {category}
                  </Badge>
                </CommandItem>
              ))}
            </CommandGroup>
          </div>
        ))}
      </CommandList>
    </CommandDialog>
  )
}
