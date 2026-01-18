import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import type { DataSourceEditorDialogWrapperProps } from './interfaces'

export function DataSourceEditorDialogWrapper({
  open = false,
  title = 'Data Source',
  description = 'Update data source details and fields.',
  fields = [],
  onFieldChange,
  onSave,
  onCancel,
  onOpenChange,
  className,
}: DataSourceEditorDialogWrapperProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn('max-w-2xl', className)}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {fields.length === 0 ? (
            <p className="text-sm text-muted-foreground">No fields configured.</p>
          ) : (
            fields.map((field) => (
              <div key={field.id} className="space-y-2">
                <Label htmlFor={`field-${field.id}`}>{field.label}</Label>
                <Input
                  id={`field-${field.id}`}
                  value={field.value ?? ''}
                  placeholder={field.placeholder}
                  onChange={(event) => onFieldChange?.(field.id, event.target.value)}
                />
                {field.helperText && (
                  <p className="text-xs text-muted-foreground">{field.helperText}</p>
                )}
              </div>
            ))
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
