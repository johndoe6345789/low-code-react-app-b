import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { useAutoRepair } from '@/hooks/use-auto-repair'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Code, Database, Tree, PaintBrush, Download, Sparkle, Flask, BookOpen, Play, Wrench, Gear, Cube, FileText, ChartBar, Keyboard, FlowArrow, Faders, DeviceMobile, Image, MagnifyingGlass, CloudArrowUp } from '@phosphor-icons/react'
import { ProjectFile, PrismaModel, ComponentNode, ComponentTree, ThemeConfig, PlaywrightTest, StorybookStory, UnitTest, FlaskConfig, NextJsConfig, NpmSettings, Workflow, Lambda, FeatureToggles, Project } from '@/types/project'
import { CodeEditor } from '@/components/CodeEditor'
import { ModelDesigner } from '@/components/ModelDesigner'
import { ComponentTreeBuilder } from '@/components/ComponentTreeBuilder'
import { ComponentTreeManager } from '@/components/ComponentTreeManager'
import { WorkflowDesigner } from '@/components/WorkflowDesigner'
import { LambdaDesigner } from '@/components/LambdaDesigner'
import { StyleDesigner } from '@/components/StyleDesigner'
import { FileExplorer } from '@/components/FileExplorer'
import { PlaywrightDesigner } from '@/components/PlaywrightDesigner'
import { StorybookDesigner } from '@/components/StorybookDesigner'
import { UnitTestDesigner } from '@/components/UnitTestDesigner'
import { FlaskDesigner } from '@/components/FlaskDesigner'
import { ProjectSettingsDesigner } from '@/components/ProjectSettingsDesigner'
import { ErrorPanel } from '@/components/ErrorPanel'
import { DocumentationView } from '@/components/DocumentationView'
import { SassStylesShowcase } from '@/components/SassStylesShowcase'
import { ProjectDashboard } from '@/components/ProjectDashboard'
import { KeyboardShortcutsDialog } from '@/components/KeyboardShortcutsDialog'
import { FeatureToggleSettings } from '@/components/FeatureToggleSettings'
import { ProjectManager } from '@/components/ProjectManager'
import { PWAInstallPrompt } from '@/components/PWAInstallPrompt'
import { PWAUpdatePrompt } from '@/components/PWAUpdatePrompt'
import { PWAStatusBar } from '@/components/PWAStatusBar'
import { PWASettings } from '@/components/PWASettings'
import { FaviconDesigner } from '@/components/FaviconDesigner'
import { FeatureIdeaCloud } from '@/components/FeatureIdeaCloud'
import { GlobalSearch } from '@/components/GlobalSearch'
import { NavigationMenu } from '@/components/NavigationMenu'
import { PageHeader } from '@/components/PageHeader'
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts'
import { generateNextJSProject, generatePrismaSchema, generateMUITheme, generatePlaywrightTests, generateStorybookStories, generateUnitTests, generateFlaskApp } from '@/lib/generators'
import { AIService } from '@/lib/ai-service'
import { toast } from 'sonner'
import JSZip from 'jszip'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'

const DEFAULT_FLASK_CONFIG: FlaskConfig = {
  blueprints: [],
  corsOrigins: ['http://localhost:3000'],
  enableSwagger: true,
  port: 5000,
  debug: true,
}

const DEFAULT_NEXTJS_CONFIG: NextJsConfig = {
  appName: 'my-nextjs-app',
  typescript: true,
  eslint: true,
  tailwind: true,
  srcDirectory: true,
  appRouter: true,
  importAlias: '@/*',
  turbopack: false,
}

const DEFAULT_NPM_SETTINGS: NpmSettings = {
  packages: [
    { id: '1', name: 'react', version: '^18.2.0', isDev: false },
    { id: '2', name: 'react-dom', version: '^18.2.0', isDev: false },
    { id: '3', name: 'next', version: '^14.0.0', isDev: false },
    { id: '4', name: '@mui/material', version: '^5.14.0', isDev: false },
    { id: '5', name: 'typescript', version: '^5.0.0', isDev: true },
    { id: '6', name: '@types/react', version: '^18.2.0', isDev: true },
  ],
  scripts: {
    dev: 'next dev',
    build: 'next build',
    start: 'next start',
    lint: 'next lint',
  },
  packageManager: 'npm',
}

