import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Trash } from '@phosphor-icons/react'
import { GROUP_COLORS } from '../constants'
import { IdeaGroup } from '../types'

type GroupDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedGroup: IdeaGroup | null
  groups: IdeaGroup[] | null
  setSelectedGroup: (group: IdeaGroup | null) => void
  onSave: () => void
  onDelete: (id: string) => void
}

export const GroupDialog = ({
  open,
  onOpenChange,
  selectedGroup,
  groups,
  setSelectedGroup,
  onSave,
  onDelete,
}: GroupDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{selectedGroup?.label ? 'Edit Group' : 'New Group'}</DialogTitle>
        <DialogDescription>Create a container to organize related ideas</DialogDescription>
      </DialogHeader>

      {selectedGroup && (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Group Name</label>
            <Input
              value={selectedGroup.label}
              onChange={(e) => setSelectedGroup({ ...selectedGroup, label: e.target.value })}
              placeholder="e.g., Authentication Features"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Color</label>
            <div className="grid grid-cols-4 gap-2">
              {GROUP_COLORS.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setSelectedGroup({ ...selectedGroup, color: color.value })}
                  className={`h-12 rounded-lg border-2 transition-all hover:scale-105 ${
                    selectedGroup.color === color.value ? 'border-foreground ring-2 ring-primary' : 'border-border'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          <div className="p-3 bg-muted rounded-lg text-sm">
            <p className="font-medium mb-1">💡 Tips:</p>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li>• Groups provide visual organization for related ideas</li>
              <li>• Drag ideas into groups or assign them in the idea editor</li>
              <li>• Ideas stay within their group boundaries when moved</li>
            </ul>
          </div>
        </div>
      )}

      <DialogFooter>
        <div className="flex justify-between w-full">
          <div>
            {selectedGroup && (groups || []).find((group) => group.id === selectedGroup.id) && (
              <Button variant="destructive" onClick={() => onDelete(selectedGroup.id)}>
                <Trash size={16} className="mr-2" />
                Delete
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={onSave}>Save Group</Button>
          </div>
        </div>
      </DialogFooter>
    </DialogContent>
  </Dialog>
)
