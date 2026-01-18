export function dispatchConnectionCountUpdate(nodeId: string, counts: Record<string, number>) {
  const event = new CustomEvent('updateConnectionCounts', {
    detail: { nodeId, counts }
  })
  window.dispatchEvent(event)
}
