/// <reference path="../global.d.ts" />

import { useState } from 'react'
import { StorybookStory } from '@/types/project'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Trash, BookOpen, Sparkle } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'

interface StorybookDesignerProps {
  stories: StorybookStory[]
  onStoriesChange: (stories: StorybookStory[]) => void
}

export function StorybookDesigner({ stories, onStoriesChange }: StorybookDesignerProps) {
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(stories[0]?.id || null)
  const [newArgKey, setNewArgKey] = useState('')
  const [newArgValue, setNewArgValue] = useState('')
  
  const selectedStory = stories.find(s => s.id === selectedStoryId)
  const categories = Array.from(new Set(stories.map(s => s.category)))

  const handleAddStory = () => {
    const newStory: StorybookStory = {
      id: `story-${Date.now()}`,
      componentName: 'Button',
      storyName: 'Default',
      args: {},
      description: '',
      category: 'Components'
    }
    onStoriesChange([...stories, newStory])
    setSelectedStoryId(newStory.id)
  }

  const handleDeleteStory = (storyId: string) => {
    onStoriesChange(stories.filter(s => s.id !== storyId))
    if (selectedStoryId === storyId) {
      const remaining = stories.filter(s => s.id !== storyId)
      setSelectedStoryId(remaining[0]?.id || null)
    }
  }

  const handleUpdateStory = (storyId: string, updates: Partial<StorybookStory>) => {
    onStoriesChange(
      stories.map(s => s.id === storyId ? { ...s, ...updates } : s)
    )
  }

  const handleAddArg = () => {
    if (!selectedStory || !newArgKey) return
    
    let parsedValue: any = newArgValue
    try {
      parsedValue = JSON.parse(newArgValue)
    } catch {
      parsedValue = newArgValue
    }

    handleUpdateStory(selectedStory.id, {
      args: { ...selectedStory.args, [newArgKey]: parsedValue }
    })
    setNewArgKey('')
    setNewArgValue('')
  }

  const handleDeleteArg = (key: string) => {
    if (!selectedStory) return
    const { [key]: _, ...rest } = selectedStory.args
    handleUpdateStory(selectedStory.id, { args: rest })
  }

  const handleUpdateArg = (key: string, value: string) => {
    if (!selectedStory) return
    let parsedValue: any = value
    try {
      parsedValue = JSON.parse(value)
    } catch {
      parsedValue = value
    }
    handleUpdateStory(selectedStory.id, {
      args: { ...selectedStory.args, [key]: parsedValue }
    })
  }

  const handleGenerateWithAI = async () => {
    const description = prompt('Describe the component and story you want to generate:')
    if (!description) return

    try {
      toast.info('Generating story with AI...')
      const promptText = `You are a Storybook story generator. Create a story based on: "${description}"

Return a valid JSON object with a single property "story":
{
  "story": {
    "id": "unique-id",
    "componentName": "ComponentName (e.g., Button, Card, Input)",
    "storyName": "StoryName (e.g., Primary, Large, Disabled)",
    "args": {
      "variant": "primary",
      "size": "large",
      "disabled": false
    },
    "description": "Description of what this story demonstrates",
    "category": "Components" (e.g., Components, Forms, Layout, Data Display)
  }
}

Create appropriate props/args that showcase the component variation.`

      const response = await window.spark.llm(promptText, 'gpt-4o', true)
      const parsed = JSON.parse(response)
      onStoriesChange([...stories, parsed.story])
      setSelectedStoryId(parsed.story.id)
      toast.success('Story generated successfully!')
    } catch (error) {
      console.error(error)
      toast.error('Failed to generate story')
    }
  }

  return (
    <div className="h-full flex">
      <div className="w-80 border-r border-border bg-card">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold text-sm">Stories</h2>
          <div className="flex gap-1">
            <Button size="sm" variant="outline" onClick={handleGenerateWithAI}>
              <Sparkle size={14} weight="duotone" />
            </Button>
            <Button size="sm" onClick={handleAddStory}>
              <Plus size={14} />
            </Button>
          </div>
        </div>
        <ScrollArea className="h-[calc(100vh-200px)]">
          {categories.map(category => (
            <div key={category} className="mb-4">
              <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase">
                {category}
              </div>
              <div className="px-2 space-y-1">
                {stories.filter(s => s.category === category).map(story => (
                  <div
                    key={story.id}
                    className={`p-3 rounded-md cursor-pointer flex items-start justify-between group ${
                      selectedStoryId === story.id ? 'bg-accent text-accent-foreground' : 'hover:bg-muted'
                    }`}
                    onClick={() => setSelectedStoryId(story.id)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{story.componentName}</div>
                      <div className="text-xs text-muted-foreground truncate">{story.storyName}</div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="opacity-0 group-hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteStory(story.id)
                      }}
                    >
                      <Trash size={14} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {stories.length === 0 && (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No stories yet. Click + to create one.
            </div>
          )}
        </ScrollArea>
      </div>

      <div className="flex-1 p-6">
        {selectedStory ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Story Configuration</h2>
              <Button variant="outline">
                <BookOpen size={16} className="mr-2" weight="fill" />
                Preview Story
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Story Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="component-name">Component Name</Label>
                    <Input
                      id="component-name"
                      value={selectedStory.componentName}
                      onChange={e => handleUpdateStory(selectedStory.id, { componentName: e.target.value })}
                      placeholder="Button"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="story-name">Story Name</Label>
                    <Input
                      id="story-name"
                      value={selectedStory.storyName}
                      onChange={e => handleUpdateStory(selectedStory.id, { storyName: e.target.value })}
                      placeholder="Primary"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={selectedStory.category}
                    onChange={e => handleUpdateStory(selectedStory.id, { category: e.target.value })}
                    placeholder="Components"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={selectedStory.description}
                    onChange={e => handleUpdateStory(selectedStory.id, { description: e.target.value })}
                    placeholder="Describe what this story demonstrates..."
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Args / Props</CardTitle>
                    <CardDescription>Configure component props for this story</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Arg name"
                    value={newArgKey}
                    onChange={e => setNewArgKey(e.target.value)}
                  />
                  <Input
                    placeholder="Value (JSON or string)"
                    value={newArgValue}
                    onChange={e => setNewArgValue(e.target.value)}
                  />
                  <Button onClick={handleAddArg} disabled={!newArgKey}>
                    <Plus size={14} />
                  </Button>
                </div>

                <ScrollArea className="h-[300px]">
                  <div className="space-y-2">
                    {Object.entries(selectedStory.args).map(([key, value]) => (
                      <Card key={key}>
                        <CardContent className="pt-4">
                          <div className="flex items-start gap-3">
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-2">
                                <Label className="font-mono text-xs">{key}</Label>
                                <Badge variant="outline">
                                  {typeof value}
                                </Badge>
                              </div>
                              <Input
                                value={JSON.stringify(value)}
                                onChange={e => handleUpdateArg(key, e.target.value)}
                                className="font-mono text-xs"
                              />
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteArg(key)}
                            >
                              <Trash size={14} />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {Object.keys(selectedStory.args).length === 0 && (
                      <div className="py-12 text-center text-sm text-muted-foreground">
                        No args configured yet. Add props above to showcase component variations.
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <BookOpen size={48} className="mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium mb-2">No story selected</p>
              <p className="text-sm text-muted-foreground mb-4">
                Create or select a story to configure
              </p>
              <Button onClick={handleAddStory}>
                <Plus size={16} className="mr-2" />
                Create Story
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
