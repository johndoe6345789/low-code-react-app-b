import { MouseEvent as ReactMouseEvent } from 'react'
import ReactFlow, {
  Background,
  BackgroundVariant,
  ConnectionMode,
  Controls,
  Connection,
  Edge,
  Node,
  Panel,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { FeatureIdea, IdeaEdgeData } from './types'
import { nodeTypes } from './nodes'
import { FeatureIdeaDebugPanel } from './FeatureIdeaDebugPanel'
import { FeatureIdeaTipsPanel } from './FeatureIdeaTipsPanel'
import { FeatureIdeaToolbar } from './FeatureIdeaToolbar'

type FeatureIdeaCanvasProps = {
  nodes: Node[]
  edges: Edge<IdeaEdgeData>[]
  onNodesChangeWrapper: (changes: any) => void
  onEdgesChangeWrapper: (changes: any) => void
  onConnect: (connection: Connection) => void
  onReconnect: (oldEdge: Edge, newConnection: Connection) => void
  onReconnectStart: () => void
  onReconnectEnd: (_: MouseEvent | TouchEvent, edge: Edge) => void
  onEdgeClick: (event: ReactMouseEvent, edge: Edge<IdeaEdgeData>) => void
  onNodeDoubleClick: (event: ReactMouseEvent, node: Node<FeatureIdea>) => void
  debugPanelOpen: boolean
  setDebugPanelOpen: (open: boolean) => void
  handleAddIdea: () => void
  handleAddGroup: () => void
  handleGenerateIdeas: () => void
  safeIdeas: FeatureIdea[]
}

export const FeatureIdeaCanvas = ({
  nodes,
  edges,
  onNodesChangeWrapper,
  onEdgesChangeWrapper,
  onConnect,
  onReconnect,
  onReconnectStart,
  onReconnectEnd,
  onEdgeClick,
  onNodeDoubleClick,
  debugPanelOpen,
  setDebugPanelOpen,
  handleAddIdea,
  handleAddGroup,
  handleGenerateIdeas,
  safeIdeas,
}: FeatureIdeaCanvasProps) => (
  <ReactFlow
    nodes={nodes}
    edges={edges}
    onNodesChange={onNodesChangeWrapper}
    onEdgesChange={onEdgesChangeWrapper}
    onConnect={onConnect}
    onReconnect={onReconnect}
    onReconnectStart={onReconnectStart}
    onReconnectEnd={onReconnectEnd}
    onEdgeClick={onEdgeClick}
    onNodeDoubleClick={onNodeDoubleClick}
    nodeTypes={nodeTypes}
    connectionMode={ConnectionMode.Loose}
    reconnectRadius={20}
    fitView
    minZoom={0.2}
    maxZoom={2}
    proOptions={{ hideAttribution: true }}
    defaultEdgeOptions={{
      type: 'default',
      animated: false,
    }}
  >
    <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="hsl(var(--border))" />
    <Controls showInteractive={false} />

    <FeatureIdeaToolbar
      debugPanelOpen={debugPanelOpen}
      setDebugPanelOpen={setDebugPanelOpen}
      handleGenerateIdeas={handleGenerateIdeas}
      handleAddGroup={handleAddGroup}
      handleAddIdea={handleAddIdea}
    />

    <FeatureIdeaTipsPanel />

    {debugPanelOpen && (
      <Panel position="top-center" className="max-w-2xl">
        <FeatureIdeaDebugPanel nodes={nodes} edges={edges} safeIdeas={safeIdeas} onClose={() => setDebugPanelOpen(false)} />
      </Panel>
    )}
  </ReactFlow>
)
