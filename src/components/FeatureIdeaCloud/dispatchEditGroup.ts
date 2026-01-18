import { IdeaGroup } from './types'

export function dispatchEditGroup(group: IdeaGroup) {
  const event = new CustomEvent('editGroup', { detail: group })
  window.dispatchEvent(event)
}