const DEFAULT_FEATURE_TOGGLES: FeatureToggles = {
  codeEditor: true,
  models: true,
  components: true,
  componentTrees: true,
  workflows: true,
  lambdas: true,
  styling: true,
  flaskApi: true,
  playwright: true,
  storybook: true,
  unitTests: true,
  errorRepair: true,
  documentation: true,
  sassStyles: true,
  faviconDesigner: true,
  ideaCloud: true,
}

const DEFAULT_THEME: ThemeConfig = {
  variants: [
    {
      id: 'light',
      name: 'Light',
      colors: {
        primaryColor: '#1976d2',
        secondaryColor: '#dc004e',
        errorColor: '#f44336',
        warningColor: '#ff9800',
        successColor: '#4caf50',
        background: '#ffffff',
        surface: '#f5f5f5',
        text: '#000000',
        textSecondary: '#666666',
        border: '#e0e0e0',
        customColors: {},
      },
    },
    {
      id: 'dark',
      name: 'Dark',
      colors: {
        primaryColor: '#90caf9',
        secondaryColor: '#f48fb1',
        errorColor: '#f44336',
        warningColor: '#ffa726',
        successColor: '#66bb6a',
        background: '#121212',
        surface: '#1e1e1e',
        text: '#ffffff',
        textSecondary: '#b0b0b0',
        border: '#333333',
        customColors: {},
      },
    },
  ],
  activeVariantId: 'light',
  fontFamily: 'Roboto, Arial, sans-serif',
  fontSize: { small: 12, medium: 14, large: 20 },
  spacing: 8,
  borderRadius: 4,
}

const DEFAULT_FILES: ProjectFile[] = [
  {
    id: 'file-1',
    name: 'page.tsx',
    path: '/src/app/page.tsx',
    content: `'use client'\n\nimport { ThemeProvider } from '@mui/material/styles'\nimport CssBaseline from '@mui/material/CssBaseline'\nimport { theme } from '@/theme'\nimport { Box, Typography, Button } from '@mui/material'\n\nexport default function Home() {\n  return (\n    <ThemeProvider theme={theme}>\n      <CssBaseline />\n      <Box sx={{ p: 4 }}>\n        <Typography variant="h3" gutterBottom>\n          Welcome to Your App\n        </Typography>\n        <Button variant="contained" color="primary">\n          Get Started\n        </Button>\n      </Box>\n    </ThemeProvider>\n  )\n}`,
    language: 'typescript',
  },
  {
    id: 'file-2',
    name: 'layout.tsx',
    path: '/src/app/layout.tsx',
    content: `export const metadata = {\n  title: 'My Next.js App',\n  description: 'Generated with CodeForge',\n}\n\nexport default function RootLayout({\n  children,\n}: {\n  children: React.ReactNode\n}) {\n  return (\n    <html lang="en">\n      <body>{children}</body>\n    </html>\n  )\n}`,
    language: 'typescript',
  },
]

