import { UIComponent } from '@/types/json-ui'
import { PropertyEditorField } from '@/components/atoms/PropertyEditorField'
import { PanelHeader, Badge, IconButton, Stack, Text, EmptyStateIcon } from '@/components/atoms'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Sliders, Trash } from '@phosphor-icons/react'
import { getComponentDef } from '@/lib/component-definitions'

interface PropertyEditorProps {
  component: UIComponent | null
  onUpdate: (updates: Partial<UIComponent>) => void
  onDelete: () => void
}

export function PropertyEditor({ component, onUpdate, onDelete }: PropertyEditorProps) {
  if (!component) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8">
        <Stack direction="vertical" align="center" spacing="md">
          <EmptyStateIcon icon={<Sliders className="w-12 h-12" />} />
          <Stack direction="vertical" align="center" spacing="xs">
            <Text variant="small">No component selected</Text>
            <Text variant="caption">Select a component to edit its properties</Text>
          </Stack>
        </Stack>
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
      <div className="p-4">
        <PanelHeader
          title="Properties"
          subtitle={
            <Stack direction="horizontal" align="center" spacing="sm" className="mt-1">
              <Badge variant="outline" className="text-xs font-mono">
                {def?.label || component.type}
              </Badge>
              <Text variant="caption">#{component.id}</Text>
            </Stack>
          }
          icon={<Sliders size={20} weight="duotone" />}
          actions={
            <IconButton
              icon={<Trash className="w-4 h-4" />}
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            />
          }
        />
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <Stack spacing="lg">
          <Stack spacing="md">
            <Text variant="caption" className="font-semibold uppercase tracking-wide">
              Component Properties
            </Text>
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
          </Stack>

          <Separator />

          <Stack spacing="md">
            <Text variant="caption" className="font-semibold uppercase tracking-wide">
              Common Properties
            </Text>
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
          </Stack>
        </Stack>
      </ScrollArea>
    </div>
  )
}
