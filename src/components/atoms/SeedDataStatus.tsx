import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Database, Check, X } from '@phosphor-icons/react'
import seedDataConfig from '@/config/seed-data.json'

export function SeedDataStatus() {
  const dataKeys = Object.keys(seedDataConfig)
  
  const getDataCount = (key: string): number => {
    const data = seedDataConfig[key as keyof typeof seedDataConfig]
    return Array.isArray(data) ? data.length : 0
  }

  const getLabelForKey = (key: string): string => {
    const labels: Record<string, string> = {
      'project-files': 'Files',
      'project-models': 'Models',
      'project-components': 'Components',
      'project-workflows': 'Workflows',
      'project-lambdas': 'Lambdas',
      'project-playwright-tests': 'Playwright Tests',
      'project-storybook-stories': 'Storybook Stories',
      'project-unit-tests': 'Unit Tests',
      'project-component-trees': 'Component Trees',
    }
    return labels[key] || key
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Database size={20} weight="duotone" />
          Seed Data Available
        </CardTitle>
        <CardDescription>
          Pre-configured data ready to load from database
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {dataKeys.map((key) => {
            const count = getDataCount(key)
            return (
              <div
                key={key}
                className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/50"
              >
                <span className="text-sm font-medium">{getLabelForKey(key)}</span>
                <Badge variant="secondary" className="ml-2">
                  {count}
                </Badge>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
