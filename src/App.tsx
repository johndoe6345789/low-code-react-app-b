console.log('[APP] 🚀 App.tsx loading - BEGIN')
console.time('[APP] Component initialization')

import { useState, lazy, Suspense, useMemo, useEffect } from 'react'
console.log('[APP] ✅ React hooks imported')

import { Tabs, TabsContent } from '@/components/ui/tabs'
console.log('[APP] ✅ Tabs imported')

import { AppHeader, PageHeader } from '@/components/organisms'
console.log('[APP] ✅ Header components imported')

import { LoadingFallback } from '@/components/molecules'
console.log('[APP] ✅ LoadingFallback imported')

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
console.log('[APP] ✅ Resizable components imported')

import { useProjectState } from '@/hooks/use-project-state'
import { useFileOperations } from '@/hooks/use-file-operations'
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts'
import { useSeedData } from '@/hooks/data/use-seed-data'
console.log('[APP] ✅ Custom hooks imported')

import { getPageConfig, getEnabledPages, getPageShortcuts, resolveProps } from '@/config/page-loader'
console.log('[APP] ✅ Page config imported')

import { toast } from 'sonner'
console.log('[APP] ✅ Toast imported')

console.log('[APP] 📦 Setting up lazy-loaded components')
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
console.log('[APP] ✅ Component map created with', Object.keys(componentMap).length, 'components')

const GlobalSearch = lazy(() => import('@/components/GlobalSearch').then(m => ({ default: m.GlobalSearch })))
const KeyboardShortcutsDialog = lazy(() => import('@/components/KeyboardShortcutsDialog').then(m => ({ default: m.KeyboardShortcutsDialog })))
const PreviewDialog = lazy(() => import('@/components/PreviewDialog').then(m => ({ default: m.PreviewDialog })))
const PWAInstallPrompt = lazy(() => import('@/components/PWAInstallPrompt').then(m => ({ default: m.PWAInstallPrompt })))
const PWAUpdatePrompt = lazy(() => import('@/components/PWAUpdatePrompt').then(m => ({ default: m.PWAUpdatePrompt })))
const PWAStatusBar = lazy(() => import('@/components/PWAStatusBar').then(m => ({ default: m.PWAStatusBar })))
console.log('[APP] ✅ Additional lazy components registered')

console.log('[APP] 🎯 App component function executing')

function App() {
  console.log('[APP] 🔧 Initializing App component')
  console.time('[APP] App render')
  
  console.log('[APP] 📊 Initializing project state hook')
  const projectState = useProjectState()
  console.log('[APP] ✅ Project state initialized')
  
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

  console.log('[APP] 📁 Initializing file operations')
  const fileOps = useFileOperations(files, setFiles)
  console.log('[APP] ✅ File operations initialized')
  
  const { activeFileId, setActiveFileId, handleFileChange, handleFileAdd, handleFileClose } = fileOps
  
  console.log('[APP] 🌱 Initializing seed data hook')
  const { loadSeedData } = useSeedData()
  console.log('[APP] ✅ Seed data hook initialized')

  console.log('[APP] 💾 Initializing state variables')
  const [activeTab, setActiveTab] = useState('dashboard')
  const [searchOpen, setSearchOpen] = useState(false)
  const [shortcutsOpen, setShortcutsOpen] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [lastSaved] = useState<number | null>(Date.now())
  const [errorCount] = useState(0)
  const [appReady, setAppReady] = useState(false)
  console.log('[APP] ✅ State variables initialized')

  console.log('[APP] ⏰ Setting up initialization effect')
  useEffect(() => {
    console.log('[APP] 🚀 Initialization effect triggered')
    console.time('[APP] Seed data loading')
    
    const timer = setTimeout(() => {
      console.log('[APP] ⏱️ Fallback timer triggered (100ms)')
      setAppReady(true)
    }, 100)
    
    console.log('[APP] 📥 Starting seed data load')
    loadSeedData()
      .then(() => {
        console.log('[APP] ✅ Seed data loaded successfully')
      })
      .catch(err => {
        console.error('[APP] ❌ Seed data loading failed:', err)
      })
      .finally(() => {
        console.log('[APP] 🏁 Seed data loading complete')
        clearTimeout(timer)
        setAppReady(true)
        console.timeEnd('[APP] Seed data loading')
        console.log('[APP] ✅ App marked as ready')
      })

    return () => {
      console.log('[APP] 🧹 Cleaning up initialization effect')
      clearTimeout(timer)
    }
  }, [loadSeedData])

  console.log('[APP] 🧮 Computing page configuration')
  const pageConfig = useMemo(() => {
    console.log('[APP] 📄 Getting page config')
    const config = getPageConfig()
    console.log('[APP] ✅ Page config retrieved:', Object.keys(config).length, 'pages')
    return config
  }, [])
  
  const enabledPages = useMemo(() => {
    console.log('[APP] 🔍 Filtering enabled pages')
    const pages = getEnabledPages(featureToggles)
    console.log('[APP] ✅ Enabled pages:', pages.map(p => p.id).join(', '))
    return pages
  }, [featureToggles])
  
  const shortcuts = useMemo(() => {
    console.log('[APP] ⌨️ Getting keyboard shortcuts')
    const s = getPageShortcuts(featureToggles)
    console.log('[APP] ✅ Shortcuts configured:', s.length)
    return s
  }, [featureToggles])

  console.log('[APP] ⌨️ Configuring keyboard shortcuts')
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
  console.log('[APP] ✅ Keyboard shortcuts configured')

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
    console.log('[APP] 🎨 Rendering page:', page.id)
    try {
      const Component = componentMap[page.component]
      if (!Component) {
        console.error('[APP] ❌ Component not found:', page.component)
        return <LoadingFallback message={`Component ${page.component} not found`} />
      }
      console.log('[APP] ✅ Component found:', page.component)

      if (page.requiresResizable && page.resizableConfig) {
        console.log('[APP] 🔀 Rendering resizable layout for:', page.id)
        const config = page.resizableConfig
        const LeftComponent = componentMap[config.leftComponent]
        const RightComponent = Component

        if (!LeftComponent) {
          console.error('[APP] ❌ Left component not found:', config.leftComponent)
          return <LoadingFallback message={`Component ${config.leftComponent} not found`} />
        }
        console.log('[APP] ✅ Resizable layout components ready')

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

      console.log('[APP] 📦 Rendering standard component:', page.component)
      const props = getPropsForComponent(page.id)
      return (
        <Suspense fallback={<LoadingFallback message={`Loading ${page.title.toLowerCase()}...`} />}>
          <Component {...props} />
        </Suspense>
      )
    } catch (error) {
      console.error('[APP] ❌ Failed to render page', page.id, ':', error)
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

  console.log('[APP] 🎨 Rendering App component UI')
  console.log('[APP] App state - appReady:', appReady, 'activeTab:', activeTab)
  console.timeEnd('[APP] App render')
  
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

console.log('[APP] ✅ App component defined')
console.timeEnd('[APP] Component initialization')

export default App
