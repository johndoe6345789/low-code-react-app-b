import type { PageSchema } from '@/types/json-ui'

export const stateBindingsDemoSchema: PageSchema = {
  id: 'state-bindings-demo',
  name: 'State & Bindings Demo',
  layout: {
    type: 'single',
  },
  dataSources: [
    {
      id: 'statusItems',
      type: 'static',
      defaultValue: ['KV Ready', 'Components Loaded', 'Sync Enabled'],
    },
  ],
  components: [
    {
      id: 'state-demo-root',
      type: 'div',
      props: {
        className: 'space-y-4 rounded-lg border border-border bg-card p-6',
      },
      children: [
        {
          id: 'state-demo-title',
          type: 'Heading',
          props: {
            className: 'text-xl font-semibold',
            children: 'Renderer State Binding Demo',
          },
        },
        {
          id: 'state-demo-theme',
          type: 'Text',
          props: {
            className: 'text-sm text-muted-foreground',
          },
          bindings: {
            children: {
              sourceType: 'state',
              source: 'settings',
              path: 'settings.theme',
            },
          },
        },
        {
          id: 'state-demo-list',
          type: 'div',
          props: {
            className: 'space-y-2',
          },
          loop: {
            source: 'statusItems',
            itemVar: 'statusItem',
          },
          children: [
            {
              id: 'state-demo-list-item',
              type: 'Text',
              props: {
                className: 'text-sm',
              },
              bindings: {
                children: {
                  sourceType: 'bindings',
                  source: 'statusItem',
                },
              },
            },
          ],
        },
      ],
    },
  ],
}
