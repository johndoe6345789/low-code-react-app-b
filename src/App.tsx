console.log('[APP_ROUTER] 🚀 App.router.tsx loading - BEGIN')
console.time('[APP_ROUTER] Component initialization')

import { useState, Suspense, useEffect } from 'react'
console.log('[APP_ROUTER] ✅ React hooks imported')

import { BrowserRouter, useLocation } from 'react-router-dom'
console.log('[APP_ROUTER] ✅ React Router imported')

import { AppHeader } from '@/components/organisms'
import { NavigationMenu } from '@/components/organisms/NavigationMenu'
console.log('[APP_ROUTER] ✅ Header components imported')

import { LoadingFallback } from '@/components/molecules'
console.log('[APP_ROUTER] ✅ LoadingFallback imported')

import { useProjectState } from '@/hooks/use-project-state'
import { useFileOperations } from '@/hooks/use-file-operations'
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts'
import { useSeedData } from '@/hooks/data/use-seed-data'
import { useRouterNavigation } from '@/hooks/use-router-navigation'
import { useComponentTreeLoader } from '@/hooks/use-component-tree-loader'
console.log('[APP_ROUTER] ✅ Custom hooks imported')

import { getPageShortcuts } from '@/config/page-loader'
console.log('[APP_ROUTER] ✅ Page config imported')

import { toast } from 'sonner'
console.log('[APP_ROUTER] ✅ Toast imported')

import { DialogRegistry, PWARegistry, preloadCriticalComponents } from '@/lib/component-registry'
console.log('[APP_ROUTER] ✅ Component registry imported')

import { RouterProvider } from '@/router'
console.log('[APP_ROUTER] ✅ Router provider imported')

import { SidebarProvider, SidebarInset, Sidebar, SidebarContent, SidebarHeader } from '@/components/ui/sidebar'
console.log('[APP_ROUTER] ✅ Sidebar provider imported')

const { GlobalSearch, KeyboardShortcutsDialog, PreviewDialog } = DialogRegistry
const { PWAInstallPrompt, PWAUpdatePrompt, PWAStatusBar } = PWARegistry
console.log('[APP_ROUTER] ✅ Dialog and PWA components registered')

console.log('[APP_ROUTER] 🎯 App component function executing')

