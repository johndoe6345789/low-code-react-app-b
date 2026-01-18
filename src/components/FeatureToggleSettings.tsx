import { PageRenderer } from '@/lib/json-ui/page-renderer'
import { FeatureToggles } from '@/types/project'
import { useMemo } from 'react'
import featureToggleSchema from '@/schemas/feature-toggle-settings.json'
import type { PageSchema } from '@/types/json-ui'
import { evaluateExpression } from '@/lib/json-ui/expression-evaluator'

interface FeatureToggleSettingsProps {
  features: FeatureToggles
  onFeaturesChange: (features: FeatureToggles) => void
}

/**
 * FeatureToggleSettings - Now JSON-driven!
 * 
 * This component demonstrates how a complex React component with:
 * - Custom hooks and state management
 * - Dynamic data rendering (looping over features)
 * - Event handlers (toggle switches)
 * - Conditional styling (enabled/disabled states)
 * 
 * Can be converted to a pure JSON schema with custom action handlers.
 * The JSON schema handles all UI structure, data binding, and loops,
 * while custom functions handle business logic.
 * 
 * Converted from 153 lines of React/TSX to:
 * - 1 JSON schema file (195 lines, but mostly structure)
 * - 45 lines of integration code (this file)
 * 
 * Benefits:
 * - UI structure is now data-driven and can be modified without code changes
 * - Feature list is in JSON and can be easily extended
 * - Styling and layout can be customized via JSON
 * - Business logic (toggle handler) stays in TypeScript for type safety
 */
export function FeatureToggleSettings({ features, onFeaturesChange }: FeatureToggleSettingsProps) {
  // Custom action handler - this is the "hook" that handles complex logic
  const handlers = useMemo(() => ({
    updateFeature: (action: any, eventData: any) => {
      // Evaluate the params to get the actual values
      const context = { data: { features, item: eventData.item }, event: eventData }
      
      // The key param is an expression like "item.key" which needs evaluation
      const key = evaluateExpression(action.params.key, context) as keyof FeatureToggles
      const checked = eventData as boolean
      
      onFeaturesChange({
        ...features,
        [key]: checked,
      })
    }
  }), [features, onFeaturesChange])

  // Pass features as external data to the JSON renderer
  const data = useMemo(() => ({ features }), [features])

  return (
    <PageRenderer 
      schema={featureToggleSchema as PageSchema} 
      data={data}
      functions={handlers}
    />
  )
}
