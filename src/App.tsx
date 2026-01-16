import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { useAutoRepair } from '@/hooks/use-auto-repair'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { Code, Database, Tree, PaintBrush, Download, Sparkle, Flask, BookOpen, Play, Wrench } from '@phosphor-icons/react'
import { ProjectFile, PrismaModel, ComponentNode, ThemeConfig, PlaywrightTest, StorybookStory, UnitTest } from '@/types/project'
import { CodeEditor } from '@/components/CodeEditor'
import { ModelDesigner } from '@/components/ModelDesigner'
import { ComponentTreeBuilder } from '@/components/ComponentTreeBuilder'
import { StyleDesigner } from '@/components/StyleDesigner'
import { FileExplorer } from '@/components/FileExplorer'
import { PlaywrightDesigner } from '@/components/PlaywrightDesigner'
import { StorybookDesigner } from '@/components/StorybookDesigner'
import { UnitTestDesigner } from '@/components/UnitTestDesigner'
import { ErrorPanel } from '@/components/ErrorPanel'
import { generateNextJSProject, generatePrismaSchema, generateMUITheme, generatePlaywrightTests, generateStorybookStories, generateUnitTests } from '@/lib/generators'
import { AIService } from '@/lib/ai-service'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'

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
  const [theme, setTheme] = useKV<ThemeConfig>('project-theme', DEFAULT_THEME)
  const [playwrightTests, setPlaywrightTests] = useKV<PlaywrightTest[]>('project-playwright-tests', [])
  const [storybookStories, setStorybookStories] = useKV<StorybookStory[]>('project-storybook-stories', [])
  const [unitTests, setUnitTests] = useKV<UnitTest[]>('project-unit-tests', [])
  const [activeFileId, setActiveFileId] = useState<string | null>((files || [])[0]?.id || null)
  const [activeTab, setActiveTab] = useState('code')
  const [exportDialogOpen, setExportDialogOpen] = useState(false)
  const [generatedCode, setGeneratedCode] = useState<Record<string, string>>({})

  const safeFiles = files || []
  const safeModels = models || []
  const safeComponents = components || []
  const safeTheme = theme || DEFAULT_THEME
  const safePlaywrightTests = playwrightTests || []
  const safeStorybookStories = storybookStories || []
  const safeUnitTests = unitTests || []

  const { errors: autoDetectedErrors } = useAutoRepair(safeFiles, false)

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
    const projectFiles = generateNextJSProject('my-nextjs-app', safeModels, safeComponents, safeTheme)
    
    const prismaSchema = generatePrismaSchema(safeModels)
    const themeCode = generateMUITheme(safeTheme)
    const playwrightTestCode = generatePlaywrightTests(safePlaywrightTests)
    const storybookFiles = generateStorybookStories(safeStorybookStories)
    const unitTestFiles = generateUnitTests(safeUnitTests)
    
    const allFiles = {
      ...projectFiles,
      'prisma/schema.prisma': prismaSchema,
      'src/theme.ts': themeCode,
      'e2e/tests.spec.ts': playwrightTestCode,
      ...storybookFiles,
      ...unitTestFiles,
      ...safeFiles.reduce((acc, file) => {
        acc[file.path] = file.content
        return acc
      }, {} as Record<string, string>),
    }

    setGeneratedCode(allFiles)
    setExportDialogOpen(true)
    toast.success('Project files generated!')
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

  return (
    <div className="h-screen flex flex-col bg-background text-foreground">
      <header className="border-b border-border bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Code size={24} weight="duotone" className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">CodeForge</h1>
              <p className="text-xs text-muted-foreground">
                Low-Code Next.js App Builder
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {autoDetectedErrors.length > 0 && (
              <Button 
                variant="outline" 
                onClick={() => setActiveTab('errors')}
                className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                <Wrench size={16} className="mr-2" />
                {autoDetectedErrors.length} {autoDetectedErrors.length === 1 ? 'Error' : 'Errors'}
              </Button>
            )}
            <Button variant="outline" onClick={handleGenerateWithAI}>
              <Sparkle size={16} className="mr-2" weight="duotone" />
              AI Generate
            </Button>
            <Button onClick={handleExportProject}>
              <Download size={16} className="mr-2" />
              Export Project
            </Button>
          </div>
        </div>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="border-b border-border bg-card px-6">
          <TabsList className="h-12 bg-transparent">
            <TabsTrigger value="code" className="gap-2">
              <Code size={18} />
              Code Editor
            </TabsTrigger>
            <TabsTrigger value="models" className="gap-2">
              <Database size={18} />
              Models
            </TabsTrigger>
            <TabsTrigger value="components" className="gap-2">
              <Tree size={18} />
              Components
            </TabsTrigger>
            <TabsTrigger value="styling" className="gap-2">
              <PaintBrush size={18} />
              Styling
            </TabsTrigger>
            <TabsTrigger value="playwright" className="gap-2">
              <Play size={18} />
              Playwright
            </TabsTrigger>
            <TabsTrigger value="storybook" className="gap-2">
              <BookOpen size={18} />
              Storybook
            </TabsTrigger>
            <TabsTrigger value="unit-tests" className="gap-2">
              <Flask size={18} />
              Unit Tests
            </TabsTrigger>
            <TabsTrigger value="errors" className="gap-2">
              <Wrench size={18} />
              Error Repair
              {autoDetectedErrors.length > 0 && (
                <Badge variant="destructive" className="ml-1">
                  {autoDetectedErrors.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-hidden">
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

          <TabsContent value="models" className="h-full m-0">
            <ModelDesigner models={safeModels} onModelsChange={setModels} />
          </TabsContent>

          <TabsContent value="components" className="h-full m-0">
            <ComponentTreeBuilder
              components={safeComponents}
              onComponentsChange={setComponents}
            />
          </TabsContent>

          <TabsContent value="styling" className="h-full m-0">
            <StyleDesigner theme={safeTheme} onThemeChange={setTheme} />
          </TabsContent>

          <TabsContent value="playwright" className="h-full m-0">
            <PlaywrightDesigner tests={safePlaywrightTests} onTestsChange={setPlaywrightTests} />
          </TabsContent>

          <TabsContent value="storybook" className="h-full m-0">
            <StorybookDesigner stories={safeStorybookStories} onStoriesChange={setStorybookStories} />
          </TabsContent>

          <TabsContent value="unit-tests" className="h-full m-0">
            <UnitTestDesigner tests={safeUnitTests} onTestsChange={setUnitTests} />
          </TabsContent>

          <TabsContent value="errors" className="h-full m-0">
            <ErrorPanel
              files={safeFiles}
              onFileChange={handleFileChange}
              onFileSelect={setActiveFileId}
            />
          </TabsContent>
        </div>
      </Tabs>

      <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Generated Project Files</DialogTitle>
            <DialogDescription>
              Copy these files to create your Next.js application
            </DialogDescription>
          </DialogHeader>
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
    </div>
  )
}

export default App