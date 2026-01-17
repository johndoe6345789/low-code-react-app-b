import { useState, lazy, Suspense, useMemo, useEffect } from 'react'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { AppHeader, PageHeader } from '@/components/organisms'
import { LoadingFallback } from '@/components/molecules'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { useProjectState } from '@/hooks/use-project-state'
import { useFileOperations } from '@/hooks/use-file-operations'
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts'
import { useSeedData } from '@/hooks/data/use-seed-data'
import { getPageConfig, getEnabledPages, getPageShortcuts, resolveProps } from '@/config/page-loader'
import { toast } from 'sonner'

const componentMap: Record<string, React.LazyExoticComponent<any>> = {
  ProjectDashboard: lazy(() => import('@/components/ProjectDashboard').then(m => ({ default: m.ProjectDashboard }))),
  CodeEditor: lazy(() => import('@/components/CodeEditor').then(m => ({ default: m.CodeEditor }))),
  FileExplorer: lazy(() => import('@/components/FileExplorer').then(m => ({ default: m.FileExplorer }))),
  ModelDesigner: lazy(() => import('@/components/ModelDesigner').then(m => ({ default: m.ModelDesigner }))),
  ComponentTreeBuilder: lazy(() => import('@/components/ComponentTreeBuilder').then(m => ({ default: m.ComponentTreeBuilder }))),
  ComponentTreeManager: lazy(() => import('@/components/ComponentTreeManager').then(m => ({ default: m.ComponentTreeManager }))),
  WorkflowDesigner: lazy(() => import('@/components/WorkflowDesigner').then(m => ({ default: m.WorkflowDesigner }))),
  LambdaDesigner: lazy(() => import('@/components/LambdaDesigner').then(m => ({ default: m.LambdaDesigner }))),
  StyleDesigner: lazy(() => import('@/components/StyleDesigner').then(m => ({ default: m.StyleDesigner }))),
  PlaywrightDesigner: lazy(() => import('@/components/PlaywrightDesigner').then(m => ({ default: m.PlaywrightDesigner }))),
  StorybookDesigner: lazy(() => import('@/components/StorybookDesigner').then(m => ({ default: m.StorybookDesigner }))),
  UnitTestDesigner: lazy(() => import('@/components/UnitTestDesigner').then(m => ({ default: m.UnitTestDesigner }))),
  FlaskDesigner: lazy(() => import('@/components/FlaskDesigner').then(m => ({ default: m.FlaskDesigner }))),
  ProjectSettingsDesigner: lazy(() => import('@/components/ProjectSettingsDesigner').then(m => ({ default: m.ProjectSettingsDesigner }))),
  ErrorPanel: lazy(() => import('@/components/ErrorPanel').then(m => ({ default: m.ErrorPanel }))),
  DocumentationView: lazy(() => import('@/components/DocumentationView').then(m => ({ default: m.DocumentationView }))),
  SassStylesShowcase: lazy(() => import('@/components/SassStylesShowcase').then(m => ({ default: m.SassStylesShowcase }))),
  FeatureToggleSettings: lazy(() => import('@/components/FeatureToggleSettings').then(m => ({ default: m.FeatureToggleSettings }))),
  PWASettings: lazy(() => import('@/components/PWASettings').then(m => ({ default: m.PWASettings }))),
  FaviconDesigner: lazy(() => import('@/components/FaviconDesigner').then(m => ({ default: m.FaviconDesigner }))),
  FeatureIdeaCloud: lazy(() => import('@/components/FeatureIdeaCloud').then(m => ({ default: m.FeatureIdeaCloud }))),
  TemplateSelector: lazy(() => import('@/components/TemplateSelector').then(m => ({ default: m.TemplateSelector }))),
}

const GlobalSearch = lazy(() => import('@/components/GlobalSearch').then(m => ({ default: m.GlobalSearch })))
const KeyboardShortcutsDialog = lazy(() => import('@/components/KeyboardShortcutsDialog').then(m => ({ default: m.KeyboardShortcutsDialog })))
const PreviewDialog = lazy(() => import('@/components/PreviewDialog').then(m => ({ default: m.PreviewDialog })))
const PWAInstallPrompt = lazy(() => import('@/components/PWAInstallPrompt').then(m => ({ default: m.PWAInstallPrompt })))
const PWAUpdatePrompt = lazy(() => import('@/components/PWAUpdatePrompt').then(m => ({ default: m.PWAUpdatePrompt })))
const PWAStatusBar = lazy(() => import('@/components/PWAStatusBar').then(m => ({ default: m.PWAStatusBar })))

