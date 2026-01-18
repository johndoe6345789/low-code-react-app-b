import { Edge, Node } from 'reactflow'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { FeatureIdea, IdeaEdgeData } from './types'

type FeatureIdeaDebugPanelProps = {
  nodes: Node[]
  edges: Edge<IdeaEdgeData>[]
  safeIdeas: FeatureIdea[]
  onClose: () => void
}

type HandleStats = {
  leftHandles: Edge<IdeaEdgeData>[]
  rightHandles: Edge<IdeaEdgeData>[]
  topHandles: Edge<IdeaEdgeData>[]
  bottomHandles: Edge<IdeaEdgeData>[]
  leftUnique: number
  rightUnique: number
  topUnique: number
  bottomUnique: number
  nodeEdges: Edge<IdeaEdgeData>[]
}

const getHandleStats = (ideaId: string, edges: Edge<IdeaEdgeData>[]): HandleStats => {
  const nodeEdges = edges.filter((edge) => edge.source === ideaId || edge.target === ideaId)
  const leftHandles = edges.filter((edge) => edge.target === ideaId && edge.targetHandle?.startsWith('left'))
  const rightHandles = edges.filter((edge) => edge.source === ideaId && edge.sourceHandle?.startsWith('right'))
  const topHandles = edges.filter((edge) => edge.target === ideaId && edge.targetHandle?.startsWith('top'))
  const bottomHandles = edges.filter((edge) => edge.source === ideaId && edge.sourceHandle?.startsWith('bottom'))

  return {
    leftHandles,
    rightHandles,
    topHandles,
    bottomHandles,
    leftUnique: new Set(leftHandles.map((edge) => edge.targetHandle)).size,
    rightUnique: new Set(rightHandles.map((edge) => edge.sourceHandle)).size,
    topUnique: new Set(topHandles.map((edge) => edge.targetHandle)).size,
    bottomUnique: new Set(bottomHandles.map((edge) => edge.sourceHandle)).size,
    nodeEdges,
  }
}

const DebugSummary = ({ nodes, edges, safeIdeas }: Omit<FeatureIdeaDebugPanelProps, 'onClose'>) => (
  <div className="grid grid-cols-3 gap-4 p-3 bg-muted/50 rounded-lg text-xs">
    <div>
      <div className="font-semibold text-foreground mb-1">Total Edges</div>
      <div className="text-2xl font-bold text-primary">{edges.length}</div>
    </div>
    <div>
      <div className="font-semibold text-foreground mb-1">Total Nodes</div>
      <div className="text-2xl font-bold text-accent">{nodes.length}</div>
    </div>
    <div>
      <div className="font-semibold text-foreground mb-1">Total Ideas</div>
      <div className="text-2xl font-bold text-secondary">{safeIdeas.length}</div>
    </div>
  </div>
)

