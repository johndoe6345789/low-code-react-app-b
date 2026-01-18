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

export const feedbackAtomsDemoSchema: PageSchema = {
  id: 'feedback-atoms-demo',
  name: 'Feedback Atoms Demo',
  layout: {
    type: 'single',
  },
  dataSources: [
    {
      id: 'errorCount',
      type: 'static',
      defaultValue: 3,
    },
    {
      id: 'showNotification',
      type: 'static',
      defaultValue: true,
    },
    {
      id: 'statusType',
      type: 'static',
      defaultValue: 'saved',
    },
  ],
  components: [
    {
      id: 'feedback-atoms-root',
      type: 'div',
      props: {
        className: 'space-y-6 rounded-lg border border-border bg-card p-6',
      },
      children: [
        {
          id: 'feedback-atoms-title',
          type: 'Heading',
          props: {
            className: 'text-lg font-semibold',
            children: 'Feedback Atoms',
          },
        },
        {
          id: 'feedback-atoms-row',
          type: 'div',
          props: {
            className: 'flex flex-wrap items-center gap-6',
          },
          children: [
            {
              id: 'feedback-atoms-status-icon',
              type: 'StatusIcon',
              props: {
                animate: true,
                size: 18,
              },
              bindings: {
                type: {
                  source: 'statusType',
                  sourceType: 'data',
                },
              },
            },
            {
              id: 'feedback-atoms-badge-wrapper',
              type: 'div',
              props: {
                className: 'relative h-10 w-10 rounded-full bg-muted',
              },
              children: [
                {
                  id: 'feedback-atoms-error-badge',
                  type: 'ErrorBadge',
                  props: {
                    variant: 'destructive',
                    size: 'md',
                  },
                  bindings: {
                    count: {
                      source: 'errorCount',
                      sourceType: 'data',
                    },
                  },
                },
              ],
            },
          ],
        },
        {
          id: 'feedback-atoms-notification',
          type: 'Notification',
          props: {
            type: 'info',
            title: 'Heads up!',
            message: 'You have unsent changes ready to sync.',
          },
          conditional: {
            if: 'data.showNotification',
          },
          events: {
            onClose: {
              actions: [
                {
                  id: 'dismiss-notification',
                  type: 'set-value',
                  target: 'showNotification',
                  value: false,
                },
              ],
            },
          },
        },
      ],
    },
  ],
}
