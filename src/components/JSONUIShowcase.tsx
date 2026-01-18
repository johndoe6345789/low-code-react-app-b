import { useMemo, useState } from 'react'
import showcaseCopy from '@/config/ui-examples/showcase.json'
import dashboardExample from '@/config/ui-examples/dashboard.json'
import formExample from '@/config/ui-examples/form.json'
import tableExample from '@/config/ui-examples/table.json'
import settingsExample from '@/config/ui-examples/settings.json'
import { FileCode, ChartBar, ListBullets, Table, Gear } from '@phosphor-icons/react'
import { ShowcaseHeader } from '@/components/json-ui-showcase/ShowcaseHeader'
import { ShowcaseTabs } from '@/components/json-ui-showcase/ShowcaseTabs'
import { ShowcaseFooter } from '@/components/json-ui-showcase/ShowcaseFooter'
import { ShowcaseExample } from '@/components/json-ui-showcase/types'

const exampleConfigs = {
  dashboard: dashboardExample,
  form: formExample,
  table: tableExample,
  settings: settingsExample,
}

const exampleIcons = {
  ChartBar,
  ListBullets,
  Table,
  Gear,
}

export function JSONUIShowcase() {
  const [selectedExample, setSelectedExample] = useState(showcaseCopy.defaultExampleKey)
  const [showJSON, setShowJSON] = useState(false)

  const examples = useMemo<ShowcaseExample[]>(() => {
    return showcaseCopy.examples.map((example) => {
      const icon = exampleIcons[example.icon as keyof typeof exampleIcons] || FileCode
      const config = exampleConfigs[example.configKey as keyof typeof exampleConfigs]

      return {
        key: example.key,
        name: example.name,
        description: example.description,
        icon,
        config,
      }
    })
  }, [])

  return (
    <div className="h-full flex flex-col bg-background">
      <ShowcaseHeader copy={showcaseCopy.header} />

      <div className="flex-1 overflow-hidden">
        <ShowcaseTabs
          examples={examples}
          copy={showcaseCopy.tabs}
          selectedExample={selectedExample}
          onSelectedExampleChange={setSelectedExample}
          showJSON={showJSON}
          onShowJSONChange={setShowJSON}
        />
      </div>

      <ShowcaseFooter items={showcaseCopy.footer.items} />
    </div>
  )
}
