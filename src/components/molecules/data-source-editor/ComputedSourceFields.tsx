import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { DataSource } from '@/types/json-ui'
import { X } from '@phosphor-icons/react'

interface ComputedSourceFieldsCopy {
  computeLabel: string
  computePlaceholder: string
  computeHelp: string
  dependenciesLabel: string
  availableSourcesLabel: string
  emptyDependencies: string
}

interface ComputedSourceFieldsProps {
  editingSource: DataSource
  availableDeps: DataSource[]
  selectedDeps: string[]
  unselectedDeps: DataSource[]
  copy: ComputedSourceFieldsCopy
  onUpdateField: <K extends keyof DataSource>(field: K, value: DataSource[K]) => void
  onAddDependency: (depId: string) => void
  onRemoveDependency: (depId: string) => void
}

export function ComputedSourceFields({
  editingSource,
  availableDeps,
  selectedDeps,
  unselectedDeps,
  copy,
  onUpdateField,
  onAddDependency,
  onRemoveDependency,
}: ComputedSourceFieldsProps) {
  return (
    <>
      <div className="space-y-2">
        <Label>{copy.computeLabel}</Label>
        <Textarea
          value={editingSource.compute?.toString() || ''}
          onChange={(e) => {
            try {
              const fn = new Function('data', `return (${e.target.value})`)()
              onUpdateField('compute', fn)
            } catch (err) {
              // Invalid function
            }
          }}
          placeholder={copy.computePlaceholder}
          className="font-mono text-sm h-24"
        />
        <p className="text-xs text-muted-foreground">
          {copy.computeHelp}
        </p>
      </div>

      <div className="space-y-2">
        <Label>{copy.dependenciesLabel}</Label>

        {selectedDeps.length > 0 && (
          <div className="flex flex-wrap gap-2 p-3 bg-muted/30 rounded border border-border">
            {selectedDeps.map(depId => (
              <Badge
                key={depId}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {depId}
                <button
                  onClick={() => onRemoveDependency(depId)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}

        {unselectedDeps.length > 0 && (
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">{copy.availableSourcesLabel}</Label>
            <div className="flex flex-wrap gap-2">
              {unselectedDeps.map(ds => (
                <Button
                  key={ds.id}
                  variant="outline"
                  size="sm"
                  onClick={() => onAddDependency(ds.id)}
                  className="h-7 text-xs"
                >
                  + {ds.id}
                </Button>
              ))}
            </div>
          </div>
        )}

        {availableDeps.length === 0 && selectedDeps.length === 0 && (
          <p className="text-sm text-muted-foreground">
            {copy.emptyDependencies}
          </p>
        )}
      </div>
    </>
  )
}
