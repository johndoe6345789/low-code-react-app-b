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

export const progressIndicatorsDemoSchema: PageSchema = {
  id: 'progress-indicators-demo',
  name: 'Progress Indicators Demo',
  layout: {
    type: 'single',
  },
  dataSources: [],
  components: [
    {
      id: 'progress-demo-root',
      type: 'div',
      props: {
        className: 'space-y-6 rounded-lg border border-border bg-card p-6',
      },
      children: [
        {
          id: 'progress-demo-title',
          type: 'Heading',
          props: {
            className: 'text-xl font-semibold',
            children: 'Progress Indicators',
          },
        },
        {
          id: 'progress-demo-subtitle',
          type: 'Text',
          props: {
            className: 'text-sm text-muted-foreground',
            children: 'Circular and linear progress components with JSON-friendly props.',
          },
        },
        {
          id: 'progress-demo-circular-row',
          type: 'div',
          props: {
            className: 'flex flex-wrap items-center gap-6',
          },
          children: [
            {
              id: 'progress-demo-circular-primary',
              type: 'CircularProgress',
              props: {
                value: 72,
                size: 'md',
                showLabel: true,
              },
            },
            {
              id: 'progress-demo-circular-large',
              type: 'CircularProgress',
              props: {
                value: 45,
                size: 'lg',
                showLabel: true,
              },
            },
          ],
        },
        {
          id: 'progress-demo-divider',
          type: 'Divider',
          props: {
            orientation: 'horizontal',
            decorative: true,
            className: 'my-2',
          },
        },
        {
          id: 'progress-demo-linear-stack',
          type: 'div',
          props: {
            className: 'space-y-4',
          },
          children: [
            {
              id: 'progress-demo-linear-accent',
              type: 'ProgressBar',
              props: {
                value: 60,
                max: 100,
                size: 'md',
                variant: 'accent',
                showLabel: true,
              },
            },
            {
              id: 'progress-demo-linear-compact',
              type: 'ProgressBar',
              props: {
                value: 35,
                max: 100,
                size: 'sm',
                variant: 'default',
                showLabel: false,
              },
            },
          ],
        },
      ],
    },
  ],
}
