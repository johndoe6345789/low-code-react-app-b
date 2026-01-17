import { UIComponent } from '@/types/json-ui'
import { PropertyEditorField } from '@/components/atoms/PropertyEditorField'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Sliders, Trash, Code } from '@phosphor-icons/react'
import { getComponentDef } from '@/lib/component-definitions'

interface PropertyEditorProps {
  component: UIComponent | null
  onUpdate: (updates: Partial<UIComponent>) => void
  onDelete: () => void
}

export function PropertyEditor({ component, onUpdate, onDelete }: PropertyEditorProps) {
  if (!component) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
        <Sliders className="w-12 h-12 mb-4 opacity-50" />
        <p className="text-sm">No component selected</p>
        <p className="text-xs mt-1">Select a component to edit its properties</p>
      </div>
    )
  }

  const def = getComponentDef(component.type)
  
  const handlePropChange = (key: string, value: any) => {
    onUpdate({
      props: {
        ...component.props,
        [key]: value,
      },
    })
  }

  const commonProps = [
    { name: 'className', label: 'CSS Classes', type: 'text' as const },
  ]

  const typeSpecificProps: Record<string, Array<{ name: string; label: string; type: any; options?: any[] }>> = {
    Button: [
      { 
        name: 'variant', 
        label: 'Variant', 
        type: 'select',
        options: [
          { label: 'Default', value: 'default' },
          { label: 'Destructive', value: 'destructive' },
          { label: 'Outline', value: 'outline' },
          { label: 'Secondary', value: 'secondary' },
          { label: 'Ghost', value: 'ghost' },
          { label: 'Link', value: 'link' },
        ]
      },
      { name: 'children', label: 'Text', type: 'text' },
      { name: 'disabled', label: 'Disabled', type: 'boolean' },
    ],
    Input: [
      { name: 'placeholder', label: 'Placeholder', type: 'text' },
      { name: 'type', label: 'Type', type: 'select', options: [
        { label: 'Text', value: 'text' },
        { label: 'Password', value: 'password' },
        { label: 'Email', value: 'email' },
        { label: 'Number', value: 'number' },
      ]},
      { name: 'disabled', label: 'Disabled', type: 'boolean' },
    ],
    Heading: [
      { name: 'level', label: 'Level', type: 'select', options: [
        { label: 'H1', value: '1' },
        { label: 'H2', value: '2' },
        { label: 'H3', value: '3' },
        { label: 'H4', value: '4' },
      ]},
      { name: 'children', label: 'Text', type: 'text' },
    ],
    Text: [
      { name: 'children', label: 'Content', type: 'textarea' },
    ],
    Badge: [
      { name: 'variant', label: 'Variant', type: 'select', options: [
        { label: 'Default', value: 'default' },
        { label: 'Secondary', value: 'secondary' },
        { label: 'Destructive', value: 'destructive' },
        { label: 'Outline', value: 'outline' },
      ]},
      { name: 'children', label: 'Text', type: 'text' },
    ],
    Progress: [
      { name: 'value', label: 'Value', type: 'number' },
    ],
    Grid: [
      { name: 'columns', label: 'Columns', type: 'number' },
      { name: 'gap', label: 'Gap', type: 'number' },
    ],
  }

  const props = typeSpecificProps[component.type] || []

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-primary" weight="duotone" />
            <h2 className="text-lg font-semibold">Properties</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Code className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">{def?.label || component.type}</span>
          <span className="text-xs text-muted-foreground">#{component.id}</span>
        </div>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Component Properties
            </h3>
            {props.map((prop) => (
              <PropertyEditorField
                key={prop.name}
                label={prop.label}
                name={prop.name}
                value={component.props?.[prop.name]}
                type={prop.type}
                options={prop.options}
                onChange={handlePropChange}
              />
            ))}
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Common Properties
            </h3>
            {commonProps.map((prop) => (
              <PropertyEditorField
                key={prop.name}
                label={prop.label}
                name={prop.name}
                value={component.props?.[prop.name]}
                type={prop.type}
                onChange={handlePropChange}
              />
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
