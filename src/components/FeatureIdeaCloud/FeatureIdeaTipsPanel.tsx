import { Panel } from 'reactflow'

export const FeatureIdeaTipsPanel = () => (
  <Panel position="bottom-right">
    <div className="bg-card border border-border rounded-lg shadow-lg p-2 text-xs text-muted-foreground max-w-sm">
      <p className="mb-1">
        💡 <strong>Tip:</strong> Double-click ideas to view details
      </p>
      <p className="mb-1">📦 Create groups to organize related ideas</p>
      <p className="mb-1">🔗 Drag from handles on card edges to connect ideas</p>
      <p className="mb-1">↪️ Drag existing connection ends to remap them</p>
      <p>⚙️ Click connections to edit or delete them</p>
    </div>
  </Panel>
)
