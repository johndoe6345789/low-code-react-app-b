import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface TreeFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  name: string
  treeDescription: string
  onNameChange: (name: string) => void
  onDescriptionChange: (description: string) => void
  onSubmit: () => void
  submitLabel?: string
}

export function TreeFormDialog({
  open,
  onOpenChange,
  title,
  description,
  name,
  treeDescription,
  onNameChange,
  onDescriptionChange,
  onSubmit,
  submitLabel = 'Save',
}: TreeFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="tree-name">Tree Name</Label>
            <Input
              id="tree-name"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="e.g., Main App, Dashboard, Admin Panel"
            />
          </div>
          <div>
            <Label htmlFor="tree-description">Description</Label>
            <Textarea
              id="tree-description"
              value={treeDescription}
              onChange={(e) => onDescriptionChange(e.target.value)}
              placeholder="Describe the purpose of this component tree"
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSubmit}>{submitLabel}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
