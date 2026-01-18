import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Trash } from '@phosphor-icons/react'
import { Edge } from 'reactflow'
import { FeatureIdea, IdeaEdgeData } from '../types'

type EdgeDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedEdge: Edge<IdeaEdgeData> | null
  safeIdeas: FeatureIdea[]
  setSelectedEdge: (edge: Edge<IdeaEdgeData> | null) => void
  onDelete: (edgeId: string) => void
  onSave: () => void
}

export const EdgeDialog = ({
  open,
  onOpenChange,
  selectedEdge,
  safeIdeas,
  setSelectedEdge,
  onDelete,
  onSave,
}: EdgeDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Connection Details</DialogTitle>
        <DialogDescription>Manage the relationship between ideas</DialogDescription>
      </DialogHeader>

      {selectedEdge && selectedEdge.data && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground">From</label>
              <p className="text-sm font-medium">{safeIdeas.find((idea) => idea.id === selectedEdge.source)?.title}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">To</label>
              <p className="text-sm font-medium">{safeIdeas.find((idea) => idea.id === selectedEdge.target)?.title}</p>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Label</label>
            <Input
              value={selectedEdge.data?.label || ''}
              onChange={(e) =>
                setSelectedEdge({
                  ...selectedEdge,
                  data: {
                    ...selectedEdge.data!,
                    label: e.target.value,
                  },
                })
              }
              placeholder="relates to"
            />
          </div>

          <div className="p-3 bg-muted rounded-lg text-sm">
            <p className="font-medium mb-2">💡 Connection Info:</p>
            <p className="text-xs text-muted-foreground">
              Each connection point can have exactly one arrow. Creating a new connection from an occupied point will
              automatically remap the existing connection.
            </p>
          </div>
        </div>
      )}

      <DialogFooter>
        <div className="flex justify-between w-full">
          <Button variant="destructive" onClick={() => selectedEdge && onDelete(selectedEdge.id)}>
            <Trash size={16} className="mr-2" />
            Delete
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={onSave}>Save</Button>
          </div>
        </div>
      </DialogFooter>
    </DialogContent>
  </Dialog>
)
