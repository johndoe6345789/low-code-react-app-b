import type { UIComponent } from '@/types/json-ui'

export const componentBindingDialogDefinition: UIComponent = {
  id: 'component-binding-dialog',
  type: 'Dialog',
  bindings: {
    open: 'open',
    onOpenChange: 'onOpenChange',
  },
  children: [
    {
      id: 'component-binding-dialog-content',
      type: 'DialogContent',
      bindings: {
        className: 'contentClassName',
      },
      children: [
        {
          id: 'component-binding-dialog-header',
          type: 'DialogHeader',
          children: [
            {
              id: 'component-binding-dialog-title',
              type: 'DialogTitle',
              bindings: {
                children: 'title',
              },
            },
            {
              id: 'component-binding-dialog-description',
              type: 'DialogDescription',
              bindings: {
                children: 'description',
              },
            },
          ],
        },
        {
          id: 'component-binding-dialog-info',
          type: 'div',
          props: {
            className: 'rounded-md border border-border bg-muted/30 p-3 text-sm',
          },
          conditional: {
            if: 'componentType || componentId',
          },
          children: [
            {
              id: 'component-binding-dialog-type',
              type: 'div',
              props: {
                className: 'flex items-center gap-2',
              },
              conditional: {
                if: 'componentType',
              },
              children: [
                {
                  id: 'component-binding-dialog-type-label',
                  type: 'span',
                  props: {
                    className: 'text-muted-foreground',
                  },
                  children: 'Component:',
                },
                {
                  id: 'component-binding-dialog-type-value',
                  type: 'span',
                  props: {
                    className: 'font-mono font-medium',
                  },
                  bindings: {
                    children: 'componentType',
                  },
                },
              ],
            },
            {
              id: 'component-binding-dialog-id',
              type: 'div',
              props: {
                className: 'flex items-center gap-2',
              },
              conditional: {
                if: 'componentId',
              },
              children: [
                {
                  id: 'component-binding-dialog-id-label',
                  type: 'span',
                  props: {
                    className: 'text-muted-foreground',
                  },
                  children: 'ID:',
                },
                {
                  id: 'component-binding-dialog-id-value',
                  type: 'span',
                  props: {
                    className: 'font-mono text-xs',
                  },
                  bindings: {
                    children: 'componentId',
                  },
                },
              ],
            },
          ],
        },
        {
          id: 'component-binding-dialog-body',
          type: 'div',
          props: {
            className: 'space-y-4',
          },
          children: [
            {
              id: 'component-binding-dialog-empty',
              type: 'p',
              props: {
                className: 'text-sm text-muted-foreground',
              },
              bindings: {
                children: 'emptyMessage',
              },
              conditional: {
                if: '!bindingFields || bindingFields.length === 0',
              },
            },
            {
              id: 'component-binding-dialog-fields',
              type: 'div',
              props: {
                className: 'space-y-4',
              },
              conditional: {
                if: 'bindingFields && bindingFields.length > 0',
              },
              loop: {
                source: 'bindingFields',
                itemVar: 'field',
              },
              children: [
                {
                  id: 'component-binding-dialog-field',
                  type: 'div',
                  props: {
                    className: 'space-y-2',
                  },
                  children: [
                    {
                      id: 'component-binding-dialog-field-label',
                      type: 'Label',
                      bindings: {
                        children: 'field.label',
                      },
                    },
                    {
                      id: 'component-binding-dialog-field-input',
                      type: 'Input',
                      bindings: {
                        value: 'field.value',
                        placeholder: 'field.placeholder',
                        onChange: 'onBindingFieldChange',
                        'data-field-id': 'field.id',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: 'component-binding-dialog-footer',
          type: 'DialogFooter',
          children: [
            {
              id: 'component-binding-dialog-cancel',
              type: 'Button',
              props: {
                variant: 'outline',
              },
              bindings: {
                onClick: 'onCancel',
                children: 'cancelLabel',
              },
            },
            {
              id: 'component-binding-dialog-save',
              type: 'Button',
              bindings: {
                onClick: 'onSave',
                children: 'saveLabel',
              },
            },
          ],
        },
      ],
    },
  ],
}

export const dataSourceEditorDialogDefinition: UIComponent = {
  id: 'data-source-editor-dialog',
  type: 'Dialog',
  bindings: {
    open: 'open',
    onOpenChange: 'onOpenChange',
  },
  children: [
    {
      id: 'data-source-editor-dialog-content',
      type: 'DialogContent',
      bindings: {
        className: 'contentClassName',
      },
      children: [
        {
          id: 'data-source-editor-dialog-header',
          type: 'DialogHeader',
          children: [
            {
              id: 'data-source-editor-dialog-title',
              type: 'DialogTitle',
              bindings: {
                children: 'title',
              },
            },
            {
              id: 'data-source-editor-dialog-description',
              type: 'DialogDescription',
              bindings: {
                children: 'description',
              },
            },
          ],
        },
        {
          id: 'data-source-editor-dialog-body',
          type: 'div',
          props: {
            className: 'space-y-4',
          },
          children: [
            {
              id: 'data-source-editor-dialog-empty',
              type: 'p',
              props: {
                className: 'text-sm text-muted-foreground',
              },
              bindings: {
                children: 'emptyMessage',
              },
              conditional: {
                if: '!fields || fields.length === 0',
              },
            },
            {
              id: 'data-source-editor-dialog-fields',
              type: 'div',
              props: {
                className: 'space-y-4',
              },
              conditional: {
                if: 'fields && fields.length > 0',
              },
              loop: {
                source: 'fields',
                itemVar: 'field',
              },
              children: [
                {
                  id: 'data-source-editor-dialog-field',
                  type: 'div',
                  props: {
                    className: 'space-y-2',
                  },
                  children: [
                    {
                      id: 'data-source-editor-dialog-field-label',
                      type: 'Label',
                      bindings: {
                        children: 'field.label',
                      },
                    },
                    {
                      id: 'data-source-editor-dialog-field-input',
                      type: 'Input',
                      bindings: {
                        value: 'field.value',
                        placeholder: 'field.placeholder',
                        onChange: 'onFieldChange',
                        'data-field-id': 'field.id',
                      },
                    },
                    {
                      id: 'data-source-editor-dialog-field-helper',
                      type: 'p',
                      props: {
                        className: 'text-xs text-muted-foreground',
                      },
                      bindings: {
                        children: 'field.helperText',
                      },
                      conditional: {
                        if: 'field.helperText',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: 'data-source-editor-dialog-footer',
          type: 'DialogFooter',
          children: [
            {
              id: 'data-source-editor-dialog-cancel',
              type: 'Button',
              props: {
                variant: 'outline',
              },
              bindings: {
                onClick: 'onCancel',
                children: 'cancelLabel',
              },
            },
            {
              id: 'data-source-editor-dialog-save',
              type: 'Button',
              bindings: {
                onClick: 'onSave',
                children: 'saveLabel',
              },
            },
          ],
        },
      ],
    },
  ],
}

export const gitHubBuildStatusDefinition: UIComponent = {
  id: 'github-build-status-card',
  type: 'Card',
  bindings: {
    className: 'className',
  },
  children: [
    {
      id: 'github-build-status-header',
      type: 'CardHeader',
      children: [
        {
          id: 'github-build-status-title',
          type: 'CardTitle',
          props: {
            className: 'flex items-center gap-2',
          },
          bindings: {
            children: 'title',
          },
        },
        {
          id: 'github-build-status-description',
          type: 'CardDescription',
          bindings: {
            children: 'description',
          },
        },
      ],
    },
    {
      id: 'github-build-status-content',
      type: 'CardContent',
      props: {
        className: 'space-y-4',
      },
      children: [
        {
          id: 'github-build-status-loading',
          type: 'p',
          props: {
            className: 'text-sm text-muted-foreground',
          },
          bindings: {
            children: 'loadingMessage',
          },
          conditional: {
            if: 'isLoading',
          },
        },
        {
          id: 'github-build-status-error',
          type: 'div',
          props: {
            className: 'flex items-center gap-2 text-sm text-red-500',
          },
          conditional: {
            if: 'errorMessage',
          },
          children: [
            {
              id: 'github-build-status-error-text',
              type: 'span',
              bindings: {
                children: 'errorMessage',
              },
            },
          ],
        },
        {
          id: 'github-build-status-empty',
          type: 'p',
          props: {
            className: 'text-sm text-muted-foreground',
          },
          bindings: {
            children: 'emptyMessage',
          },
          conditional: {
            if: '!isLoading && !errorMessage && !hasWorkflows',
          },
        },
        {
          id: 'github-build-status-list',
          type: 'div',
          props: {
            className: 'space-y-3',
          },
          conditional: {
            if: 'hasWorkflows',
          },
          loop: {
            source: 'workflows',
            itemVar: 'workflow',
          },
          children: [
            {
              id: 'github-build-status-item',
              type: 'div',
              props: {
                className: 'flex items-center justify-between gap-3 rounded-lg border border-border p-3',
              },
              children: [
                {
                  id: 'github-build-status-item-info',
                  type: 'div',
                  props: {
                    className: 'min-w-0',
                  },
                  children: [
                    {
                      id: 'github-build-status-item-row',
                      type: 'div',
                      props: {
                        className: 'flex items-center gap-2',
                      },
                      children: [
                        {
                          id: 'github-build-status-item-name',
                          type: 'p',
                          props: {
                            className: 'text-sm font-medium truncate',
                          },
                          bindings: {
                            children: 'workflow.name',
                          },
                        },
                        {
                          id: 'github-build-status-item-badge',
                          type: 'Badge',
                          bindings: {
                            className: 'workflow.statusClass',
                            children: 'workflow.statusLabel',
                          },
                        },
                      ],
                    },
                    {
                      id: 'github-build-status-item-meta',
                      type: 'div',
                      props: {
                        className: 'text-xs text-muted-foreground truncate',
                      },
                      bindings: {
                        children: 'workflow.summaryLine',
                      },
                    },
                  ],
                },
                {
                  id: 'github-build-status-item-link',
                  type: 'Button',
                  props: {
                    variant: 'ghost',
                    size: 'sm',
                    asChild: true,
                  },
                  conditional: {
                    if: 'workflow.url',
                  },
                  children: [
                    {
                      id: 'github-build-status-item-anchor',
                      type: 'a',
                      bindings: {
                        href: 'workflow.url',
                      },
                      props: {
                        target: '_blank',
                        rel: 'noopener noreferrer',
                      },
                      children: 'View',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: 'github-build-status-footer',
          type: 'Button',
          props: {
            variant: 'outline',
            size: 'sm',
            asChild: true,
            className: 'w-full',
          },
          conditional: {
            if: 'footerLinkUrl',
          },
          children: [
            {
              id: 'github-build-status-footer-anchor',
              type: 'a',
              bindings: {
                href: 'footerLinkUrl',
                children: 'footerLinkLabel',
              },
              props: {
                target: '_blank',
                rel: 'noopener noreferrer',
              },
            },
          ],
        },
      ],
    },
  ],
}
