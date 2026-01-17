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
  
  const handleEvent = useCallback((componentId: string, event: string, eventData: any) => {
    const component = findComponentById(schema.components, componentId)
    if (!component) return
    
    const handler = component.events?.find(h => h.event === event)
    if (!handler) return
    
    if (handler.condition && !handler.condition(data)) return
    
    executeActions(handler.actions, eventData)
  }, [schema.components, data, executeActions])
  
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

function findComponentById(components: any[], id: string): any {
  for (const component of components) {
    if (component.id === id) return component
    if (component.children) {
      const found = findComponentById(component.children, id)
      if (found) return found
    }
  }
  return null
}
