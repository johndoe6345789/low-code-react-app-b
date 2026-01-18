import { FeatureIdea } from './types'

export function dispatchEditIdea(idea: FeatureIdea) {
  const event = new CustomEvent('editIdea', { detail: idea })
  window.dispatchEvent(event)
}