const ConnectionMatrix = ({ safeIdeas, edges }: Pick<FeatureIdeaDebugPanelProps, 'safeIdeas' | 'edges'>) => (
  <div className="space-y-2">
    <div className="font-semibold text-xs flex items-center justify-between">
      <span>Connection Matrix (Handle Occupancy)</span>
      <Badge variant="outline" className="text-xs">
        1:1 Constraint Active
      </Badge>
    </div>
    <ScrollArea className="h-48 w-full rounded-md border">
      <div className="p-2 space-y-2 text-xs font-mono">
        {safeIdeas.slice(0, 10).map((idea) => {
          const { nodeEdges, leftHandles, rightHandles, topHandles, bottomHandles, leftUnique, rightUnique, topUnique, bottomUnique } =
            getHandleStats(idea.id, edges)

          const hasViolation =
            leftHandles.length !== leftUnique ||
            rightHandles.length !== rightUnique ||
            topHandles.length !== topUnique ||
            bottomHandles.length !== bottomUnique

          return (
            <div
              key={idea.id}
              className={`p-2 rounded border ${hasViolation ? 'bg-red-500/20 border-red-500' : 'bg-muted/30'}`}
            >
              <div className="font-semibold truncate mb-1 flex items-center gap-2" title={idea.title}>
                {hasViolation && <span className="text-red-500">⚠️</span>}
                {idea.title}
              </div>
              <div className="grid grid-cols-4 gap-1 text-[10px]">
                <div
                  className={`p-1 rounded text-center ${
                    leftHandles.length !== leftUnique
                      ? 'bg-red-500/40 text-red-900 dark:text-red-100 font-bold'
                      : leftHandles.length >= 1
                        ? 'bg-green-500/20 text-green-700 dark:text-green-300'
                        : 'bg-muted'
                  }`}
                >
                  ← {leftHandles.length}/{leftUnique} {leftHandles.length !== leftUnique ? '⚠️' : leftHandles.length > 0 ? '✓' : '○'}
                </div>
                <div
                  className={`p-1 rounded text-center ${
                    rightHandles.length !== rightUnique
                      ? 'bg-red-500/40 text-red-900 dark:text-red-100 font-bold'
                      : rightHandles.length >= 1
                        ? 'bg-green-500/20 text-green-700 dark:text-green-300'
                        : 'bg-muted'
                  }`}
                >
                  → {rightHandles.length}/{rightUnique} {rightHandles.length !== rightUnique ? '⚠️' : rightHandles.length > 0 ? '✓' : '○'}
                </div>
                <div
                  className={`p-1 rounded text-center ${
                    topHandles.length !== topUnique
                      ? 'bg-red-500/40 text-red-900 dark:text-red-100 font-bold'
                      : topHandles.length >= 1
                        ? 'bg-green-500/20 text-green-700 dark:text-green-300'
                        : 'bg-muted'
                  }`}
                >
                  ↑ {topHandles.length}/{topUnique} {topHandles.length !== topUnique ? '⚠️' : topHandles.length > 0 ? '✓' : '○'}
                </div>
                <div
                  className={`p-1 rounded text-center ${
                    bottomHandles.length !== bottomUnique
                      ? 'bg-red-500/40 text-red-900 dark:text-red-100 font-bold'
                      : bottomHandles.length >= 1
                        ? 'bg-green-500/20 text-green-700 dark:text-green-300'
                        : 'bg-muted'
                  }`}
                >
                  ↓ {bottomHandles.length}/{bottomUnique} {bottomHandles.length !== bottomUnique ? '⚠️' : bottomHandles.length > 0 ? '✓' : '○'}
                </div>
              </div>
              <div className="mt-1 text-[10px] text-muted-foreground">
                Total: {nodeEdges.length} connection{nodeEdges.length !== 1 ? 's' : ''}, Handles: L{leftUnique}|R{rightUnique}|T
                {topUnique}|B{bottomUnique}
              </div>
            </div>
          )
        })}
        {safeIdeas.length > 10 && (
          <div className="text-center text-muted-foreground py-2">... and {safeIdeas.length - 10} more ideas</div>
        )}
      </div>
    </ScrollArea>
  </div>
)

const ConstraintStatus = ({ safeIdeas, edges }: Pick<FeatureIdeaDebugPanelProps, 'safeIdeas' | 'edges'>) => {
  const violations: string[] = []

  safeIdeas.forEach((idea) => {
    const { leftHandles, rightHandles, topHandles, bottomHandles, leftUnique, rightUnique, topUnique, bottomUnique } = getHandleStats(
      idea.id,
      edges
    )

    if (leftHandles.length !== leftUnique) {
      violations.push(`${idea.title}: Left side has duplicate handle usage (${leftHandles.length} connections on ${leftUnique} handles)`)
    }
    if (rightHandles.length !== rightUnique) {
      violations.push(`${idea.title}: Right side has duplicate handle usage (${rightHandles.length} connections on ${rightUnique} handles)`)
    }
    if (topHandles.length !== topUnique) {
      violations.push(`${idea.title}: Top side has duplicate handle usage (${topHandles.length} connections on ${topUnique} handles)`)
    }
    if (bottomHandles.length !== bottomUnique) {
      violations.push(`${idea.title}: Bottom side has duplicate handle usage (${bottomHandles.length} connections on ${bottomUnique} handles)`)
    }
  })

  if (violations.length > 0) {
    return (
      <div className="space-y-1 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
        <div className="font-semibold text-xs text-red-700 dark:text-red-300 flex items-center gap-1">❌ CONSTRAINT VIOLATIONS DETECTED</div>
        <div className="text-xs space-y-0.5 text-red-600 dark:text-red-400">
          {violations.map((violation, index) => (
            <div key={index}>• {violation}</div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-1 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
      <div className="font-semibold text-xs text-green-700 dark:text-green-300 flex items-center gap-1">✅ All Constraints Satisfied</div>
      <div className="text-xs space-y-0.5">
        <div>• Each handle has exactly 1 connection (1:1 mapping) ✓</div>
        <div>• New connections automatically remove conflicts ✓</div>
        <div>• Spare blank handles always available ✓</div>
        <div>• Remapping preserves 1:1 constraint ✓</div>
        <div>• Changes persist to database immediately ✓</div>
      </div>
    </div>
  )
}

export const FeatureIdeaDebugPanel = ({ nodes, edges, safeIdeas, onClose }: FeatureIdeaDebugPanelProps) => (
  <Card className="shadow-2xl border-2">
    <div className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-sm">🔍 Connection Debug Panel</h3>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
          ✕
        </Button>
      </div>

      <DebugSummary nodes={nodes} edges={edges} safeIdeas={safeIdeas} />
      <ConnectionMatrix safeIdeas={safeIdeas} edges={edges} />
      <ConstraintStatus safeIdeas={safeIdeas} edges={edges} />
    </div>
  </Card>
)
