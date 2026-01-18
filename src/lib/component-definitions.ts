import { ComponentType } from '@/types/json-ui'

export interface ComponentDefinition {
  type: ComponentType
  label: string
  category: 'layout' | 'input' | 'display' | 'navigation' | 'feedback' | 'data' | 'custom'
  icon: string
  defaultProps?: Record<string, any>
  canHaveChildren?: boolean
  props?: ComponentPropDefinition[]
  events?: ComponentEventDefinition[]
}

export interface ComponentPropDefinition {
  name: string
  type: string
  description: string
  required?: boolean
  defaultValue?: string
  options?: string[]
  supportsBinding?: boolean
}

export interface ComponentEventDefinition {
  name: string
  description: string
}

export const componentDefinitions: ComponentDefinition[] = [
  // Layout Components
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
    type: 'Stack',
    label: 'Stack',
    category: 'layout',
    icon: 'Stack',
    canHaveChildren: true,
    defaultProps: { direction: 'vertical', gap: 2 }
  },
  {
    type: 'Flex',
    label: 'Flex',
    category: 'layout',
    icon: 'ArrowsOutLineHorizontal',
    canHaveChildren: true,
    defaultProps: { direction: 'row', gap: 2 }
  },
  {
    type: 'Container',
    label: 'Container',
    category: 'layout',
    icon: 'Rectangle',
    canHaveChildren: true,
    defaultProps: { maxWidth: 'lg' }
  },
  {
    type: 'Card',
    label: 'Card',
    category: 'layout',
    icon: 'Rectangle',
    canHaveChildren: true,
    defaultProps: { className: 'p-4' }
  },
  // Input Components
  {
    type: 'Button',
    label: 'Button',
    category: 'input',
    icon: 'Circle',
    canHaveChildren: true,
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
    type: 'TextArea',
    label: 'TextArea',
    category: 'input',
    icon: 'TextAlignLeft',
    defaultProps: { placeholder: 'Enter text...', rows: 4 }
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
    type: 'Radio',
    label: 'Radio',
    category: 'input',
    icon: 'Circle',
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
    type: 'Slider',
    label: 'Slider',
    category: 'input',
    icon: 'SlidersHorizontal',
    defaultProps: { min: 0, max: 100, value: 50 }
  },
  {
    type: 'NumberInput',
    label: 'Number Input',
    category: 'input',
    icon: 'NumberCircleOne',
    defaultProps: { placeholder: '0', min: 0 }
  },
  // Display Components
  {
    type: 'Heading',
    label: 'Heading',
    category: 'display',
    icon: 'TextHOne',
    canHaveChildren: true,
    defaultProps: { level: 1, children: 'Heading' }
  },
  {
    type: 'Text',
    label: 'Text',
    category: 'display',
    icon: 'Paragraph',
    canHaveChildren: true,
    defaultProps: { children: 'Text content' }
  },
  {
    type: 'Badge',
    label: 'Badge',
    category: 'display',
    icon: 'Tag',
    canHaveChildren: true,
    defaultProps: { children: 'Badge', variant: 'default' }
  },
  {
    type: 'Tag',
    label: 'Tag',
    category: 'display',
    icon: 'Tag',
    canHaveChildren: true,
    defaultProps: { children: 'Tag' }
  },
  {
    type: 'Code',
    label: 'Code',
    category: 'display',
    icon: 'Code',
    canHaveChildren: true,
    defaultProps: { children: 'code' }
  },
  {
    type: 'Image',
    label: 'Image',
    category: 'display',
    icon: 'Image',
    defaultProps: { src: '', alt: 'Image' }
  },
  {
    type: 'Avatar',
    label: 'Avatar',
    category: 'display',
    icon: 'UserCircle',
    defaultProps: { src: '', alt: 'Avatar' }
  },
  {
    type: 'Progress',
    label: 'Progress',
    category: 'display',
    icon: 'CircleNotch',
    defaultProps: { value: 50 }
  },
  {
    type: 'Spinner',
    label: 'Spinner',
    category: 'display',
    icon: 'CircleNotch',
    defaultProps: { size: 'md' }
  },
  {
    type: 'Skeleton',
    label: 'Skeleton',
    category: 'display',
    icon: 'Rectangle',
    defaultProps: { className: 'h-4 w-full' }
  },
  {
    type: 'Separator',
    label: 'Separator',
    category: 'display',
    icon: 'Minus',
    defaultProps: {}
  },
  // Navigation Components
  {
    type: 'Link',
    label: 'Link',
    category: 'navigation',
    icon: 'Link',
    canHaveChildren: true,
    defaultProps: { href: '#', children: 'Link' }
  },
  // Feedback Components
  {
    type: 'Alert',
    label: 'Alert',
    category: 'feedback',
    icon: 'Info',
    canHaveChildren: true,
    defaultProps: { variant: 'info', children: 'Alert message' }
  },
  {
    type: 'InfoBox',
    label: 'Info Box',
    category: 'feedback',
    icon: 'Info',
    canHaveChildren: true,
    defaultProps: { type: 'info', children: 'Information' }
  },
  {
    type: 'EmptyState',
    label: 'Empty State',
    category: 'feedback',
    icon: 'FolderOpen',
    canHaveChildren: true,
    defaultProps: { message: 'No items found' }
  },
  {
    type: 'StatusBadge',
    label: 'Status Badge',
    category: 'feedback',
    icon: 'Circle',
    defaultProps: { status: 'active', children: 'Active' }
  },
  {
    type: 'ErrorBadge',
    label: 'Error Badge',
    category: 'feedback',
    icon: 'WarningCircle',
    defaultProps: { count: 3, variant: 'destructive', size: 'md' },
    props: [
      {
        name: 'count',
        type: 'number',
        description: 'Number of errors to display. Hidden when set to 0.',
        required: true,
        supportsBinding: true,
      },
      {
        name: 'variant',
        type: 'string',
        description: 'Visual variant for the badge.',
        defaultValue: 'destructive',
        options: ['default', 'destructive'],
      },
      {
        name: 'size',
        type: 'string',
        description: 'Badge size.',
        defaultValue: 'md',
        options: ['sm', 'md'],
      },
    ],
  },
  {
    type: 'Notification',
    label: 'Notification',
    category: 'feedback',
    icon: 'Info',
    defaultProps: { type: 'info', title: 'Notification', message: 'Details go here.' },
    props: [
      {
        name: 'type',
        type: 'string',
        description: 'Notification style variant.',
        required: true,
        options: ['info', 'success', 'warning', 'error'],
      },
      {
        name: 'title',
        type: 'string',
        description: 'Primary notification title.',
        required: true,
        supportsBinding: true,
      },
      {
        name: 'message',
        type: 'string',
        description: 'Optional supporting message text.',
        supportsBinding: true,
      },
      {
        name: 'className',
        type: 'string',
        description: 'Optional custom classes for spacing or layout tweaks.',
      },
    ],
    events: [
      {
        name: 'onClose',
        description: 'Fires when the close button is clicked. Bind to dismiss or trigger an action.',
      },
    ],
  },
  {
    type: 'StatusIcon',
    label: 'Status Icon',
    category: 'feedback',
    icon: 'CheckCircle',
    defaultProps: { type: 'saved', size: 14, animate: false },
    props: [
      {
        name: 'type',
        type: 'string',
        description: 'Status icon style.',
        required: true,
        supportsBinding: true,
        options: ['saved', 'synced'],
      },
      {
        name: 'size',
        type: 'number',
        description: 'Icon size in pixels.',
        defaultValue: '14',
        supportsBinding: true,
      },
      {
        name: 'animate',
        type: 'boolean',
        description: 'Applies entry animation when true.',
        defaultValue: 'false',
        supportsBinding: true,
      },
    ],
  },
  // Data Components
  {
    type: 'List',
    label: 'List',
    category: 'data',
    icon: 'List',
    defaultProps: { items: [], emptyMessage: 'No items' }
  },
  {
    type: 'Table',
    label: 'Table',
    category: 'data',
    icon: 'Table',
    defaultProps: { data: [], columns: [] }
  },
  {
    type: 'KeyValue',
    label: 'Key Value',
    category: 'data',
    icon: 'Equals',
    defaultProps: { label: 'Key', value: 'Value' }
  },
  {
    type: 'StatCard',
    label: 'Stat Card',
    category: 'data',
    icon: 'ChartBar',
    defaultProps: { title: 'Metric', value: '0' }
  },
  // Custom Components
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
    type: 'ActionBar',
    label: 'Action Bar',
    category: 'custom',
    icon: 'Toolbox',
    canHaveChildren: true,
    defaultProps: { actions: [] }
  },
]

export function getCategoryComponents(category: string): ComponentDefinition[] {
  return componentDefinitions.filter(c => c.category === category)
}

export function getComponentDef(type: ComponentType): ComponentDefinition | undefined {
  return componentDefinitions.find(c => c.type === type)
}
