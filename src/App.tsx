import { useState, lazy, Suspense } from 'react'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { AppHeader, PageHeader } from '@/components/organisms'
import { LoadingFallback } from '@/components/molecules'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { useProjectState } from '@/hooks/use-project-state'
import { useFileOperations } from '@/hooks/use-file-operations'
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts'
import { toast } from 'sonner'

const ProjectDashboard = lazy(() => import('@/components/ProjectDashboard').then(m => ({ default: m.ProjectDashboard })))
const CodeEditor = lazy(() => import('@/components/CodeEditor').then(m => ({ default: m.CodeEditor })))
const FileExplorer = lazy(() => import('@/components/FileExplorer').then(m => ({ default: m.FileExplorer })))
const ModelDesigner = lazy(() => import('@/components/ModelDesigner').then(m => ({ default: m.ModelDesigner })))
const ComponentTreeBuilder = lazy(() => import('@/components/ComponentTreeBuilder').then(m => ({ default: m.ComponentTreeBuilder })))
const ComponentTreeManager = lazy(() => import('@/components/ComponentTreeManager').then(m => ({ default: m.ComponentTreeManager })))
const WorkflowDesigner = lazy(() => import('@/components/WorkflowDesigner').then(m => ({ default: m.WorkflowDesigner })))
const LambdaDesigner = lazy(() => import('@/components/LambdaDesigner').then(m => ({ default: m.LambdaDesigner })))
const StyleDesigner = lazy(() => import('@/components/StyleDesigner').then(m => ({ default: m.StyleDesigner })))
const PlaywrightDesigner = lazy(() => import('@/components/PlaywrightDesigner').then(m => ({ default: m.PlaywrightDesigner })))
const StorybookDesigner = lazy(() => import('@/components/StorybookDesigner').then(m => ({ default: m.StorybookDesigner })))
const UnitTestDesigner = lazy(() => import('@/components/UnitTestDesigner').then(m => ({ default: m.UnitTestDesigner })))
const FlaskDesigner = lazy(() => import('@/components/FlaskDesigner').then(m => ({ default: m.FlaskDesigner })))
const ProjectSettingsDesigner = lazy(() => import('@/components/ProjectSettingsDesigner').then(m => ({ default: m.ProjectSettingsDesigner })))
const ErrorPanel = lazy(() => import('@/components/ErrorPanel').then(m => ({ default: m.ErrorPanel })))
const DocumentationView = lazy(() => import('@/components/DocumentationView').then(m => ({ default: m.DocumentationView })))
const SassStylesShowcase = lazy(() => import('@/components/SassStylesShowcase').then(m => ({ default: m.SassStylesShowcase })))
const FeatureToggleSettings = lazy(() => import('@/components/FeatureToggleSettings').then(m => ({ default: m.FeatureToggleSettings })))
const PWASettings = lazy(() => import('@/components/PWASettings').then(m => ({ default: m.PWASettings })))
const FaviconDesigner = lazy(() => import('@/components/FaviconDesigner').then(m => ({ default: m.FaviconDesigner })))
const FeatureIdeaCloud = lazy(() => import('@/components/FeatureIdeaCloud').then(m => ({ default: m.FeatureIdeaCloud })))
const GlobalSearch = lazy(() => import('@/components/GlobalSearch').then(m => ({ default: m.GlobalSearch })))
const KeyboardShortcutsDialog = lazy(() => import('@/components/KeyboardShortcutsDialog').then(m => ({ default: m.KeyboardShortcutsDialog })))
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

  const [activeTab, setActiveTab] = useState('dashboard')
  const [searchOpen, setSearchOpen] = useState(false)
  const [shortcutsOpen, setShortcutsOpen] = useState(false)
  const [lastSaved] = useState<number | null>(Date.now())
  const [errorCount] = useState(0)

  useKeyboardShortcuts([
    { key: '1', ctrl: true, description: 'Dashboard', action: () => setActiveTab('dashboard') },
    { key: '2', ctrl: true, description: 'Code', action: () => setActiveTab('code') },
    { key: 'k', ctrl: true, description: 'Search', action: () => setSearchOpen(true) },
    { key: '/', ctrl: true, description: 'Shortcuts', action: () => setShortcutsOpen(true) },
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

  return (
    <div className="h-screen flex flex-col bg-background">
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
        onShowErrors={() => setActiveTab('errors')}
      />
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <PageHeader activeTab={activeTab} />
        <div className="flex-1 overflow-hidden">
          <TabsContent value="dashboard" className="h-full m-0">
            <Suspense fallback={<LoadingFallback message="Loading dashboard..." />}>
              <ProjectDashboard
                files={files}
                models={models}
                components={components}
                theme={theme}
                playwrightTests={playwrightTests}
                storybookStories={storybookStories}
                unitTests={unitTests}
                flaskConfig={flaskConfig}
              />
            </Suspense>
          </TabsContent>

          {featureToggles.codeEditor && (
            <TabsContent value="code" className="h-full m-0">
              <Suspense fallback={<LoadingFallback message="Loading editor..." />}>
                <ResizablePanelGroup direction="horizontal">
                  <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
                    <FileExplorer
                      files={files}
                      activeFileId={activeFileId}
                      onFileSelect={setActiveFileId}
                      onFileAdd={handleFileAdd}
                    />
                  </ResizablePanel>
                  <ResizableHandle />
                  <ResizablePanel defaultSize={80}>
                    <CodeEditor
                      files={files}
                      activeFileId={activeFileId}
                      onFileChange={handleFileChange}
                      onFileSelect={setActiveFileId}
                      onFileClose={handleFileClose}
                    />
                  </ResizablePanel>
                </ResizablePanelGroup>
              </Suspense>
            </TabsContent>
          )}

          {featureToggles.models && (
            <TabsContent value="models" className="h-full m-0">
              <Suspense fallback={<LoadingFallback message="Loading models..." />}>
                <ModelDesigner models={models} onModelsChange={setModels} />
              </Suspense>
            </TabsContent>
          )}

          {featureToggles.components && (
            <TabsContent value="components" className="h-full m-0">
              <Suspense fallback={<LoadingFallback message="Loading components..." />}>
                <ComponentTreeBuilder components={components} onComponentsChange={setComponents} />
              </Suspense>
            </TabsContent>
          )}

          {featureToggles.componentTrees && (
            <TabsContent value="component-trees" className="h-full m-0">
              <Suspense fallback={<LoadingFallback message="Loading component trees..." />}>
                <ComponentTreeManager trees={componentTrees} onTreesChange={setComponentTrees} />
              </Suspense>
            </TabsContent>
          )}

          {featureToggles.workflows && (
            <TabsContent value="workflows" className="h-full m-0">
              <Suspense fallback={<LoadingFallback message="Loading workflows..." />}>
                <WorkflowDesigner workflows={workflows} onWorkflowsChange={setWorkflows} />
              </Suspense>
            </TabsContent>
          )}

          {featureToggles.lambdas && (
            <TabsContent value="lambdas" className="h-full m-0">
              <Suspense fallback={<LoadingFallback message="Loading lambdas..." />}>
                <LambdaDesigner lambdas={lambdas} onLambdasChange={setLambdas} />
              </Suspense>
            </TabsContent>
          )}

          {featureToggles.styling && (
            <TabsContent value="styling" className="h-full m-0">
              <Suspense fallback={<LoadingFallback message="Loading style designer..." />}>
                <StyleDesigner theme={theme} onThemeChange={setTheme} />
              </Suspense>
            </TabsContent>
          )}

          {featureToggles.flaskApi && (
            <TabsContent value="flask" className="h-full m-0">
              <Suspense fallback={<LoadingFallback message="Loading Flask designer..." />}>
                <FlaskDesigner config={flaskConfig} onConfigChange={setFlaskConfig} />
              </Suspense>
            </TabsContent>
          )}

          <TabsContent value="settings" className="h-full m-0">
            <Suspense fallback={<LoadingFallback message="Loading settings..." />}>
              <ProjectSettingsDesigner
                nextjsConfig={nextjsConfig}
                npmSettings={npmSettings}
                onNextjsConfigChange={setNextjsConfig}
                onNpmSettingsChange={setNpmSettings}
              />
            </Suspense>
          </TabsContent>

          <TabsContent value="pwa" className="h-full m-0">
            <Suspense fallback={<LoadingFallback message="Loading PWA settings..." />}>
              <PWASettings />
            </Suspense>
          </TabsContent>

          <TabsContent value="features" className="h-full m-0">
            <Suspense fallback={<LoadingFallback message="Loading feature toggles..." />}>
              <FeatureToggleSettings features={featureToggles} onFeaturesChange={setFeatureToggles} />
            </Suspense>
          </TabsContent>

          {featureToggles.playwright && (
            <TabsContent value="playwright" className="h-full m-0">
              <Suspense fallback={<LoadingFallback message="Loading Playwright designer..." />}>
                <PlaywrightDesigner tests={playwrightTests} onTestsChange={setPlaywrightTests} />
              </Suspense>
            </TabsContent>
          )}

          {featureToggles.storybook && (
            <TabsContent value="storybook" className="h-full m-0">
              <Suspense fallback={<LoadingFallback message="Loading Storybook designer..." />}>
                <StorybookDesigner stories={storybookStories} onStoriesChange={setStorybookStories} />
              </Suspense>
            </TabsContent>
          )}

          {featureToggles.unitTests && (
            <TabsContent value="unit-tests" className="h-full m-0">
              <Suspense fallback={<LoadingFallback message="Loading unit test designer..." />}>
                <UnitTestDesigner tests={unitTests} onTestsChange={setUnitTests} />
              </Suspense>
            </TabsContent>
          )}

          {featureToggles.errorRepair && (
            <TabsContent value="errors" className="h-full m-0">
              <Suspense fallback={<LoadingFallback message="Loading error panel..." />}>
                <ErrorPanel files={files} onFileChange={handleFileChange} onFileSelect={setActiveFileId} />
              </Suspense>
            </TabsContent>
          )}

          {featureToggles.documentation && (
            <TabsContent value="docs" className="h-full m-0">
              <Suspense fallback={<LoadingFallback message="Loading documentation..." />}>
                <DocumentationView />
              </Suspense>
            </TabsContent>
          )}

          {featureToggles.sassStyles && (
            <TabsContent value="sass" className="h-full m-0">
              <Suspense fallback={<LoadingFallback message="Loading Sass showcase..." />}>
                <SassStylesShowcase />
              </Suspense>
            </TabsContent>
          )}

          {featureToggles.faviconDesigner && (
            <TabsContent value="favicon" className="h-full m-0">
              <Suspense fallback={<LoadingFallback message="Loading favicon designer..." />}>
                <FaviconDesigner />
              </Suspense>
            </TabsContent>
          )}

          {featureToggles.ideaCloud && (
            <TabsContent value="ideas" className="h-full m-0">
              <Suspense fallback={<LoadingFallback message="Loading feature ideas..." />}>
                <FeatureIdeaCloud />
              </Suspense>
            </TabsContent>
          )}
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
        <PWAInstallPrompt />
      </Suspense>
    </div>
  )
}

export default App
