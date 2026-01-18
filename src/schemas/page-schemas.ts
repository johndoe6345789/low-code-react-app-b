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

export const inputComponentsShowcaseSchema: PageSchema = {
  id: 'input-components-showcase',
  name: 'Input Components Showcase',
  layout: {
    type: 'single',
  },
  dataSources: [
    {
      id: 'selectedDate',
      type: 'static',
      defaultValue: new Date(),
    },
    {
      id: 'uploadedFiles',
      type: 'static',
      defaultValue: [],
    },
  ],
  components: [
    {
      id: 'input-showcase-root',
      type: 'div',
      props: {
        className: 'space-y-6 rounded-lg border border-border bg-card p-6',
      },
      children: [
        {
          id: 'input-showcase-title',
          type: 'Heading',
          props: {
            className: 'text-xl font-semibold',
            children: 'Date Picker & File Upload',
          },
        },
        {
          id: 'input-showcase-date-section',
          type: 'div',
          props: {
            className: 'space-y-3',
          },
          children: [
            {
              id: 'input-showcase-date-label',
              type: 'Text',
              props: {
                className: 'text-sm font-medium text-muted-foreground',
                children: 'Pick a date',
              },
            },
            {
              id: 'input-showcase-date-picker',
              type: 'DatePicker',
              props: {
                placeholder: 'Select a date',
              },
              bindings: {
                value: {
                  source: 'selectedDate',
                },
              },
              events: {
                onChange: {
                  actions: [
                    {
                      id: 'update-selected-date',
                      type: 'set-value',
                      target: 'selectedDate',
                      expression: 'event',
                    },
                  ],
                },
              },
            },
            {
              id: 'input-showcase-date-value',
              type: 'Text',
              props: {
                className: 'text-sm text-muted-foreground',
              },
              bindings: {
                children: {
                  source: 'selectedDate',
                  transform: 'data ? `Selected: ${new Date(data).toLocaleDateString()}` : "Selected: none"',
                },
              },
            },
          ],
        },
        {
          id: 'input-showcase-file-section',
          type: 'div',
          props: {
            className: 'space-y-3',
          },
          children: [
            {
              id: 'input-showcase-file-label',
              type: 'Text',
              props: {
                className: 'text-sm font-medium text-muted-foreground',
                children: 'Upload files',
              },
            },
            {
              id: 'input-showcase-file-upload',
              type: 'FileUpload',
              props: {
                accept: '.pdf,.png,.jpg,.jpeg',
                multiple: true,
                maxSize: 5000000,
              },
              events: {
                onFilesSelected: {
                  actions: [
                    {
                      id: 'update-uploaded-files',
                      type: 'set-value',
                      target: 'uploadedFiles',
                      expression: 'event',
                    },
                  ],
                },
              },
            },
            {
              id: 'input-showcase-file-value',
              type: 'Text',
              props: {
                className: 'text-sm text-muted-foreground',
              },
              bindings: {
                children: {
                  source: 'uploadedFiles',
                  transform: 'Array.isArray(data) && data.length ? `Selected: ${data.map((file) => file.name).join(", ")}` : "Selected: none"',
                },
              },
            },
          ],
        },
      ],
    },
  ],
}
