import { PageSchema } from '@/types/json-ui'
import * as computeFunctions from './compute-functions'

type ComputeFunctionMap = typeof computeFunctions

export function hydrateSchema(jsonSchema: any): PageSchema {
  const schema = { ...jsonSchema }

  if (schema.dataSources) {
    schema.dataSources = schema.dataSources.map((ds: any) => {
      if (ds.type === 'computed' && typeof ds.compute === 'string') {
        const functionName = ds.compute as keyof ComputeFunctionMap
        const computeFunction = computeFunctions[functionName]
        if (!computeFunction) {
          console.warn(`Compute function "${functionName}" not found`)
        }
        return {
          ...ds,
          compute: computeFunction || (() => null)
        }
      }
      return ds
    })
  }

  if (schema.components) {
    schema.components = hydrateComponents(schema.components)
  }

  return schema as PageSchema
}

function hydrateComponents(components: any[]): any[] {
  return components.map(component => {
    const hydratedComponent = { ...component }

    if (component.events) {
      hydratedComponent.events = component.events.map((event: any) => {
        const hydratedEvent = { ...event }

        if (event.condition && typeof event.condition === 'string') {
          const functionName = event.condition as keyof ComputeFunctionMap
          const conditionFunction = computeFunctions[functionName]
          hydratedEvent.condition = conditionFunction || (() => false)
        }

        if (event.actions) {
          hydratedEvent.actions = event.actions.map((action: any) => {
            if (action.compute && typeof action.compute === 'string') {
              const functionName = action.compute as keyof ComputeFunctionMap
              const computeFunction = computeFunctions[functionName]
              return {
                ...action,
                compute: computeFunction || (() => null)
              }
            }
            return action
          })
        }

        return hydratedEvent
      })
    }

    if (component.bindings) {
      const hydratedBindings: Record<string, any> = {}
      for (const [key, binding] of Object.entries(component.bindings)) {
        const b = binding as any
        if (b.transform && typeof b.transform === 'string') {
          const functionName = b.transform as keyof ComputeFunctionMap
          const transformFunction = computeFunctions[functionName]
          hydratedBindings[key] = {
            ...b,
            transform: transformFunction || ((x: any) => x)
          }
        } else {
          hydratedBindings[key] = b
        }
      }
      hydratedComponent.bindings = hydratedBindings
    }

    if (component.children) {
      hydratedComponent.children = hydrateComponents(component.children)
    }

    return hydratedComponent
  })
}
