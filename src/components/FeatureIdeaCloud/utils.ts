export function dispatchConnectionCountUpdate(nodeId: string, counts: Record<string, number>) {
  const event = new CustomEvent('updateConnectionCounts', {
    detail: { nodeId, counts }
  })
  window.dispatchEvent(event)
}

export function dispatchEditIdea(idea: any) {
  const event = new CustomEvent('editIdea', { detail: idea })
  window.dispatchEvent(event)
}

export function dispatchEditGroup(group: any) {
  const event = new CustomEvent('editGroup', { detail: group })
  window.dispatchEvent(event)
}
