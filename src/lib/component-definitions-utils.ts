import { ComponentType } from '@/types/json-ui'
import componentDefinitionsData from '@/lib/component-definitions.json'

export interface ComponentDefinition {
  type: ComponentType
  label: string
  category: 'layout' | 'input' | 'display' | 'navigation' | 'feedback' | 'data' | 'custom'
  icon: string
  defaultProps?: Record<string, any>
  canHaveChildren?: boolean
}

export const componentDefinitions = componentDefinitionsData as ComponentDefinition[]

export function getCategoryComponents(category: string): ComponentDefinition[] {
  return componentDefinitions.filter(component => component.category === category)
}

export function getComponentDef(type: ComponentType): ComponentDefinition | undefined {
  return componentDefinitions.find(component => component.type === type)
}
