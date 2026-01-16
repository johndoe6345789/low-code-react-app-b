import { useState } from 'react'
import { PrismaModel, PrismaField } from '@/types/project'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Plus, Trash, Database, Sparkle, Lightbulb } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import { AIService } from '@/lib/ai-service'
import { toast } from 'sonner'

interface ModelDesignerProps {
  models: PrismaModel[]
  onModelsChange: (models: PrismaModel[]) => void
}

const FIELD_TYPES = [
  'String',
  'Int',
  'Float',
  'Boolean',
  'DateTime',
  'Json',
  'Bytes',
]

export function ModelDesigner({ models, onModelsChange }: ModelDesignerProps) {
  const [selectedModelId, setSelectedModelId] = useState<string | null>(
    models[0]?.id || null
  )

  const selectedModel = models.find((m) => m.id === selectedModelId)

  const addModel = () => {
    const newModel: PrismaModel = {
      id: `model-${Date.now()}`,
      name: `Model${models.length + 1}`,
      fields: [
        {
          id: `field-${Date.now()}`,
          name: 'id',
          type: 'String',
          isRequired: true,
          isUnique: true,
          isArray: false,
          defaultValue: 'cuid()',
        },
      ],
    }
    onModelsChange([...models, newModel])
    setSelectedModelId(newModel.id)
  }

  const deleteModel = (modelId: string) => {
    const newModels = models.filter((m) => m.id !== modelId)
    onModelsChange(newModels)
    if (selectedModelId === modelId) {
      setSelectedModelId(newModels[0]?.id || null)
    }
  }

  const updateModel = (modelId: string, updates: Partial<PrismaModel>) => {
    onModelsChange(
      models.map((m) => (m.id === modelId ? { ...m, ...updates } : m))
    )
  }

  const addField = () => {
    if (!selectedModel) return
    const newField: PrismaField = {
      id: `field-${Date.now()}`,
      name: `field${selectedModel.fields.length + 1}`,
      type: 'String',
      isRequired: false,
      isUnique: false,
      isArray: false,
    }
    updateModel(selectedModel.id, {
      fields: [...selectedModel.fields, newField],
    })
  }

  const updateField = (fieldId: string, updates: Partial<PrismaField>) => {
    if (!selectedModel) return
    updateModel(selectedModel.id, {
      fields: selectedModel.fields.map((f) =>
        f.id === fieldId ? { ...f, ...updates } : f
      ),
    })
  }

  const deleteField = (fieldId: string) => {
    if (!selectedModel) return
    updateModel(selectedModel.id, {
      fields: selectedModel.fields.filter((f) => f.id !== fieldId),
    })
  }

  const generateModelWithAI = async () => {
    const description = prompt('Describe the database model you want to create:')
    if (!description) return

    try {
      toast.info('Generating model with AI...')
      const model = await AIService.generatePrismaModel(description, models)
      
      if (model) {
        onModelsChange([...models, model])
        setSelectedModelId(model.id)
        toast.success(`Model "${model.name}" created successfully!`)
      } else {
        toast.error('AI generation failed. Please try again.')
      }
    } catch (error) {
      toast.error('Failed to generate model')
      console.error(error)
    }
  }

  const suggestFields = async () => {
    if (!selectedModel) return

    try {
      toast.info('Getting field suggestions...')
      const existingFieldNames = selectedModel.fields.map(f => f.name)
      const suggestions = await AIService.suggestFieldsForModel(selectedModel.name, existingFieldNames)
      
      if (suggestions && suggestions.length > 0) {
        const newFields: PrismaField[] = suggestions.map((fieldName, index) => ({
          id: `field-${Date.now()}-${index}`,
          name: fieldName,
          type: 'String',
          isRequired: false,
          isUnique: false,
          isArray: false,
        }))

        updateModel(selectedModel.id, {
          fields: [...selectedModel.fields, ...newFields],
        })
        toast.success(`Added ${suggestions.length} suggested fields!`)
      } else {
        toast.error('No suggestions available')
      }
    } catch (error) {
      toast.error('Failed to get suggestions')
      console.error(error)
    }
  }

  return (
    <div className="h-full flex gap-4 p-6">
      <div className="w-64 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm uppercase tracking-wide">Models</h3>
          <div className="flex gap-1">
            <Button 
              size="sm" 
              variant="outline"
              onClick={generateModelWithAI} 
              className="h-8 w-8 p-0"
              title="Generate model with AI"
            >
              <Sparkle size={16} weight="duotone" />
            </Button>
            <Button size="sm" onClick={addModel} className="h-8 w-8 p-0">
              <Plus size={16} />
            </Button>
          </div>
        </div>
        <ScrollArea className="flex-1">
          <div className="space-y-2">
            {models.map((model) => (
              <button
                key={model.id}
                onClick={() => setSelectedModelId(model.id)}
                className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                  selectedModelId === model.id
                    ? 'bg-accent text-accent-foreground border-accent'
                    : 'bg-card text-card-foreground border-border hover:border-accent/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Database size={18} weight="duotone" />
                  <span className="font-medium">{model.name}</span>
                </div>
                <Badge variant="secondary">{model.fields.length}</Badge>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      <Card className="flex-1 p-6">
        {selectedModel ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2 flex-1 mr-4">
                <Label>Model Name</Label>
                <Input
                  value={selectedModel.name}
                  onChange={(e) =>
                    updateModel(selectedModel.id, { name: e.target.value })
                  }
                  className="text-lg font-semibold"
                />
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => deleteModel(selectedModel.id)}
              >
                <Trash size={16} />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-sm uppercase tracking-wide">Fields</h4>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={suggestFields}
                    title="AI suggest fields"
                  >
                    <Lightbulb size={16} className="mr-2" weight="duotone" />
                    Suggest
                  </Button>
                  <Button size="sm" onClick={addField}>
                    <Plus size={16} className="mr-2" />
                    Add Field
                  </Button>
                </div>
              </div>

              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {selectedModel.fields.map((field) => (
                    <Card key={field.id} className="p-4 bg-secondary/30">
                      <div className="grid gap-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Field Name</Label>
                            <Input
                              value={field.name}
                              onChange={(e) =>
                                updateField(field.id, { name: e.target.value })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Type</Label>
                            <Select
                              value={field.type}
                              onValueChange={(value) =>
                                updateField(field.id, { type: value })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {FIELD_TYPES.map((type) => (
                                  <SelectItem key={type} value={type}>
                                    {type}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={field.isRequired}
                              onCheckedChange={(checked) =>
                                updateField(field.id, { isRequired: checked })
                              }
                            />
                            <Label>Required</Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={field.isUnique}
                              onCheckedChange={(checked) =>
                                updateField(field.id, { isUnique: checked })
                              }
                            />
                            <Label>Unique</Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={field.isArray}
                              onCheckedChange={(checked) =>
                                updateField(field.id, { isArray: checked })
                              }
                            />
                            <Label>Array</Label>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteField(field.id)}
                            className="ml-auto text-destructive hover:text-destructive"
                          >
                            <Trash size={16} />
                          </Button>
                        </div>

                        <div className="space-y-2">
                          <Label>Default Value (optional)</Label>
                          <Input
                            value={field.defaultValue || ''}
                            onChange={(e) =>
                              updateField(field.id, {
                                defaultValue: e.target.value,
                              })
                            }
                            placeholder="e.g., now(), cuid(), autoincrement()"
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <Database size={48} className="mx-auto mb-4 opacity-50" />
              <p>Create a model to get started</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