function App() {
  const projectState = useProjectState()
  const {
    files,
    models,
    components,
    componentTrees,
    workflows,
    lambdas,
    theme,
    playwrightTests,
    storybookStories,
    unitTests,
    flaskConfig,
    nextjsConfig,
    npmSettings,
    featureToggles,
    setFiles,
    setModels,
    setComponents,
    setComponentTrees,
    setWorkflows,
    setLambdas,
    setTheme,
    setPlaywrightTests,
    setStorybookStories,
    setUnitTests,
    setFlaskConfig,
    setNextjsConfig,
    setNpmSettings,
    setFeatureToggles,
  } = projectState

  const fileOps = useFileOperations(files, setFiles)
  const { activeFileId, setActiveFileId, handleFileChange, handleFileAdd, handleFileClose } = fileOps
  const { loadSeedData } = useSeedData()

  const [activeTab, setActiveTab] = useState('dashboard')
  const [searchOpen, setSearchOpen] = useState(false)
  const [shortcutsOpen, setShortcutsOpen] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [lastSaved] = useState<number | null>(Date.now())
  const [errorCount] = useState(0)
  const [appReady, setAppReady] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setAppReady(true)
    }, 100)
    
    loadSeedData()
      .catch(err => {
        console.error('Seed data loading failed:', err)
      })
      .finally(() => {
        clearTimeout(timer)
        setAppReady(true)
      })

    return () => clearTimeout(timer)
  }, [loadSeedData])

  const pageConfig = useMemo(() => getPageConfig(), [])
  const enabledPages = useMemo(() => getEnabledPages(featureToggles), [featureToggles])
  const shortcuts = useMemo(() => getPageShortcuts(featureToggles), [featureToggles])

  useKeyboardShortcuts([
    ...shortcuts.map(s => ({
      key: s.key,
      ctrl: s.ctrl,
      shift: s.shift,
      description: s.description,
      action: () => setActiveTab(s.action)
    })),
    { key: 'k', ctrl: true, description: 'Search', action: () => setSearchOpen(true) },
    { key: '/', ctrl: true, description: 'Shortcuts', action: () => setShortcutsOpen(true) },
    { key: 'p', ctrl: true, description: 'Preview', action: () => setPreviewOpen(true) },
  ])

  const getCurrentProject = () => ({
    name: nextjsConfig.appName,
    files,
    models,
    components,
    componentTrees,
    workflows,
    lambdas,
    theme,
    playwrightTests,
    storybookStories,
    unitTests,
    flaskConfig,
    nextjsConfig,
    npmSettings,
    featureToggles,
  })

  const handleProjectLoad = (project: any) => {
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
    toast.success('Project loaded')
  }

  const getPropsForComponent = (pageId: string) => {
    const page = enabledPages.find(p => p.id === pageId)
    if (!page || !page.props) return {}

    const stateContext = {
      files,
      models,
      components,
      componentTrees,
      workflows,
      lambdas,
      theme,
      playwrightTests,
      storybookStories,
      unitTests,
      flaskConfig,
      nextjsConfig,
      npmSettings,
      featureToggles,
      activeFileId,
    }

    const actionContext = {
      handleFileChange,
      setActiveFileId,
      handleFileClose,
      handleFileAdd,
      setModels,
      setComponents,
      setComponentTrees,
      setWorkflows,
      setLambdas,
      setTheme,
      setPlaywrightTests,
      setStorybookStories,
      setUnitTests,
      setFlaskConfig,
      setNextjsConfig,
      setNpmSettings,
      setFeatureToggles,
    }

    return resolveProps(page.props, stateContext, actionContext)
  }

  const renderPageContent = (page: any) => {
    try {
      const Component = componentMap[page.component]
      if (!Component) {
        return <LoadingFallback message={`Component ${page.component} not found`} />
      }

      if (page.requiresResizable && page.resizableConfig) {
        const config = page.resizableConfig
        const LeftComponent = componentMap[config.leftComponent]
        const RightComponent = Component

        if (!LeftComponent) {
          return <LoadingFallback message={`Component ${config.leftComponent} not found`} />
        }

        const stateContext = {
          files,
          models,
          components,
          componentTrees,
          workflows,
          lambdas,
          theme,
          playwrightTests,
          storybookStories,
          unitTests,
          flaskConfig,
          nextjsConfig,
          npmSettings,
          featureToggles,
          activeFileId,
        }

        const actionContext = {
          handleFileChange,
          setActiveFileId,
          handleFileClose,
          handleFileAdd,
          setModels,
          setComponents,
          setComponentTrees,
          setWorkflows,
          setLambdas,
          setTheme,
          setPlaywrightTests,
          setStorybookStories,
          setUnitTests,
          setFlaskConfig,
          setNextjsConfig,
          setNpmSettings,
          setFeatureToggles,
        }

        const leftProps = resolveProps(config.leftProps, stateContext, actionContext)
        const rightProps = getPropsForComponent(page.id)

        return (
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel 
              defaultSize={config.leftPanel.defaultSize} 
              minSize={config.leftPanel.minSize} 
              maxSize={config.leftPanel.maxSize}
            >
              <Suspense fallback={<LoadingFallback message={`Loading ${config.leftComponent.toLowerCase()}...`} />}>
                <LeftComponent {...leftProps} />
              </Suspense>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={config.rightPanel.defaultSize}>
              <Suspense fallback={<LoadingFallback message={`Loading ${page.title.toLowerCase()}...`} />}>
                <RightComponent {...rightProps} />
              </Suspense>
            </ResizablePanel>
          </ResizablePanelGroup>
        )
      }

      const props = getPropsForComponent(page.id)
      return (
        <Suspense fallback={<LoadingFallback message={`Loading ${page.title.toLowerCase()}...`} />}>
          <Component {...props} />
        </Suspense>
      )
    } catch (error) {
      console.error(`Failed to render page ${page.id}:`, error)
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <p className="text-destructive font-semibold">Failed to load {page.title}</p>
            <p className="text-sm text-muted-foreground mt-2">Check console for details</p>
          </div>
        </div>
      )
    }
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {!appReady && (
        <div className="fixed inset-0 bg-background z-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground">Loading CodeForge...</p>
          </div>
        </div>
      )}
      <Suspense fallback={<div className="h-1 bg-primary animate-pulse" />}>
        <PWAStatusBar />
      </Suspense>
      <Suspense fallback={null}>
        <PWAUpdatePrompt />
      </Suspense>
      <AppHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        featureToggles={featureToggles}
        errorCount={errorCount}
        lastSaved={lastSaved}
        currentProject={getCurrentProject()}
        onProjectLoad={handleProjectLoad}
        onSearch={() => setSearchOpen(true)}
        onShowShortcuts={() => setShortcutsOpen(true)}
        onGenerateAI={() => toast.info('AI generation coming soon')}
        onExport={() => toast.info('Export coming soon')}
        onPreview={() => setPreviewOpen(true)}
        onShowErrors={() => setActiveTab('errors')}
      />
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <PageHeader activeTab={activeTab} />
        <div className="flex-1 overflow-hidden">
          {enabledPages.map(page => (
            <TabsContent key={page.id} value={page.id} className="h-full m-0">
              {renderPageContent(page)}
            </TabsContent>
          ))}
        </div>
      </Tabs>

      <Suspense fallback={null}>
        <GlobalSearch
          open={searchOpen}
          onOpenChange={setSearchOpen}
          files={files}
          models={models}
          components={components}
          componentTrees={componentTrees}
          workflows={workflows}
          lambdas={lambdas}
          playwrightTests={playwrightTests}
          storybookStories={storybookStories}
          unitTests={unitTests}
          onNavigate={setActiveTab}
          onFileSelect={setActiveFileId}
        />
      </Suspense>

      <Suspense fallback={null}>
        <KeyboardShortcutsDialog open={shortcutsOpen} onOpenChange={setShortcutsOpen} />
      </Suspense>
      <Suspense fallback={null}>
        <PreviewDialog open={previewOpen} onOpenChange={setPreviewOpen} />
      </Suspense>
      <Suspense fallback={null}>
        <PWAInstallPrompt />
      </Suspense>
    </div>
  )
}

export default App