function App() {
  const [files, setFiles] = useKV<ProjectFile[]>('project-files', DEFAULT_FILES)
  const [models, setModels] = useKV<PrismaModel[]>('project-models', [])
  const [components, setComponents] = useKV<ComponentNode[]>('project-components', [])
  const [componentTrees, setComponentTrees] = useKV<ComponentTree[]>('project-component-trees', [
    {
      id: 'default-tree',
      name: 'Main App',
      description: 'Default component tree',
      rootNodes: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
  ])
  const [workflows, setWorkflows] = useKV<Workflow[]>('project-workflows', [])
  const [lambdas, setLambdas] = useKV<Lambda[]>('project-lambdas', [])
  const [theme, setTheme] = useKV<ThemeConfig>('project-theme', DEFAULT_THEME)
  const [playwrightTests, setPlaywrightTests] = useKV<PlaywrightTest[]>('project-playwright-tests', [])
  const [storybookStories, setStorybookStories] = useKV<StorybookStory[]>('project-storybook-stories', [])
  const [unitTests, setUnitTests] = useKV<UnitTest[]>('project-unit-tests', [])
  const [flaskConfig, setFlaskConfig] = useKV<FlaskConfig>('project-flask-config', DEFAULT_FLASK_CONFIG)
  const [nextjsConfig, setNextjsConfig] = useKV<NextJsConfig>('project-nextjs-config', DEFAULT_NEXTJS_CONFIG)
  const [npmSettings, setNpmSettings] = useKV<NpmSettings>('project-npm-settings', DEFAULT_NPM_SETTINGS)
  const [featureToggles, setFeatureToggles] = useKV<FeatureToggles>('project-feature-toggles', DEFAULT_FEATURE_TOGGLES)
  const [activeFileId, setActiveFileId] = useState<string | null>((files || [])[0]?.id || null)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [exportDialogOpen, setExportDialogOpen] = useState(false)
  const [shortcutsDialogOpen, setShortcutsDialogOpen] = useState(false)
  const [searchDialogOpen, setSearchDialogOpen] = useState(false)
  const [generatedCode, setGeneratedCode] = useState<Record<string, string>>({})

  const safeFiles = files || []
  const safeModels = models || []
  const safeComponents = components || []
  const safeComponentTrees = componentTrees || []
  const safeWorkflows = workflows || []
  const safeLambdas = lambdas || []
  const safeTheme = (theme && theme.variants && theme.variants.length > 0) ? theme : DEFAULT_THEME
  const safePlaywrightTests = playwrightTests || []
  const safeStorybookStories = storybookStories || []
  const safeUnitTests = unitTests || []
  const safeFlaskConfig = flaskConfig || DEFAULT_FLASK_CONFIG
  const safeNextjsConfig = nextjsConfig || DEFAULT_NEXTJS_CONFIG
  const safeNpmSettings = npmSettings || DEFAULT_NPM_SETTINGS
  const safeFeatureToggles = featureToggles || DEFAULT_FEATURE_TOGGLES

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const shortcut = params.get('shortcut')
    if (shortcut) {
      setActiveTab(shortcut)
    }
  }, [])

  useEffect(() => {
    if (!theme || !theme.variants || theme.variants.length === 0) {
      setTheme(DEFAULT_THEME)
    }
  }, [theme, setTheme])

  useEffect(() => {
    if (!featureToggles) {
      setFeatureToggles(DEFAULT_FEATURE_TOGGLES)
    }
  }, [featureToggles, setFeatureToggles])

  const { errors: autoDetectedErrors } = useAutoRepair(safeFiles, false)

  useKeyboardShortcuts([
    {
      key: '1',
      ctrl: true,
      description: 'Go to Dashboard',
      action: () => setActiveTab('dashboard'),
    },
    ...(safeFeatureToggles.codeEditor ? [{
      key: '2',
      ctrl: true,
      description: 'Go to Code Editor',
      action: () => setActiveTab('code'),
    }] : []),
    ...(safeFeatureToggles.models ? [{
      key: '3',
      ctrl: true,
      description: 'Go to Models',
      action: () => setActiveTab('models'),
    }] : []),
    ...(safeFeatureToggles.components ? [{
      key: '4',
      ctrl: true,
      description: 'Go to Components',
      action: () => setActiveTab('components'),
    }] : []),
    ...(safeFeatureToggles.componentTrees ? [{
      key: '5',
      ctrl: true,
      description: 'Go to Component Trees',
      action: () => setActiveTab('component-trees'),
    }] : []),
    ...(safeFeatureToggles.workflows ? [{
      key: '6',
      ctrl: true,
      description: 'Go to Workflows',
      action: () => setActiveTab('workflows'),
    }] : []),
    ...(safeFeatureToggles.lambdas ? [{
      key: '7',
      ctrl: true,
      description: 'Go to Lambdas',
      action: () => setActiveTab('lambdas'),
    }] : []),
    ...(safeFeatureToggles.styling ? [{
      key: '8',
      ctrl: true,
      description: 'Go to Styling',
      action: () => setActiveTab('styling'),
    }] : []),
    ...(safeFeatureToggles.faviconDesigner ? [{
      key: '9',
      ctrl: true,
      description: 'Go to Favicon Designer',
      action: () => setActiveTab('favicon'),
    }] : []),
    {
      key: 'k',
      ctrl: true,
      description: 'Search everything',
      action: () => setSearchDialogOpen(true),
    },
    {
      key: 'e',
      ctrl: true,
      description: 'Export Project',
      action: () => handleExportProject(),
    },
    {
      key: 'g',
      ctrl: true,
      shift: true,
      description: 'AI Generate',
      action: () => handleGenerateWithAI(),
    },
    {
      key: '/',
      ctrl: true,
      description: 'Show Keyboard Shortcuts',
      action: () => setShortcutsDialogOpen(true),
    },
  ])

  const handleFileChange = (fileId: string, content: string) => {
    setFiles((currentFiles) =>
      (currentFiles || []).map((f) => (f.id === fileId ? { ...f, content } : f))
    )
  }

  const handleFileAdd = (file: ProjectFile) => {
    setFiles((currentFiles) => [...(currentFiles || []), file])
    setActiveFileId(file.id)
  }

  const handleFileClose = (fileId: string) => {
    if (activeFileId === fileId) {
      const currentIndex = safeFiles.findIndex((f) => f.id === fileId)
      const nextFile = safeFiles[currentIndex + 1] || safeFiles[currentIndex - 1]
      setActiveFileId(nextFile?.id || null)
    }
  }

  const handleExportProject = () => {
    const projectFiles = generateNextJSProject(safeNextjsConfig.appName, safeModels, safeComponents, safeTheme)
    
    const prismaSchema = generatePrismaSchema(safeModels)
    const themeCode = generateMUITheme(safeTheme)
    const playwrightTestCode = generatePlaywrightTests(safePlaywrightTests)
    const storybookFiles = generateStorybookStories(safeStorybookStories)
    const unitTestFiles = generateUnitTests(safeUnitTests)
    const flaskFiles = generateFlaskApp(safeFlaskConfig)
    
    const packageJson = {
      name: safeNextjsConfig.appName,
      version: '0.1.0',
      private: true,
      scripts: safeNpmSettings.scripts,
      dependencies: safeNpmSettings.packages
        .filter(pkg => !pkg.isDev)
        .reduce((acc, pkg) => {
          acc[pkg.name] = pkg.version
          return acc
        }, {} as Record<string, string>),
      devDependencies: safeNpmSettings.packages
        .filter(pkg => pkg.isDev)
        .reduce((acc, pkg) => {
          acc[pkg.name] = pkg.version
          return acc
        }, {} as Record<string, string>),
    }
    
    const allFiles: Record<string, string> = {
      ...projectFiles,
      'package.json': JSON.stringify(packageJson, null, 2),
      'prisma/schema.prisma': prismaSchema,
      'src/theme.ts': themeCode,
      'e2e/tests.spec.ts': playwrightTestCode,
      ...storybookFiles,
      ...unitTestFiles,
    }
    
    Object.entries(flaskFiles).forEach(([path, content]) => {
      allFiles[`backend/${path}`] = content
    })
    
    safeFiles.forEach(file => {
      allFiles[file.path] = file.content
    })

    setGeneratedCode(allFiles)
    setExportDialogOpen(true)
    toast.success('Project files generated!')
  }

  const handleDownloadZip = async () => {
    try {
      toast.info('Creating ZIP file...')
      
      const zip = new JSZip()
      
      Object.entries(generatedCode).forEach(([path, content]) => {
        const cleanPath = path.startsWith('/') ? path.slice(1) : path
        zip.file(cleanPath, content)
      })
      
      zip.file('README.md', `# ${safeNextjsConfig.appName}

Generated with CodeForge

## Getting Started

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Set up Prisma (if using database):
\`\`\`bash
npx prisma generate
npx prisma db push
\`\`\`

3. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Testing

Run E2E tests:
\`\`\`bash
npm run test:e2e
\`\`\`

Run unit tests:
\`\`\`bash
npm run test
\`\`\`

## Flask Backend (Optional)

Navigate to the backend directory and follow the setup instructions.
`)
      
      const blob = await zip.generateAsync({ type: 'blob' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${safeNextjsConfig.appName}.zip`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      toast.success('Project downloaded successfully!')
    } catch (error) {
      console.error('Failed to create ZIP:', error)
      toast.error('Failed to create ZIP file')
    }
  }

  const handleGenerateWithAI = async () => {
    const description = prompt('Describe the application you want to generate:')
    if (!description) return

    try {
      toast.info('Generating application with AI...')
      
      const result = await AIService.generateCompleteApp(description)
      
      if (result) {
        if (result.files && result.files.length > 0) {
          setFiles((currentFiles) => [...(currentFiles || []), ...result.files])
        }
        if (result.models && result.models.length > 0) {
          setModels((currentModels) => [...(currentModels || []), ...result.models])
        }
        if (result.theme) {
          setTheme((currentTheme) => ({ ...(currentTheme || DEFAULT_THEME), ...result.theme }))
        }
        toast.success('Application generated successfully!')
      } else {
        toast.error('AI generation failed. Please try again.')
      }
    } catch (error) {
      toast.error('AI generation failed')
      console.error(error)
    }
  }

  const handleLoadProject = (project: Project) => {
    if (project.files) setFiles(project.files)
    if (project.models) setModels(project.models)
    if (project.components) setComponents(project.components)
    if (project.componentTrees) setComponentTrees(project.componentTrees)
    if (project.workflows) setWorkflows(project.workflows)
    if (project.lambdas) setLambdas(project.lambdas)
    if (project.theme) setTheme(project.theme)
    if (project.playwrightTests) setPlaywrightTests(project.playwrightTests)
    if (project.storybookStories) setStorybookStories(project.storybookStories)
    if (project.unitTests) setUnitTests(project.unitTests)
    if (project.flaskConfig) setFlaskConfig(project.flaskConfig)
    if (project.nextjsConfig) setNextjsConfig(project.nextjsConfig)
    if (project.npmSettings) setNpmSettings(project.npmSettings)
    if (project.featureToggles) setFeatureToggles(project.featureToggles)
  }

  const getCurrentProject = (): Project => {
    return {
      name: safeNextjsConfig.appName,
      files: safeFiles,
      models: safeModels,
      components: safeComponents,
      componentTrees: safeComponentTrees,
      workflows: safeWorkflows,
      lambdas: safeLambdas,
      theme: safeTheme,
      playwrightTests: safePlaywrightTests,
      storybookStories: safeStorybookStories,
      unitTests: safeUnitTests,
      flaskConfig: safeFlaskConfig,
      nextjsConfig: safeNextjsConfig,
      npmSettings: safeNpmSettings,
      featureToggles: safeFeatureToggles,
    }
  }

  return (
    <div className="h-screen flex flex-col bg-background text-foreground">
      <PWAStatusBar />
      <PWAUpdatePrompt />
      
      <header className="border-b border-border bg-card px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <NavigationMenu
              activeTab={activeTab}
              onTabChange={setActiveTab}
              featureToggles={safeFeatureToggles}
              errorCount={autoDetectedErrors.length}
            />
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
              <Code size={20} weight="duotone" className="text-white sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-xl font-bold truncate">CodeForge</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Low-Code Next.js App Builder
              </p>
            </div>
          </div>
          <div className="flex gap-1 sm:gap-2 shrink-0">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setSearchDialogOpen(true)}
                  className="shrink-0"
                >
                  <MagnifyingGlass size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Search (Ctrl+K)</TooltipContent>
            </Tooltip>
            <ProjectManager
              currentProject={getCurrentProject()}
              onProjectLoad={handleLoadProject}
            />
            {safeFeatureToggles.errorRepair && autoDetectedErrors.length > 0 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setActiveTab('errors')}
                    className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground shrink-0 relative"
                  >
                    <Wrench size={18} />
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px]"
                    >
                      {autoDetectedErrors.length}
                    </Badge>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {autoDetectedErrors.length} {autoDetectedErrors.length === 1 ? 'Error' : 'Errors'}
                </TooltipContent>
              </Tooltip>
            )}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setShortcutsDialogOpen(true)}
                  className="hidden sm:flex shrink-0"
                >
                  <Keyboard size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Keyboard Shortcuts (Ctrl+/)</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline"
                  size="icon"
                  onClick={handleGenerateWithAI}
                  className="shrink-0"
                >
                  <Sparkle size={18} weight="duotone" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>AI Generate (Ctrl+Shift+G)</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  size="icon"
                  onClick={handleExportProject}
                  className="shrink-0"
                >
                  <Download size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Export Project (Ctrl+E)</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <PageHeader activeTab={activeTab} />
        
        <div className="flex-1 overflow-hidden">
          <TabsContent value="dashboard" className="h-full m-0">
            <ProjectDashboard
              files={safeFiles}
              models={safeModels}
              components={safeComponents}
              theme={safeTheme}
              playwrightTests={safePlaywrightTests}
              storybookStories={safeStorybookStories}
              unitTests={safeUnitTests}
              flaskConfig={safeFlaskConfig}
            />
          </TabsContent>

          {safeFeatureToggles.codeEditor && (
            <TabsContent value="code" className="h-full m-0">
              <ResizablePanelGroup direction="horizontal">
                <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
                  <FileExplorer
                    files={safeFiles}
                    activeFileId={activeFileId}
                    onFileSelect={setActiveFileId}
                    onFileAdd={handleFileAdd}
                  />
                </ResizablePanel>
                <ResizableHandle />
                <ResizablePanel defaultSize={80}>
                  <CodeEditor
                    files={safeFiles}
                    activeFileId={activeFileId}
                    onFileChange={handleFileChange}
                    onFileSelect={setActiveFileId}
                    onFileClose={handleFileClose}
                  />
                </ResizablePanel>
              </ResizablePanelGroup>
            </TabsContent>
          )}

          {safeFeatureToggles.models && (
            <TabsContent value="models" className="h-full m-0">
              <ModelDesigner models={safeModels} onModelsChange={setModels} />
            </TabsContent>
          )}

          {safeFeatureToggles.components && (
            <TabsContent value="components" className="h-full m-0">
              <ComponentTreeBuilder
                components={safeComponents}
                onComponentsChange={setComponents}
              />
            </TabsContent>
          )}

          {safeFeatureToggles.componentTrees && (
            <TabsContent value="component-trees" className="h-full m-0">
              <ComponentTreeManager
                trees={safeComponentTrees}
                onTreesChange={setComponentTrees}
              />
            </TabsContent>
          )}

          {safeFeatureToggles.workflows && (
            <TabsContent value="workflows" className="h-full m-0">
              <WorkflowDesigner
                workflows={safeWorkflows}
                onWorkflowsChange={setWorkflows}
              />
            </TabsContent>
          )}

          {safeFeatureToggles.lambdas && (
            <TabsContent value="lambdas" className="h-full m-0">
              <LambdaDesigner
                lambdas={safeLambdas}
                onLambdasChange={setLambdas}
              />
            </TabsContent>
          )}

          {safeFeatureToggles.styling && (
            <TabsContent value="styling" className="h-full m-0">
              <StyleDesigner theme={safeTheme} onThemeChange={setTheme} />
            </TabsContent>
          )}

          {safeFeatureToggles.flaskApi && (
            <TabsContent value="flask" className="h-full m-0">
              <FlaskDesigner config={safeFlaskConfig} onConfigChange={setFlaskConfig} />
            </TabsContent>
          )}

          <TabsContent value="settings" className="h-full m-0">
            <ProjectSettingsDesigner
              nextjsConfig={safeNextjsConfig}
              npmSettings={safeNpmSettings}
              onNextjsConfigChange={setNextjsConfig}
              onNpmSettingsChange={setNpmSettings}
            />
          </TabsContent>

          <TabsContent value="pwa" className="h-full m-0">
            <PWASettings />
          </TabsContent>

          <TabsContent value="features" className="h-full m-0">
            <FeatureToggleSettings
              features={safeFeatureToggles}
              onFeaturesChange={setFeatureToggles}
            />
          </TabsContent>

          {safeFeatureToggles.playwright && (
            <TabsContent value="playwright" className="h-full m-0">
              <PlaywrightDesigner tests={safePlaywrightTests} onTestsChange={setPlaywrightTests} />
            </TabsContent>
          )}

          {safeFeatureToggles.storybook && (
            <TabsContent value="storybook" className="h-full m-0">
              <StorybookDesigner stories={safeStorybookStories} onStoriesChange={setStorybookStories} />
            </TabsContent>
          )}

          {safeFeatureToggles.unitTests && (
            <TabsContent value="unit-tests" className="h-full m-0">
              <UnitTestDesigner tests={safeUnitTests} onTestsChange={setUnitTests} />
            </TabsContent>
          )}

          {safeFeatureToggles.errorRepair && (
            <TabsContent value="errors" className="h-full m-0">
              <ErrorPanel
                files={safeFiles}
                onFileChange={handleFileChange}
                onFileSelect={setActiveFileId}
              />
            </TabsContent>
          )}

          {safeFeatureToggles.documentation && (
            <TabsContent value="docs" className="h-full m-0">
              <DocumentationView />
            </TabsContent>
          )}

          {safeFeatureToggles.sassStyles && (
            <TabsContent value="sass" className="h-full m-0">
              <SassStylesShowcase />
            </TabsContent>
          )}

          {safeFeatureToggles.faviconDesigner && (
            <TabsContent value="favicon" className="h-full m-0">
              <FaviconDesigner />
            </TabsContent>
          )}

          {safeFeatureToggles.ideaCloud && (
            <TabsContent value="ideas" className="h-full m-0">
              <FeatureIdeaCloud />
            </TabsContent>
          )}
        </div>
      </Tabs>

      <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Generated Project Files</DialogTitle>
            <DialogDescription>
              Download as ZIP or copy individual files to create your Next.js application
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 mb-4">
            <Button onClick={handleDownloadZip} className="flex-1">
              <Download size={16} className="mr-2" />
              Download as ZIP
            </Button>
            <Button 
              variant="outline"
              onClick={() => {
                const allCode = Object.entries(generatedCode)
                  .map(([path, content]) => `// ${path}\n${content}`)
                  .join('\n\n---\n\n')
                navigator.clipboard.writeText(allCode)
                toast.success('All files copied to clipboard!')
              }}
            >
              Copy All
            </Button>
          </div>
          <ScrollArea className="h-96">
            <div className="space-y-4">
              {Object.entries(generatedCode).map(([path, content]) => (
                <Card key={path} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <code className="text-sm font-semibold text-accent">
                      {path}
                    </code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(content)
                        toast.success(`Copied ${path}`)
                      }}
                    >
                      Copy
                    </Button>
                  </div>
                  <Textarea
                    value={content}
                    readOnly
                    className="font-mono text-xs h-48"
                  />
                </Card>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <KeyboardShortcutsDialog
        open={shortcutsDialogOpen}
        onOpenChange={setShortcutsDialogOpen}
      />

      <GlobalSearch
        open={searchDialogOpen}
        onOpenChange={setSearchDialogOpen}
        files={safeFiles}
        models={safeModels}
        components={safeComponents}
        componentTrees={safeComponentTrees}
        workflows={safeWorkflows}
        lambdas={safeLambdas}
        playwrightTests={safePlaywrightTests}
        storybookStories={safeStorybookStories}
        unitTests={safeUnitTests}
        onNavigate={(tab, itemId) => {
          setActiveTab(tab)
        }}
        onFileSelect={setActiveFileId}
      />

      <PWAInstallPrompt />
    </div>
  )
}

export default App