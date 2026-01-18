import { useCallback } from 'react'
import { PageSchema } from '@/types/json-ui'
import { useDataSources } from '@/hooks/data/use-data-sources'
import { useActionExecutor } from '@/hooks/ui/use-action-executor'
import { ComponentRenderer } from './component-renderer'

interface PageRendererProps {
  schema: PageSchema
  onCustomAction?: (action: any, event?: any) => Promise<void>
}

export function PageRenderer({ schema, onCustomAction }: PageRendererProps) {
  const { data, updateData, updatePath } = useDataSources(schema.dataSources)
  
  const context = {
    data,
    updateData,
    executeAction: onCustomAction || (async () => {}),
  }
  
  const { executeActions } = useActionExecutor(context)
  
  const handleEvent = useCallback((_componentId: string, handler: { actions: any[] }, eventData: any) => {
    if (!handler?.actions?.length) return
    executeActions(handler.actions, eventData)
  }, [executeActions])
  
  return (
    <div className="h-full w-full">
      {schema.components.map((component, index) => (
        <ComponentRenderer
          key={component.id || index}
          component={component}
          data={data}
          onEvent={handleEvent}
        />
      ))}
    </div>
  )
}
