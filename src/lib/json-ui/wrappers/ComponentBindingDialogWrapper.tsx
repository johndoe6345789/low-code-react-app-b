import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import type { ComponentBindingDialogWrapperProps } from './interfaces'

export function ComponentBindingDialogWrapper({
  open = false,
  title = 'Component Bindings',
  description = 'Connect component props to data sources.',
  componentType,
  componentId,
  bindings = [],
  onBindingChange,
  onSave,
  onCancel,
  onOpenChange,
  className,
}: ComponentBindingDialogWrapperProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn('max-w-2xl', className)}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {(componentType || componentId) && (
          <div className="rounded-md border border-border bg-muted/30 p-3 text-sm">
            {componentType && (
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Component:</span>
                <span className="font-mono font-medium">{componentType}</span>
              </div>
            )}
            {componentId && (
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">ID:</span>
                <span className="font-mono text-xs">{componentId}</span>
              </div>
            )}
          </div>
        )}

        <div className="space-y-4">
          {bindings.length === 0 ? (
            <p className="text-sm text-muted-foreground">No bindings configured.</p>
          ) : (
            bindings.map((binding) => (
              <div key={binding.id} className="space-y-2">
                <Label htmlFor={`binding-${binding.id}`}>{binding.label}</Label>
                <Input
                  id={`binding-${binding.id}`}
                  value={binding.value ?? ''}
                  placeholder={binding.placeholder}
                  onChange={(event) => onBindingChange?.(binding.id, event.target.value)}
                />
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
