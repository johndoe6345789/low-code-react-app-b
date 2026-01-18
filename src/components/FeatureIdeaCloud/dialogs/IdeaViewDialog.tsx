import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { STATUS_COLORS } from '../constants'
import { FeatureIdea, IdeaGroup, IdeaEdgeData } from '../types'
import { Edge } from 'reactflow'

type IdeaViewDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedIdea: FeatureIdea | null
  safeGroups: IdeaGroup[]
  safeIdeas: FeatureIdea[]
  edges: Edge<IdeaEdgeData>[]
  onEdit: () => void
}

export const IdeaViewDialog = ({
  open,
  onOpenChange,
  selectedIdea,
  safeGroups,
  safeIdeas,
  edges,
  onEdit,
}: IdeaViewDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{selectedIdea?.title}</DialogTitle>
      </DialogHeader>

      {selectedIdea && (
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">{selectedIdea.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Category</label>
              <p className="text-sm font-medium">{selectedIdea.category}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Priority</label>
              <p className="text-sm font-medium capitalize">{selectedIdea.priority}</p>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground">Status</label>
            <Badge className={`${STATUS_COLORS[selectedIdea.status]} mt-1`}>{selectedIdea.status}</Badge>
          </div>

          {selectedIdea.parentGroup && (
            <div>
              <label className="text-xs font-medium text-muted-foreground">Group</label>
              <p className="text-sm font-medium">
                {safeGroups.find((group) => group.id === selectedIdea.parentGroup)?.label || 'Unknown'}
              </p>
            </div>
          )}

          <div>
            <label className="text-xs font-medium text-muted-foreground">Created</label>
            <p className="text-sm">{new Date(selectedIdea.createdAt).toLocaleDateString()}</p>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">Connections</label>
            <div className="space-y-2">
              {edges
                .filter((edge) => edge.source === selectedIdea.id || edge.target === selectedIdea.id)
                .map((edge) => {
                  const otherIdeaId = edge.source === selectedIdea.id ? edge.target : edge.source
                  const otherIdea = safeIdeas.find((idea) => idea.id === otherIdeaId)
                  const isOutgoing = edge.source === selectedIdea.id
                  return (
                    <div key={edge.id} className="flex items-center gap-2 text-sm p-2 bg-muted rounded">
                      <span className="flex-1">{isOutgoing ? '→' : '←'} {otherIdea?.title || 'Unknown'}</span>
                      {edge.data?.label && (
                        <Badge variant="outline" className="text-xs">
                          {edge.data.label}
                        </Badge>
                      )}
                    </div>
                  )
                })}
              {edges.filter((edge) => edge.source === selectedIdea.id || edge.target === selectedIdea.id).length === 0 && (
                <p className="text-sm text-muted-foreground">No connections</p>
              )}
            </div>
          </div>
        </div>
      )}

      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Close
        </Button>
        <Button onClick={onEdit}>Edit</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
)
