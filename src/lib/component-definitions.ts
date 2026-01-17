import { ComponentType } from '@/types/json-ui'

export interface ComponentDefinition {
  type: ComponentType
  label: string
  category: 'layout' | 'input' | 'display' | 'custom'
  icon: string
  defaultProps?: Record<string, any>
  canHaveChildren?: boolean
}

export const componentDefinitions: ComponentDefinition[] = [
  {
    type: 'div',
    label: 'Container',
    category: 'layout',
    icon: 'Square',
    canHaveChildren: true,
    defaultProps: { className: 'p-4 space-y-2' }
  },
  {
    type: 'section',
    label: 'Section',
    category: 'layout',
    icon: 'SquaresFour',
    canHaveChildren: true,
    defaultProps: { className: 'space-y-4' }
  },
  {
    type: 'Grid',
    label: 'Grid',
    category: 'layout',
    icon: 'GridFour',
    canHaveChildren: true,
    defaultProps: { columns: 2, gap: 4 }
  },
  {
    type: 'Card',
    label: 'Card',
    category: 'layout',
    icon: 'Rectangle',
    canHaveChildren: true,
    defaultProps: { className: 'p-4' }
  },
  {
    type: 'Button',
    label: 'Button',
    category: 'input',
    icon: 'Circle',
    defaultProps: { children: 'Click me', variant: 'default' }
  },
  {
    type: 'Input',
    label: 'Input',
    category: 'input',
    icon: 'TextT',
    defaultProps: { placeholder: 'Enter text...' }
  },
  {
    type: 'Select',
    label: 'Select',
    category: 'input',
    icon: 'CaretDown',
    defaultProps: { placeholder: 'Choose option...' }
  },
  {
    type: 'Checkbox',
    label: 'Checkbox',
    category: 'input',
    icon: 'CheckSquare',
    defaultProps: {}
  },
  {
    type: 'Switch',
    label: 'Switch',
    category: 'input',
    icon: 'ToggleLeft',
    defaultProps: {}
  },
  {
    type: 'Heading',
    label: 'Heading',
    category: 'display',
    icon: 'TextHOne',
    defaultProps: { level: 1, children: 'Heading' }
  },
  {
    type: 'Text',
    label: 'Text',
    category: 'display',
    icon: 'Paragraph',
    defaultProps: { children: 'Text content' }
  },
  {
    type: 'Badge',
    label: 'Badge',
    category: 'display',
    icon: 'Tag',
    defaultProps: { children: 'Badge', variant: 'default' }
  },
  {
    type: 'Progress',
    label: 'Progress',
    category: 'display',
    icon: 'CircleNotch',
    defaultProps: { value: 50 }
  },
  {
    type: 'Separator',
    label: 'Separator',
    category: 'display',
    icon: 'Minus',
    defaultProps: {}
  },
  {
    type: 'DataCard',
    label: 'Data Card',
    category: 'custom',
    icon: 'ChartBar',
    defaultProps: { title: 'Metric', value: '100', icon: 'TrendUp' }
  },
  {
    type: 'SearchInput',
    label: 'Search Input',
    category: 'custom',
    icon: 'MagnifyingGlass',
    defaultProps: { placeholder: 'Search...' }
  },
  {
    type: 'StatusBadge',
    label: 'Status Badge',
    category: 'custom',
    icon: 'Circle',
    defaultProps: { status: 'active', children: 'Active' }
  },
]

export function getCategoryComponents(category: string): ComponentDefinition[] {
  return componentDefinitions.filter(c => c.category === category)
}

export function getComponentDef(type: ComponentType): ComponentDefinition | undefined {
  return componentDefinitions.find(c => c.type === type)
}
