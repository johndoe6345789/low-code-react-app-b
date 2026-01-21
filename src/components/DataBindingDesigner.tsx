import { useState } from 'react'
import { DataSourceManager, ComponentBindingDialog } from '@/lib/json-ui/json-components'
import { DataSource, UIComponent } from '@/types/json-ui'
import { DataBindingHeader } from '@/components/data-binding-designer/DataBindingHeader'
import { ComponentBindingsCard } from '@/components/data-binding-designer/ComponentBindingsCard'
import { HowItWorksCard } from '@/components/data-binding-designer/HowItWorksCard'
import dataBindingCopy from '@/data/data-binding-designer.json'

export function DataBindingDesigner() {
  const [dataSources, setDataSources] = useState<DataSource[]>(
    dataBindingCopy.seed.dataSources as DataSource[],
  )

  const [mockComponents] = useState<UIComponent[]>(dataBindingCopy.seed.components)

  const [selectedComponent, setSelectedComponent] = useState<UIComponent | null>(null)
  const [bindingDialogOpen, setBindingDialogOpen] = useState(false)

  const handleEditBinding = (component: UIComponent) => {
    setSelectedComponent(component)
    setBindingDialogOpen(true)
  }

  const handleSaveBinding = (updatedComponent: UIComponent) => {
    console.log('Updated component bindings:', updatedComponent)
  }

  return (
    <div className="h-full overflow-auto">
      <div className="p-6 space-y-6">
        <DataBindingHeader
          title={dataBindingCopy.header.title}
          description={dataBindingCopy.header.description}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <DataSourceManager
              dataSources={dataSources}
              onChange={setDataSources}
            />
          </div>

          <div className="space-y-6">
            <ComponentBindingsCard
              components={mockComponents}
              dataSources={dataSources}
              copy={dataBindingCopy.bindingsCard}
              onEditBinding={handleEditBinding}
            />

            <HowItWorksCard
              title={dataBindingCopy.howItWorks.title}
              steps={dataBindingCopy.howItWorks.steps}
            />
          </div>
        </div>
      </div>

      <ComponentBindingDialog
        open={bindingDialogOpen}
        component={selectedComponent}
        dataSources={dataSources}
        onOpenChange={setBindingDialogOpen}
        onSave={handleSaveBinding}
      />
    </div>
  )
}
