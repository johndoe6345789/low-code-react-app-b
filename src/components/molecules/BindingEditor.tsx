import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Binding, DataSource } from '@/types/json-ui'
import { BindingIndicator } from '@/components/atoms/BindingIndicator'
import { Plus, X } from '@phosphor-icons/react'

interface BindingEditorProps {
  bindings: Record<string, Binding>
  dataSources: DataSource[]
  availableProps: string[]
  onChange: (bindings: Record<string, Binding>) => void
}

export function BindingEditor({ bindings, dataSources, availableProps, onChange }: BindingEditorProps) {
  const [selectedProp, setSelectedProp] = useState('')
  const [selectedSource, setSelectedSource] = useState('')
  const [path, setPath] = useState('')

  const addBinding = () => {
    if (!selectedProp || !selectedSource) return

    const newBindings = {
      ...bindings,
      [selectedProp]: {
        source: selectedSource,
        ...(path && { path }),
      },
    }

    onChange(newBindings)
    setSelectedProp('')
    setSelectedSource('')
    setPath('')
  }

  const removeBinding = (prop: string) => {
    const newBindings = { ...bindings }
    delete newBindings[prop]
    onChange(newBindings)
  }

  const boundProps = Object.keys(bindings)
  const unboundProps = availableProps.filter(p => !boundProps.includes(p))

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium">Bound Properties</Label>
        {boundProps.length === 0 ? (
          <p className="text-sm text-muted-foreground">No bindings yet</p>
        ) : (
          <div className="space-y-2">
            {boundProps.map(prop => (
              <div key={prop} className="flex items-center justify-between p-2 bg-muted/30 rounded border border-border">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono">{prop}</span>
                  <span className="text-muted-foreground">→</span>
                  <BindingIndicator 
                    sourceId={bindings[prop].source} 
                    path={bindings[prop].path}
                  />
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeBinding(prop)}
                  className="h-6 w-6 p-0"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {unboundProps.length > 0 && (
        <div className="space-y-3 pt-3 border-t border-border">
          <Label className="text-sm font-medium">Add New Binding</Label>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Property</Label>
              <Select value={selectedProp} onValueChange={setSelectedProp}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select property" />
                </SelectTrigger>
                <SelectContent>
                  {unboundProps.map(prop => (
                    <SelectItem key={prop} value={prop}>{prop}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Data Source</Label>
              <Select value={selectedSource} onValueChange={setSelectedSource}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  {dataSources.map(ds => (
                    <SelectItem key={ds.id} value={ds.id}>{ds.id}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Path (optional)</Label>
            <Input
              placeholder="e.g., user.name"
              value={path}
              onChange={(e) => setPath(e.target.value)}
              className="h-9 font-mono text-sm"
            />
          </div>

          <Button
            size="sm"
            onClick={addBinding}
            disabled={!selectedProp || !selectedSource}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Binding
          </Button>
        </div>
      )}
    </div>
  )
}
