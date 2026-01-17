console.log('[APP] 🚀 App.tsx loading - BEGIN')
console.time('[APP] Component initialization')

import { useState, Suspense, useEffect } from 'react'
console.log('[APP] ✅ React hooks imported')

import { BrowserRouter, useLocation } from 'react-router-dom'
console.log('[APP] ✅ React Router imported')

import { AppHeader } from '@/components/organisms'
console.log('[APP] ✅ Header components imported')

import { LoadingFallback } from '@/components/molecules'
console.log('[APP] ✅ LoadingFallback imported')

import { useProjectState } from '@/hooks/use-project-state'
import { useFileOperations } from '@/hooks/use-file-operations'
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts'
import { useSeedData } from '@/hooks/data/use-seed-data'
import { useRouterNavigation } from '@/hooks/use-router-navigation'
console.log('[APP] ✅ Custom hooks imported')

import { getPageShortcuts } from '@/config/page-loader'
console.log('[APP] ✅ Page config imported')

import { toast } from 'sonner'
console.log('[APP] ✅ Toast imported')

import { DialogRegistry, PWARegistry, preloadCriticalComponents } from '@/lib/component-registry'
console.log('[APP] ✅ Component registry imported')

import { RouterProvider } from '@/router'
console.log('[APP] ✅ Router provider imported')

const { GlobalSearch, KeyboardShortcutsDialog, PreviewDialog } = DialogRegistry
const { PWAInstallPrompt, PWAUpdatePrompt, PWAStatusBar } = PWARegistry
console.log('[APP] ✅ Dialog and PWA components registered')

console.log('[APP] 🎯 App component function executing')

function AppLayout() {
  console.log('[APP] 🏗️ AppLayout component rendering')
  const location = useLocation()
  const { currentPage, navigateToPage } = useRouterNavigation()
  
  console.log('[APP] 📍 Current location:', location.pathname)
  console.log('[APP] 📄 Current page:', currentPage)
  
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

  console.log('[APP] 💾 Initializing state variables')
  const [searchOpen, setSearchOpen] = useState(false)
  const [shortcutsOpen, setShortcutsOpen] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [lastSaved] = useState<number | null>(Date.now())
  const [errorCount] = useState(0)
  console.log('[APP] ✅ State variables initialized')

  const shortcuts = getPageShortcuts(featureToggles)
  console.log('[APP] ⌨️ Keyboard shortcuts configured:', shortcuts.length)

  console.log('[APP] ⌨️ Setting up keyboard shortcuts')
  useKeyboardShortcuts([
    ...shortcuts.map(s => ({
      key: s.key,
      ctrl: s.ctrl,
      shift: s.shift,
      description: s.description,
      action: () => {
        console.log('[APP] ⌨️ Shortcut triggered, navigating to:', s.action)
        navigateToPage(s.action)
      }
    })),
    { 
      key: 'k', 
      ctrl: true, 
      description: 'Search', 
      action: () => {
        console.log('[APP] ⌨️ Search shortcut triggered')
        setSearchOpen(true)
      }
    },
    { 
      key: '/', 
      ctrl: true, 
      description: 'Shortcuts', 
      action: () => {
        console.log('[APP] ⌨️ Shortcuts dialog triggered')
        setShortcutsOpen(true)
      }
    },
    { 
      key: 'p', 
      ctrl: true, 
      description: 'Preview', 
      action: () => {
        console.log('[APP] ⌨️ Preview shortcut triggered')
        setPreviewOpen(true)
      }
    },
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
    console.log('[APP] 📦 Loading project:', project.name)
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
    console.log('[APP] ✅ Project loaded successfully')
  }

  useEffect(() => {
    console.log('[APP] 📍 Route changed to:', location.pathname, '- Page:', currentPage)
  }, [location, currentPage])

  console.log('[APP] 🎨 Rendering AppLayout UI')
  
  return (
    <div className="h-screen flex flex-col bg-background">
      <Suspense fallback={<div className="h-1 bg-primary animate-pulse" />}>
        <PWAStatusBar />
      </Suspense>
      <Suspense fallback={null}>
        <PWAUpdatePrompt />
      </Suspense>
      <AppHeader
        activeTab={currentPage}
        onTabChange={navigateToPage}
        featureToggles={featureToggles}
        errorCount={errorCount}
        lastSaved={lastSaved}
        currentProject={getCurrentProject()}
        onProjectLoad={handleProjectLoad}
        onSearch={() => {
          console.log('[APP] 🔍 Search opened')
          setSearchOpen(true)
        }}
        onShowShortcuts={() => {
          console.log('[APP] ⌨️ Shortcuts dialog opened')
          setShortcutsOpen(true)
        }}
        onGenerateAI={() => {
          console.log('[APP] 🤖 AI generation requested')
          toast.info('AI generation coming soon')
        }}
        onExport={() => {
          console.log('[APP] 📤 Export requested')
          toast.info('Export coming soon')
        }}
        onPreview={() => {
          console.log('[APP] 👁️ Preview opened')
          setPreviewOpen(true)
        }}
        onShowErrors={() => {
          console.log('[APP] ⚠️ Navigating to errors page')
          navigateToPage('errors')
        }}
      />
      <div className="flex-1 overflow-hidden">
        <RouterProvider 
          featureToggles={featureToggles}
          stateContext={{
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
          }}
          actionContext={{
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
          }}
        />
      </div>

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
          onNavigate={navigateToPage}
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

function App() {
  console.log('[APP] 🚀 App component initializing')
  console.log('[APP] 🌱 Initializing seed data hook')
  const { loadSeedData } = useSeedData()
  const [appReady, setAppReady] = useState(false)
  
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
        
        console.log('[APP] 🚀 Preloading critical components')
        preloadCriticalComponents()
      })

    return () => {
      console.log('[APP] 🧹 Cleaning up initialization effect')
      clearTimeout(timer)
    }
  }, [loadSeedData])

  console.log('[APP] 🎨 Rendering App component')
  
  return (
    <>
      {!appReady && (
        <div className="fixed inset-0 bg-background z-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground">Loading CodeForge...</p>
          </div>
        </div>
      )}
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </>
  )
}

console.log('[APP] ✅ App component defined')
console.timeEnd('[APP] Component initialization')

export default App