function AppLayout() {
  console.log('[APP_ROUTER] 🏗️ AppLayout component rendering')
  const location = useLocation()
  const { currentPage, navigateToPage } = useRouterNavigation()
  
  console.log('[APP_ROUTER] 📍 Current location:', location.pathname)
  console.log('[APP_ROUTER] 📄 Current page:', currentPage)
  
  console.log('[APP_ROUTER] 📊 Initializing project state hook')
  const projectState = useProjectState()
  console.log('[APP_ROUTER] ✅ Project state initialized')
  
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

  console.log('[APP_ROUTER] 📁 Initializing file operations')
  const fileOps = useFileOperations(files, setFiles)
  console.log('[APP_ROUTER] ✅ File operations initialized')
  
  const { activeFileId, setActiveFileId, handleFileChange, handleFileAdd, handleFileClose } = fileOps

  console.log('[APP_ROUTER] 💾 Initializing state variables')
  const [searchOpen, setSearchOpen] = useState(false)
  const [shortcutsOpen, setShortcutsOpen] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [lastSaved] = useState<number | null>(Date.now())
  const [errorCount] = useState(0)
  console.log('[APP_ROUTER] ✅ State variables initialized')

  const shortcuts = getPageShortcuts(featureToggles)
  console.log('[APP_ROUTER] ⌨️ Keyboard shortcuts configured:', shortcuts.length)

  console.log('[APP_ROUTER] ⌨️ Setting up keyboard shortcuts')
  useKeyboardShortcuts([
    ...shortcuts.map(s => ({
      key: s.key,
      ctrl: s.ctrl,
      shift: s.shift,
      description: s.description,
      action: () => {
        console.log('[APP_ROUTER] ⌨️ Shortcut triggered, navigating to:', s.action)
        navigateToPage(s.action)
      }
    })),
    { 
      key: 'k', 
      ctrl: true, 
      description: 'Search', 
      action: () => {
        console.log('[APP_ROUTER] ⌨️ Search shortcut triggered')
        setSearchOpen(true)
      }
    },
    { 
      key: '/', 
      ctrl: true, 
      description: 'Shortcuts', 
      action: () => {
        console.log('[APP_ROUTER] ⌨️ Shortcuts dialog triggered')
        setShortcutsOpen(true)
      }
    },
    { 
      key: 'p', 
      ctrl: true, 
      description: 'Preview', 
      action: () => {
        console.log('[APP_ROUTER] ⌨️ Preview shortcut triggered')
        setPreviewOpen(true)
      }
    },
  ])
  console.log('[APP_ROUTER] ✅ Keyboard shortcuts configured')

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
    console.log('[APP_ROUTER] 📦 Loading project:', project.name)
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
    console.log('[APP_ROUTER] ✅ Project loaded successfully')
  }

  useEffect(() => {
    console.log('[APP_ROUTER] 📍 Route changed to:', location.pathname, '- Page:', currentPage)
  }, [location, currentPage])

  console.log('[APP_ROUTER] 🎨 Rendering AppLayout UI')
  
  return (
    <SidebarProvider defaultOpen={true}>
      <NavigationMenu
        activeTab={currentPage}
        onTabChange={navigateToPage}
        featureToggles={featureToggles}
        errorCount={errorCount}
      />
      
      <SidebarInset>
        <Suspense fallback={<div className="h-1 bg-primary animate-pulse" />}>
          <PWAStatusBar />
        </Suspense>
        <Suspense fallback={null}>
          <PWAUpdatePrompt />
        </Suspense>
        
        <div className="h-screen flex flex-col bg-background">
          <AppHeader
            activeTab={currentPage}
            onTabChange={navigateToPage}
            featureToggles={featureToggles}
            errorCount={errorCount}
            lastSaved={lastSaved}
            currentProject={getCurrentProject()}
            onProjectLoad={handleProjectLoad}
            onSearch={() => {
              console.log('[APP_ROUTER] 🔍 Search opened')
              setSearchOpen(true)
            }}
            onShowShortcuts={() => {
              console.log('[APP_ROUTER] ⌨️ Shortcuts dialog opened')
              setShortcutsOpen(true)
            }}
            onGenerateAI={() => {
              console.log('[APP_ROUTER] 🤖 AI generation requested')
              toast.info('AI generation coming soon')
            }}
            onExport={() => {
              console.log('[APP_ROUTER] 📤 Export requested')
              toast.info('Export coming soon')
            }}
            onPreview={() => {
              console.log('[APP_ROUTER] 👁️ Preview opened')
              setPreviewOpen(true)
            }}
            onShowErrors={() => {
              console.log('[APP_ROUTER] ⚠️ Navigating to errors page')
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
        </div>
      </SidebarInset>

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
          onNavigate={(page) => {
            console.log('[APP_ROUTER] 🔍 Search navigation to:', page)
            navigateToPage(page)
          }}
          onFileSelect={(fileId) => {
            console.log('[APP_ROUTER] 📄 File selected from search:', fileId)
            setActiveFileId(fileId)
            navigateToPage('code')
          }}
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
    </SidebarProvider>
  )
}

function App() {
  console.log('[APP_ROUTER] 🔧 Initializing App component')
  console.time('[APP_ROUTER] App render')
  
  console.log('[APP_ROUTER] 🌱 Initializing seed data hook')
  const { loadSeedData } = useSeedData()
  const { loadComponentTrees } = useComponentTreeLoader()
  const projectState = useProjectState()
  const { featureToggles, files, setFiles, ...restState } = projectState
  console.log('[APP_ROUTER] ✅ Hooks initialized')

  console.log('[APP_ROUTER] 📁 Initializing file operations for router context')
  const fileOps = useFileOperations(files, setFiles)
  
  const [appReady, setAppReady] = useState(false)
  console.log('[APP_ROUTER] 💾 App ready state:', appReady)

  console.log('[APP_ROUTER] ⏰ Setting up initialization effect')
  useEffect(() => {
    console.log('[APP_ROUTER] 🚀 Initialization effect triggered')
    console.time('[APP_ROUTER] Seed data loading')
    
    const timer = setTimeout(() => {
      console.log('[APP_ROUTER] ⏱️ Fallback timer triggered (100ms)')
      setAppReady(true)
    }, 100)
    
    console.log('[APP_ROUTER] 📥 Starting seed data load')
    loadSeedData()
      .then(() => {
        console.log('[APP_ROUTER] ✅ Seed data loaded successfully')
        console.log('[APP_ROUTER] 📦 Loading component trees from JSON')
        return loadComponentTrees()
      })
      .then(() => {
        console.log('[APP_ROUTER] ✅ Component trees loaded successfully')
      })
      .catch(err => {
        console.error('[APP_ROUTER] ❌ Seed data loading failed:', err)
      })
      .finally(() => {
        console.log('[APP_ROUTER] 🏁 Seed data loading complete')
        clearTimeout(timer)
        setAppReady(true)
        console.timeEnd('[APP_ROUTER] Seed data loading')
        console.log('[APP_ROUTER] ✅ App marked as ready')
        
        console.log('[APP_ROUTER] 🚀 Preloading critical components')
        preloadCriticalComponents()
      })

    return () => {
      console.log('[APP_ROUTER] 🧹 Cleaning up initialization effect')
      clearTimeout(timer)
    }
  }, [loadSeedData, loadComponentTrees])

  const stateContext = {
    files,
    ...restState,
    activeFileId: fileOps.activeFileId,
  }

  const actionContext = {
    handleFileChange: fileOps.handleFileChange,
    setActiveFileId: fileOps.setActiveFileId,
    handleFileClose: fileOps.handleFileClose,
    handleFileAdd: fileOps.handleFileAdd,
    setFiles,
    ...Object.fromEntries(
      Object.entries(restState).filter(([key]) => key.startsWith('set'))
    ),
  }

  console.log('[APP_ROUTER] 🎨 Rendering App component UI')
  console.log('[APP_ROUTER] App state - appReady:', appReady)
  console.timeEnd('[APP_ROUTER] App render')
  
  if (!appReady) {
    console.log('[APP_ROUTER] ⏳ App not ready, showing loading screen')
    return (
      <div className="fixed inset-0 bg-background z-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Loading CodeForge...</p>
        </div>
      </div>
    )
  }

  console.log('[APP_ROUTER] ✅ App ready, rendering router')
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  )
}

console.log('[APP_ROUTER] ✅ App component defined')
console.timeEnd('[APP_ROUTER] Component initialization')

export default App
