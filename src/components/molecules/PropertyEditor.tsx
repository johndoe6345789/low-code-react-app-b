import { UIComponent } from '@/types/json-ui'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { getComponentDef } from '@/lib/component-definition-utils'
import { PropertyEditorEmptyState } from '@/components/molecules/property-editor/PropertyEditorEmptyState'
import { propertyEditorConfig } from '@/components/molecules/property-editor/propertyEditorConfig'
import { PropertyEditorHeader } from '@/components/molecules/property-editor/PropertyEditorHeader'
import { PropertyEditorSection } from '@/components/molecules/property-editor/PropertyEditorSection'
import { Stack } from '@/components/atoms'

interface PropertyEditorProps {
  component: UIComponent | null
  onUpdate: (updates: Partial<UIComponent>) => void
  onDelete: () => void
}

export function PropertyEditor({ component, onUpdate, onDelete }: PropertyEditorProps) {
  if (!component) {
    return <PropertyEditorEmptyState />
  }

  const def = getComponentDef(component.type)

  const handlePropChange = (key: string, value: unknown) => {
    onUpdate({
      props: {
        ...component.props,
        [key]: value,
      },
    })
  }

  const props = propertyEditorConfig.typeSpecificProps[component.type] || []

  return (
    <div className="h-full flex flex-col">
      <PropertyEditorHeader
        componentId={component.id}
        componentLabel={def?.label || component.type}
        onDelete={onDelete}
      />

      <ScrollArea className="flex-1 p-4">
        <Stack spacing="lg">
          <PropertyEditorSection
            title={propertyEditorConfig.sections.componentProps}
            fields={props}
            component={component}
            onChange={handlePropChange}
          />

          <Separator />

          <PropertyEditorSection
            title={propertyEditorConfig.sections.commonProps}
            fields={propertyEditorConfig.commonProps}
            component={component}
            onChange={handlePropChange}
          />
        </Stack>
      </ScrollArea>
    </div>
  )
}
