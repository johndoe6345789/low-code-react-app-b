import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BindingEditor } from '@/lib/json-ui/json-components'
import { DataSource, UIComponent } from '@/types/json-ui'
import { Link } from '@phosphor-icons/react'
import { useComponentBindingDialog } from '@/hooks/use-component-binding-dialog'

interface ComponentBindingDialogProps {
  open: boolean
  component: UIComponent | null
  dataSources: DataSource[]
  onOpenChange: (open: boolean) => void
  onSave: (component: UIComponent) => void
}

export function ComponentBindingDialog({
  open,
  component,
  dataSources,
  onOpenChange,
  onSave,
}: ComponentBindingDialogProps) {
  const { editingComponent, handleSave, updateBindings } = useComponentBindingDialog({
    component,
    open,
    onOpenChange,
    onSave,
  })

  if (!editingComponent) return null

  const availableProps = ['children', 'value', 'checked', 'className', 'disabled', 'placeholder']

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link className="w-5 h-5" />
            Component Data Bindings
          </DialogTitle>
          <DialogDescription>
            Connect component properties to data sources
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="p-4 bg-muted/30 rounded border border-border">
            <div className="text-sm space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Component:</span>
                <span className="font-mono font-medium">{editingComponent.type}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">ID:</span>
                <span className="font-mono text-xs">{editingComponent.id}</span>
              </div>
            </div>
          </div>

          <Tabs defaultValue="bindings">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="bindings">Property Bindings</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="bindings" className="space-y-4 mt-4">
              <BindingEditor
                bindings={editingComponent.bindings || {}}
                dataSources={dataSources}
                availableProps={availableProps}
                onChange={updateBindings}
              />
            </TabsContent>

            <TabsContent value="preview" className="space-y-4 mt-4">
              <div className="p-4 bg-muted/30 rounded border border-border">
                <pre className="text-xs overflow-auto">
                  {JSON.stringify(editingComponent.bindings, null, 2)}
                </pre>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Bindings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
