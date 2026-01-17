import { PageSchema } from '@/types/json-ui'

export const todoListSchema: PageSchema = {
  id: 'todo-list',
  name: 'Todo List',
  layout: {
    type: 'single',
  },
  dataSources: [
    {
      id: 'todos',
      type: 'kv',
      key: 'app-todos',
      defaultValue: [
        { id: 1, text: 'Learn JSON-driven UI', completed: true },
        { id: 2, text: 'Build atomic components', completed: false },
        { id: 3, text: 'Create custom hooks', completed: false },
      ],
    },
    {
      id: 'newTodo',
      type: 'static',
      defaultValue: '',
    },
    {
      id: 'stats',
      type: 'computed',
      compute: (data) => ({
        total: data.todos?.length || 0,
        completed: data.todos?.filter((t: any) => t.completed).length || 0,
        remaining: data.todos?.filter((t: any) => !t.completed).length || 0,
      }),
      dependencies: ['todos'],
    },
  ],
  components: [
    {
      id: 'root',
      type: 'div',
      props: {
        className: 'h-full overflow-auto p-6 bg-gradient-to-br from-background via-background to-primary/5',
      },
      children: [
        {
          id: 'header',
          type: 'div',
          props: { className: 'mb-6' },
          children: [
            {
              id: 'title',
              type: 'Heading',
              props: {
                className: 'text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent',
                children: 'Task Manager',
              },
            },
            {
              id: 'subtitle',
              type: 'Text',
              props: {
                className: 'text-muted-foreground',
                children: 'Built entirely from JSON schema',
              },
            },
          ],
        },
        {
          id: 'stats-row',
          type: 'div',
          props: { className: 'grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 max-w-3xl' },
          children: [
            {
              id: 'stat-total',
              type: 'Card',
              props: { className: 'bg-card/50 backdrop-blur' },
              children: [
                {
                  id: 'stat-total-content',
                  type: 'CardContent',
                  props: { className: 'pt-6' },
                  children: [
                    {
                      id: 'stat-total-label',
                      type: 'div',
                      props: { className: 'text-sm text-muted-foreground mb-1', children: 'Total Tasks' },
                    },
                    {
                      id: 'stat-total-value',
                      type: 'div',
                      props: { className: 'text-3xl font-bold' },
                      bindings: {
                        children: { source: 'stats', path: 'total' },
                      },
                    },
                  ],
                },
              ],
            },
            {
              id: 'stat-completed',
              type: 'Card',
              props: { className: 'bg-accent/10 backdrop-blur border-accent/20' },
              children: [
                {
                  id: 'stat-completed-content',
                  type: 'CardContent',
                  props: { className: 'pt-6' },
                  children: [
                    {
                      id: 'stat-completed-label',
                      type: 'div',
                      props: { className: 'text-sm text-muted-foreground mb-1', children: 'Completed' },
                    },
                    {
                      id: 'stat-completed-value',
                      type: 'div',
                      props: { className: 'text-3xl font-bold text-accent' },
                      bindings: {
                        children: { source: 'stats', path: 'completed' },
                      },
                    },
                  ],
                },
              ],
            },
            {
              id: 'stat-remaining',
              type: 'Card',
              props: { className: 'bg-primary/5 backdrop-blur border-primary/20' },
              children: [
                {
                  id: 'stat-remaining-content',
                  type: 'CardContent',
                  props: { className: 'pt-6' },
                  children: [
                    {
                      id: 'stat-remaining-label',
                      type: 'div',
                      props: { className: 'text-sm text-muted-foreground mb-1', children: 'Remaining' },
                    },
                    {
                      id: 'stat-remaining-value',
                      type: 'div',
                      props: { className: 'text-3xl font-bold text-primary' },
                      bindings: {
                        children: { source: 'stats', path: 'remaining' },
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: 'main-card',
          type: 'Card',
          props: { className: 'max-w-3xl' },
          children: [
            {
              id: 'card-header',
              type: 'CardHeader',
              children: [
                {
                  id: 'card-title',
                  type: 'CardTitle',
                  props: { children: 'Your Tasks' },
                },
                {
                  id: 'card-description',
                  type: 'CardDescription',
                  props: { children: 'Manage your daily tasks efficiently' },
                },
              ],
            },
            {
              id: 'card-content',
              type: 'CardContent',
              props: { className: 'space-y-4' },
              children: [
                {
                  id: 'input-group',
                  type: 'div',
                  props: { className: 'flex gap-2' },
                  children: [
                    {
                      id: 'todo-input',
                      type: 'Input',
                      props: {
                        placeholder: 'What needs to be done?',
                      },
                      bindings: {
                        value: { source: 'newTodo' },
                      },
                      events: [
                        {
                          event: 'change',
                          actions: [
                            {
                              id: 'update-input',
                              type: 'set-value',
                              target: 'newTodo',
                              compute: (data, event) => event.target.value,
                            },
                          ],
                        },
                      ],
                    },
                    {
                      id: 'add-button',
                      type: 'Button',
                      props: { children: 'Add Task' },
                      events: [
                        {
                          event: 'click',
                          actions: [
                            {
                              id: 'add-todo',
                              type: 'create',
                              target: 'todos',
                              compute: (data) => ({
                                id: Date.now(),
                                text: data.newTodo,
                                completed: false,
                              }),
                            },
                            {
                              id: 'clear-input',
                              type: 'set-value',
                              target: 'newTodo',
                              value: '',
                            },
                            {
                              id: 'show-success',
                              type: 'show-toast',
                              message: 'Task added successfully!',
                              variant: 'success',
                            },
                          ],
                          condition: (data) => data.newTodo?.trim().length > 0,
                        },
                      ],
                    },
                  ],
                },
                {
                  id: 'separator',
                  type: 'Separator',
                  props: { className: 'my-4' },
                },
                {
                  id: 'todo-list',
                  type: 'div',
                  props: { className: 'space-y-2' },
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  globalActions: [],
}

export const dashboardSchema: PageSchema = {
  id: 'dashboard',
  name: 'Dashboard',
  layout: {
    type: 'grid',
    columns: 2,
    gap: 4,
  },
  dataSources: [
    {
      id: 'stats',
      type: 'static',
      defaultValue: {
        users: 1247,
        revenue: 45230,
        orders: 892,
        conversion: 3.2,
      },
    },
  ],
  components: [],
  globalActions: [],
}

export const newMoleculesShowcaseSchema: PageSchema = {
  id: 'new-molecules-showcase',
  name: 'New Molecules Showcase',
  layout: {
    type: 'single',
  },
  dataSources: [
    {
      id: 'itemCount',
      type: 'static',
      defaultValue: 42,
    },
    {
      id: 'isLoading',
      type: 'static',
      defaultValue: false,
    },
  ],
  components: [
    {
      id: 'root',
      type: 'div',
      props: {
        className: 'h-full overflow-auto p-8 bg-background',
      },
      children: [
        {
          id: 'page-header',
          type: 'div',
          props: { className: 'mb-8' },
          children: [
            {
              id: 'page-title',
              type: 'Heading',
              props: {
                level: 1,
                className: 'text-4xl font-bold mb-2',
                children: 'New JSON-Compatible Molecules',
              },
            },
            {
              id: 'page-description',
              type: 'Text',
              props: {
                className: 'text-muted-foreground text-lg',
                children: 'Showcasing the newly added molecular components',
              },
            },
          ],
        },
        {
          id: 'showcase-grid',
          type: 'Grid',
          props: { cols: 2, gap: 'lg', className: 'max-w-5xl' },
          children: [
            {
              id: 'branding-card',
              type: 'Card',
              children: [
                {
                  id: 'branding-header',
                  type: 'CardHeader',
                  children: [
                    {
                      id: 'branding-title',
                      type: 'CardTitle',
                      props: { children: 'AppBranding' },
                    },
                    {
                      id: 'branding-description',
                      type: 'CardDescription',
                      props: { children: 'Application branding with logo, title, and subtitle' },
                    },
                  ],
                },
                {
                  id: 'branding-content',
                  type: 'CardContent',
                  children: [
                    {
                      id: 'branding-demo',
                      type: 'AppBranding',
                      props: {
                        title: 'My Amazing App',
                        subtitle: 'Built with JSON-Powered Components',
                      },
                    },
                  ],
                },
              ],
            },
            {
              id: 'label-badge-card',
              type: 'Card',
              children: [
                {
                  id: 'label-badge-header',
                  type: 'CardHeader',
                  children: [
                    {
                      id: 'label-badge-title',
                      type: 'CardTitle',
                      props: { children: 'LabelWithBadge' },
                    },
                    {
                      id: 'label-badge-description',
                      type: 'CardDescription',
                      props: { children: 'Label with optional badge indicator' },
                    },
                  ],
                },
                {
                  id: 'label-badge-content',
                  type: 'CardContent',
                  props: { className: 'space-y-3' },
                  children: [
                    {
                      id: 'label-badge-demo-1',
                      type: 'LabelWithBadge',
                      props: {
                        label: 'Total Items',
                      },
                      bindings: {
                        badge: { source: 'itemCount' },
                      },
                    },
                    {
                      id: 'label-badge-demo-2',
                      type: 'LabelWithBadge',
                      props: {
                        label: 'Warning',
                        badge: '3',
                        badgeVariant: 'destructive',
                      },
                    },
                    {
                      id: 'label-badge-demo-3',
                      type: 'LabelWithBadge',
                      props: {
                        label: 'Success',
                        badge: 'New',
                        badgeVariant: 'default',
                      },
                    },
                  ],
                },
              ],
            },
            {
              id: 'empty-state-card',
              type: 'Card',
              children: [
                {
                  id: 'empty-state-header',
                  type: 'CardHeader',
                  children: [
                    {
                      id: 'empty-state-title',
                      type: 'CardTitle',
                      props: { children: 'EmptyEditorState' },
                    },
                    {
                      id: 'empty-state-description',
                      type: 'CardDescription',
                      props: { children: 'Empty state display for editor contexts' },
                    },
                  ],
                },
                {
                  id: 'empty-state-content',
                  type: 'CardContent',
                  props: { className: 'h-48' },
                  children: [
                    {
                      id: 'empty-state-demo',
                      type: 'EmptyEditorState',
                      props: {},
                    },
                  ],
                },
              ],
            },
            {
              id: 'loading-states-card',
              type: 'Card',
              children: [
                {
                  id: 'loading-states-header',
                  type: 'CardHeader',
                  children: [
                    {
                      id: 'loading-states-title',
                      type: 'CardTitle',
                      props: { children: 'Loading States' },
                    },
                    {
                      id: 'loading-states-description',
                      type: 'CardDescription',
                      props: { children: 'LoadingFallback and LoadingState components' },
                    },
                  ],
                },
                {
                  id: 'loading-states-content',
                  type: 'CardContent',
                  props: { className: 'space-y-4' },
                  children: [
                    {
                      id: 'loading-fallback-wrapper',
                      type: 'div',
                      props: { className: 'h-24 border border-border rounded-md' },
                      children: [
                        {
                          id: 'loading-fallback-demo',
                          type: 'LoadingFallback',
                          props: {
                            message: 'Loading your data...',
                          },
                        },
                      ],
                    },
                    {
                      id: 'loading-state-demo',
                      type: 'LoadingState',
                      props: {
                        message: 'Processing request...',
                        size: 'sm',
                      },
                    },
                  ],
                },
              ],
            },
            {
              id: 'nav-header-card',
              type: 'Card',
              props: { className: 'col-span-2' },
              children: [
                {
                  id: 'nav-header-header',
                  type: 'CardHeader',
                  children: [
                    {
                      id: 'nav-header-title',
                      type: 'CardTitle',
                      props: { children: 'NavigationGroupHeader' },
                    },
                    {
                      id: 'nav-header-description',
                      type: 'CardDescription',
                      props: { children: 'Collapsible navigation group header (Note: requires Collapsible wrapper in production)' },
                    },
                  ],
                },
                {
                  id: 'nav-header-content',
                  type: 'CardContent',
                  children: [
                    {
                      id: 'nav-header-demo',
                      type: 'NavigationGroupHeader',
                      props: {
                        label: 'Components',
                        count: 24,
                        isExpanded: true,
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: 'info-section',
          type: 'Alert',
          props: {
            className: 'max-w-5xl mt-8',
          },
          children: [
            {
              id: 'info-title',
              type: 'div',
              props: {
                className: 'font-semibold mb-2',
                children: '✅ Successfully Added to JSON Registry',
              },
            },
            {
              id: 'info-text',
              type: 'div',
              props: {
                className: 'text-sm',
                children: 'All components shown above are now available in the JSON UI component registry and can be used in JSON schemas.',
              },
            },
          ],
        },
      ],
    },
  ],
  globalActions: [],
}
