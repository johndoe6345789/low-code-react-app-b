import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { FeatureToggles } from '@/types/project'
import { Code, Database, Tree, PaintBrush, Flask, Play, BookOpen, Cube, Wrench, FileText, FlowArrow } from '@phosphor-icons/react'
import { ScrollArea } from '@/components/ui/scroll-area'

interface FeatureToggleSettingsProps {
  features: FeatureToggles
  onFeaturesChange: (features: FeatureToggles) => void
}

const featuresList = [
  { 
    key: 'codeEditor' as keyof FeatureToggles, 
    label: 'Code Editor', 
    description: 'Monaco-based code editor with syntax highlighting',
    icon: Code
  },
  { 
    key: 'models' as keyof FeatureToggles, 
    label: 'Database Models', 
    description: 'Prisma schema designer for database models',
    icon: Database
  },
  { 
    key: 'components' as keyof FeatureToggles, 
    label: 'Component Builder', 
    description: 'Visual component tree builder for React components',
    icon: Tree
  },
  { 
    key: 'componentTrees' as keyof FeatureToggles, 
    label: 'Component Trees Manager', 
    description: 'Manage multiple component tree configurations',
    icon: Tree
  },
  { 
    key: 'workflows' as keyof FeatureToggles, 
    label: 'Workflow Designer', 
    description: 'n8n-style visual workflow automation builder',
    icon: FlowArrow
  },
  { 
    key: 'lambdas' as keyof FeatureToggles, 
    label: 'Lambda Functions', 
    description: 'Serverless function editor with multiple runtimes',
    icon: Code
  },
  { 
    key: 'styling' as keyof FeatureToggles, 
    label: 'Theme Designer', 
    description: 'Material UI theme customization and styling',
    icon: PaintBrush
  },
  { 
    key: 'flaskApi' as keyof FeatureToggles, 
    label: 'Flask API Designer', 
    description: 'Python Flask backend API endpoint designer',
    icon: Flask
  },
  { 
    key: 'playwright' as keyof FeatureToggles, 
    label: 'Playwright Tests', 
    description: 'E2E testing with Playwright configuration',
    icon: Play
  },
  { 
    key: 'storybook' as keyof FeatureToggles, 
    label: 'Storybook Stories', 
    description: 'Component documentation and development',
    icon: BookOpen
  },
  { 
    key: 'unitTests' as keyof FeatureToggles, 
    label: 'Unit Tests', 
    description: 'Component and function unit test designer',
    icon: Cube
  },
  { 
    key: 'errorRepair' as keyof FeatureToggles, 
    label: 'Error Repair', 
    description: 'Auto-detect and fix code errors',
    icon: Wrench
  },
  { 
    key: 'documentation' as keyof FeatureToggles, 
    label: 'Documentation', 
    description: 'Project documentation, roadmap, and guides',
    icon: FileText
  },
  { 
    key: 'sassStyles' as keyof FeatureToggles, 
    label: 'Sass Styles', 
    description: 'Custom Sass/SCSS styling showcase',
    icon: PaintBrush
  },
]

export function FeatureToggleSettings({ features, onFeaturesChange }: FeatureToggleSettingsProps) {
  const handleToggle = (key: keyof FeatureToggles, value: boolean) => {
    onFeaturesChange({
      ...features,
      [key]: value,
    })
  }

  const enabledCount = Object.values(features).filter(Boolean).length
  const totalCount = Object.keys(features).length

  return (
    <div className="h-full p-6 bg-background">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Feature Toggles</h2>
        <p className="text-muted-foreground">
          Enable or disable features to customize your workspace. {enabledCount} of {totalCount} features enabled.
        </p>
      </div>

      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pr-4">
          {featuresList.map(({ key, label, description, icon: Icon }) => (
            <Card key={key}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${features[key] ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                      <Icon size={20} weight="duotone" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{label}</CardTitle>
                      <CardDescription className="text-xs mt-1">{description}</CardDescription>
                    </div>
                  </div>
                  <Switch
                    id={key}
                    checked={features[key]}
                    onCheckedChange={(checked) => handleToggle(key, checked)}
                  />
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
