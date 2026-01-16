import { useState } from 'react'
import { toast, Toaster } from 'sonner'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { AppHeader, PageHeader } from '@/components/organisms'
import { ProjectDashboard } from '@/components/ProjectDashboard'
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
import { FeatureToggleSettings } from '@/components/FeatureToggleSettings'
import { PWAInstallPrompt } from '@/components/PWAInstallPrompt'
import { PWAUpdatePrompt } from '@/components/PWAUpdatePrompt'
import { PWAStatusBar } from '@/components/PWAStatusBar'
import { PWASettings } from '@/components/PWASettings'
import { FaviconDesigner } from '@/components/FaviconDesigner'
import { FeatureIdeaCloud } from '@/components/FeatureIdeaCloud'
import { GlobalSearch } from '@/components/GlobalSearch'
import { KeyboardShortcutsDialog } from '@/components/KeyboardShortcutsDialog'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { useProjectState } from '@/hooks/use-project-state'
import { useFileOperations } from '@/hooks/use-file-operations'
import { useProjectExport } from '@/hooks/use-project-export'
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts'
import { useAutoRepair } from '@/hooks/use-auto-repair'

function App() {
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
  } = useProjectState()

  const [lastSaved] = useState<number | null>(Date.now())

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

  const loadProject = (project: any) => {
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

  const {
    activeFileId,
    setActiveFileId,
    handleFileChange,
    handleFileAdd,
    handleFileClose,
  } = useFileOperations(files, setFiles)

  const { handleExportProject, exportDialogOpen, setExportDialogOpen, generatedCode, handleDownloadZip } = useProjectExport(
    files,
    models,
    components,
    theme,
    playwrightTests,
    storybookStories,
    unitTests,
    flaskConfig,
    nextjsConfig,
    npmSettings
  )

  const [activeTab, setActiveTab] = useState('dashboard')
  const [searchDialogOpen, setSearchDialogOpen] = useState(false)
  const [shortcutsDialogOpen, setShortcutsDialogOpen] = useState(false)

  const { errors: autoDetectedErrors = [] } = useAutoRepair(files, false)
  const errorCount = Array.isArray(autoDetectedErrors) ? autoDetectedErrors.length : 0

  useKeyboardShortcuts([
    { key: '1', ctrl: true, description: 'Dashboard', action: () => setActiveTab('dashboard') },
    { key: '2', ctrl: true, description: 'Code Editor', action: () => setActiveTab('code') },
    { key: '3', ctrl: true, description: 'Models', action: () => setActiveTab('models') },
    { key: 'k', ctrl: true, description: 'Search', action: () => setSearchDialogOpen(true) },
    { key: 'e', ctrl: true, description: 'Export', action: () => handleExportProject() },
    { key: '/', ctrl: true, description: 'Shortcuts', action: () => setShortcutsDialogOpen(true) },
  ])

  return (
    <div className="h-screen flex flex-col bg-background text-foreground">
      <PWAStatusBar />
      <PWAUpdatePrompt />
      
      <AppHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        featureToggles={featureToggles}
        errorCount={errorCount}
        lastSaved={lastSaved}
        currentProject={getCurrentProject()}
        onProjectLoad={loadProject}
        onSearch={() => setSearchDialogOpen(true)}
        onShowShortcuts={() => setShortcutsDialogOpen(true)}
        onGenerateAI={() => {}}
        onExport={handleExportProject}
        onShowErrors={() => setActiveTab('errors')}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <PageHeader activeTab={activeTab} />
        
        <div className="flex-1 overflow-hidden">
          <TabsContent value="dashboard" className="h-full m-0">
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
          </TabsContent>

          {featureToggles.codeEditor && (
            <TabsContent value="code" className="h-full m-0">
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
            </TabsContent>
          )}

          {featureToggles.models && (
            <TabsContent value="models" className="h-full m-0">
              <ModelDesigner models={models} onModelsChange={setModels} />
            </TabsContent>
          )}

          {featureToggles.components && (
            <TabsContent value="components" className="h-full m-0">
              <ComponentTreeBuilder components={components} onComponentsChange={setComponents} />
            </TabsContent>
          )}

          {featureToggles.componentTrees && (
            <TabsContent value="component-trees" className="h-full m-0">
              <ComponentTreeManager trees={componentTrees} onTreesChange={setComponentTrees} />
            </TabsContent>
          )}

          {featureToggles.workflows && (
            <TabsContent value="workflows" className="h-full m-0">
              <WorkflowDesigner workflows={workflows} onWorkflowsChange={setWorkflows} />
            </TabsContent>
          )}

          {featureToggles.lambdas && (
            <TabsContent value="lambdas" className="h-full m-0">
              <LambdaDesigner lambdas={lambdas} onLambdasChange={setLambdas} />
            </TabsContent>
          )}

          {featureToggles.styling && (
            <TabsContent value="styling" className="h-full m-0">
              <StyleDesigner theme={theme} onThemeChange={setTheme} />
            </TabsContent>
          )}

          {featureToggles.flaskApi && (
            <TabsContent value="flask" className="h-full m-0">
              <FlaskDesigner config={flaskConfig} onConfigChange={setFlaskConfig} />
            </TabsContent>
          )}

          <TabsContent value="settings" className="h-full m-0">
            <ProjectSettingsDesigner
              nextjsConfig={nextjsConfig}
              npmSettings={npmSettings}
              onNextjsConfigChange={setNextjsConfig}
              onNpmSettingsChange={setNpmSettings}
            />
          </TabsContent>

          <TabsContent value="pwa" className="h-full m-0">
            <PWASettings />
          </TabsContent>

          <TabsContent value="features" className="h-full m-0">
            <FeatureToggleSettings features={featureToggles} onFeaturesChange={setFeatureToggles} />
          </TabsContent>

          {featureToggles.playwright && (
            <TabsContent value="playwright" className="h-full m-0">
              <PlaywrightDesigner tests={playwrightTests} onTestsChange={setPlaywrightTests} />
            </TabsContent>
          )}

          {featureToggles.storybook && (
            <TabsContent value="storybook" className="h-full m-0">
              <StorybookDesigner stories={storybookStories} onStoriesChange={setStorybookStories} />
            </TabsContent>
          )}

          {featureToggles.unitTests && (
            <TabsContent value="unit-tests" className="h-full m-0">
              <UnitTestDesigner tests={unitTests} onTestsChange={setUnitTests} />
            </TabsContent>
          )}

          {featureToggles.errorRepair && (
            <TabsContent value="errors" className="h-full m-0">
              <ErrorPanel
                files={files}
                onFileChange={handleFileChange}
                onFileSelect={setActiveFileId}
              />
            </TabsContent>
          )}

          {featureToggles.documentation && (
            <TabsContent value="docs" className="h-full m-0">
              <DocumentationView />
            </TabsContent>
          )}

          {featureToggles.sassStyles && (
            <TabsContent value="sass" className="h-full m-0">
              <SassStylesShowcase />
            </TabsContent>
          )}

          {featureToggles.faviconDesigner && (
            <TabsContent value="favicon" className="h-full m-0">
              <FaviconDesigner />
            </TabsContent>
          )}

          {featureToggles.ideaCloud && (
            <TabsContent value="ideas" className="h-full m-0">
              <FeatureIdeaCloud />
            </TabsContent>
          )}
        </div>
      </Tabs>

      <GlobalSearch
        open={searchDialogOpen}
        onOpenChange={setSearchDialogOpen}
        files={files}
        models={models}
        components={components}
        componentTrees={componentTrees}
        workflows={workflows}
        lambdas={lambdas}
        playwrightTests={playwrightTests}
        storybookStories={storybookStories}
        unitTests={unitTests}
        onNavigate={(tab) => setActiveTab(tab)}
        onFileSelect={setActiveFileId}
      />

      <KeyboardShortcutsDialog open={shortcutsDialogOpen} onOpenChange={setShortcutsDialogOpen} />
      <PWAInstallPrompt />
    </div>
  )
}

export default App
