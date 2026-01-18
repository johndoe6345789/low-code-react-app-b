import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Trash } from '@phosphor-icons/react'
import { CATEGORIES, PRIORITIES, STATUSES } from '../constants'
import { FeatureIdea, IdeaGroup } from '../types'

type IdeaEditDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedIdea: FeatureIdea | null
  ideas: FeatureIdea[] | null
  safeGroups: IdeaGroup[]
  setSelectedIdea: (idea: FeatureIdea | null) => void
  onSave: () => void
  onDelete: (id: string) => void
}

export const IdeaEditDialog = ({
  open,
  onOpenChange,
  selectedIdea,
  ideas,
  safeGroups,
  setSelectedIdea,
  onSave,
  onDelete,
}: IdeaEditDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>{selectedIdea?.title ? 'Edit Idea' : 'New Idea'}</DialogTitle>
        <DialogDescription>Create or modify a feature idea for your app</DialogDescription>
      </DialogHeader>

      {selectedIdea && (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Title</label>
            <Input
              value={selectedIdea.title}
              onChange={(e) => setSelectedIdea({ ...selectedIdea, title: e.target.value })}
              placeholder="Feature name..."
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Description</label>
            <Textarea
              value={selectedIdea.description}
              onChange={(e) => setSelectedIdea({ ...selectedIdea, description: e.target.value })}
              placeholder="Describe the feature..."
              rows={4}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Category</label>
              <select
                value={selectedIdea.category}
                onChange={(e) => setSelectedIdea({ ...selectedIdea, category: e.target.value })}
                className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm"
              >
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Priority</label>
              <select
                value={selectedIdea.priority}
                onChange={(e) => setSelectedIdea({ ...selectedIdea, priority: e.target.value as FeatureIdea['priority'] })}
                className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm"
              >
                {PRIORITIES.map((priority) => (
                  <option key={priority} value={priority}>
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Status</label>
              <select
                value={selectedIdea.status}
                onChange={(e) => setSelectedIdea({ ...selectedIdea, status: e.target.value as FeatureIdea['status'] })}
                className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm"
              >
                {STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Group</label>
            <select
              value={selectedIdea.parentGroup || ''}
              onChange={(e) => setSelectedIdea({ ...selectedIdea, parentGroup: e.target.value || undefined })}
              className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm"
            >
              <option value="">No group</option>
              {safeGroups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      <DialogFooter>
        <div className="flex justify-between w-full">
          <div>
            {selectedIdea && (ideas || []).find((idea) => idea.id === selectedIdea.id) && (
              <Button variant="destructive" onClick={() => onDelete(selectedIdea.id)}>
                <Trash size={16} className="mr-2" />
                Delete
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={onSave}>Save Idea</Button>
          </div>
        </div>
      </DialogFooter>
    </DialogContent>
  </Dialog>
)
