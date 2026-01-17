import { useState } from 'react'
import { useKV } from '@/hooks/use-kv'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AppHeader, PageHeader } from '@/components/organisms'
import { FeatureToggles, Project } from '@/types/project'
import { toast } from 'sonner'

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
  schemaEditor: true,
  dataBinding: true,
}

function App() {
  const [featureToggles] = useKV<FeatureToggles>('feature-toggles', DEFAULT_FEATURE_TOGGLES)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [lastSaved] = useState(Date.now())

  const safeFeatureToggles = featureToggles || DEFAULT_FEATURE_TOGGLES

  const getCurrentProject = (): Project => {
    return {
      name: 'Test Project',
      files: [],
      models: [],
      components: [],
      componentTrees: [],
      workflows: [],
      lambdas: [],
      theme: {
        variants: [],
        activeVariantId: 'light',
        fontFamily: 'Inter',
        fontSize: { small: 12, medium: 14, large: 20 },
        spacing: 8,
        borderRadius: 4,
      },
    }
  }

  const handleProjectLoad = (project: Project) => {
    toast.success('Project loaded')
  }

  return (
    <div className="h-screen flex flex-col bg-background text-foreground">
      <AppHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        featureToggles={safeFeatureToggles}
        errorCount={0}
        lastSaved={lastSaved}
        currentProject={getCurrentProject()}
        onProjectLoad={handleProjectLoad}
        onSearch={() => {}}
        onShowShortcuts={() => {}}
        onGenerateAI={() => {}}
        onExport={() => {}}
        onShowErrors={() => {}}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <PageHeader activeTab={activeTab} />
        
        <div className="flex-1 overflow-hidden p-6">
          <TabsContent value="dashboard" className="h-full m-0">
            <Card>
              <CardHeader>
                <CardTitle>Dashboard</CardTitle>
                <CardDescription>Welcome to CodeForge</CardDescription>
              </CardHeader>
              <CardContent>
                <p>The application is loading successfully!</p>
                <Button onClick={() => toast.success('Test toast')}>Test Toast</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="code" className="h-full m-0">
            <Card>
              <CardHeader>
                <CardTitle>Code Editor</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Code editor will load here</p>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}

export default App
