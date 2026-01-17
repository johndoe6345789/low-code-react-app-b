/// <reference path="../global.d.ts" />

import { useState } from 'react'
import { PlaywrightTest, PlaywrightStep } from '@/types/project'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Trash, Play, Sparkle } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface PlaywrightDesignerProps {
  tests: PlaywrightTest[]
  onTestsChange: (tests: PlaywrightTest[]) => void
}

export function PlaywrightDesigner({ tests, onTestsChange }: PlaywrightDesignerProps) {
  const [selectedTestId, setSelectedTestId] = useState<string | null>(tests[0]?.id || null)
  const selectedTest = tests.find(t => t.id === selectedTestId)

  const handleAddTest = () => {
    const newTest: PlaywrightTest = {
      id: `test-${Date.now()}`,
      name: 'New Test',
      description: '',
      pageUrl: '/',
      steps: []
    }
    onTestsChange([...tests, newTest])
    setSelectedTestId(newTest.id)
  }

  const handleDeleteTest = (testId: string) => {
    onTestsChange(tests.filter(t => t.id !== testId))
    if (selectedTestId === testId) {
      const remaining = tests.filter(t => t.id !== testId)
      setSelectedTestId(remaining[0]?.id || null)
    }
  }

  const handleUpdateTest = (testId: string, updates: Partial<PlaywrightTest>) => {
    onTestsChange(
      tests.map(t => t.id === testId ? { ...t, ...updates } : t)
    )
  }

  const handleAddStep = () => {
    if (!selectedTest) return
    const newStep: PlaywrightStep = {
      id: `step-${Date.now()}`,
      action: 'click',
      selector: '',
      value: ''
    }
    handleUpdateTest(selectedTest.id, {
      steps: [...selectedTest.steps, newStep]
    })
  }

  const handleUpdateStep = (stepId: string, updates: Partial<PlaywrightStep>) => {
    if (!selectedTest) return
    handleUpdateTest(selectedTest.id, {
      steps: selectedTest.steps.map(s => s.id === stepId ? { ...s, ...updates } : s)
    })
  }

  const handleDeleteStep = (stepId: string) => {
    if (!selectedTest) return
    handleUpdateTest(selectedTest.id, {
      steps: selectedTest.steps.filter(s => s.id !== stepId)
    })
  }

  const handleGenerateWithAI = async () => {
    const description = prompt('Describe the E2E test you want to generate:')
    if (!description) return

    try {
      toast.info('Generating test with AI...')
      const promptText = `You are a Playwright test generator. Create an E2E test based on: "${description}"

Return a valid JSON object with a single property "test":
{
  "test": {
    "id": "unique-id",
    "name": "Test Name",
    "description": "What this test does",
    "pageUrl": "/path",
    "steps": [
      {
        "id": "step-id",
        "action": "navigate" | "click" | "fill" | "expect" | "wait" | "select" | "check" | "uncheck",
        "selector": "css selector or text",
        "value": "value for fill/select actions",
        "assertion": "expected value for expect action",
        "timeout": 5000
      }
    ]
  }
}

Create a complete test flow with appropriate selectors and assertions.`

      const response = await window.spark.llm(promptText, 'gpt-4o', true)
      const parsed = JSON.parse(response)
      onTestsChange([...tests, parsed.test])
      setSelectedTestId(parsed.test.id)
      toast.success('Test generated successfully!')
    } catch (error) {
      console.error(error)
      toast.error('Failed to generate test')
    }
  }

  return (
    <div className="h-full flex">
      <div className="w-80 border-r border-border bg-card">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold text-sm">E2E Tests</h2>
          <div className="flex gap-1">
            <Button size="sm" variant="outline" onClick={handleGenerateWithAI}>
              <Sparkle size={14} weight="duotone" />
            </Button>
            <Button size="sm" onClick={handleAddTest}>
              <Plus size={14} />
            </Button>
          </div>
        </div>
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="p-2 space-y-1">
            {tests.map(test => (
              <div
                key={test.id}
                className={`p-3 rounded-md cursor-pointer flex items-start justify-between group ${
                  selectedTestId === test.id ? 'bg-accent text-accent-foreground' : 'hover:bg-muted'
                }`}
                onClick={() => setSelectedTestId(test.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{test.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{test.pageUrl}</div>
                  <div className="text-xs text-muted-foreground">{test.steps.length} steps</div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="opacity-0 group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteTest(test.id)
                  }}
                >
                  <Trash size={14} />
                </Button>
              </div>
            ))}
            {tests.length === 0 && (
              <div className="p-8 text-center text-sm text-muted-foreground">
                No tests yet. Click + to create one.
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      <div className="flex-1 p-6">
        {selectedTest ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Test Configuration</h2>
              <Button variant="outline">
                <Play size={16} className="mr-2" weight="fill" />
                Run Test
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Test Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="test-name">Test Name</Label>
                  <Input
                    id="test-name"
                    value={selectedTest.name}
                    onChange={e => handleUpdateTest(selectedTest.id, { name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="test-description">Description</Label>
                  <Textarea
                    id="test-description"
                    value={selectedTest.description}
                    onChange={e => handleUpdateTest(selectedTest.id, { description: e.target.value })}
                    placeholder="What does this test verify?"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="test-url">Page URL</Label>
                  <Input
                    id="test-url"
                    value={selectedTest.pageUrl}
                    onChange={e => handleUpdateTest(selectedTest.id, { pageUrl: e.target.value })}
                    placeholder="/login"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Test Steps</CardTitle>
                    <CardDescription>Define the actions for this test</CardDescription>
                  </div>
                  <Button size="sm" onClick={handleAddStep}>
                    <Plus size={14} className="mr-1" />
                    Add Step
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-4">
                    {selectedTest.steps.map((step, index) => (
                      <Card key={step.id}>
                        <CardContent className="pt-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold">Step {index + 1}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteStep(step.id)}
                            >
                              <Trash size={14} />
                            </Button>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                              <Label>Action</Label>
                              <Select
                                value={step.action}
                                onValueChange={(value: any) => handleUpdateStep(step.id, { action: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="navigate">Navigate</SelectItem>
                                  <SelectItem value="click">Click</SelectItem>
                                  <SelectItem value="fill">Fill</SelectItem>
                                  <SelectItem value="expect">Expect</SelectItem>
                                  <SelectItem value="wait">Wait</SelectItem>
                                  <SelectItem value="select">Select</SelectItem>
                                  <SelectItem value="check">Check</SelectItem>
                                  <SelectItem value="uncheck">Uncheck</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            {step.action !== 'navigate' && step.action !== 'wait' && (
                              <div className="space-y-2">
                                <Label>Selector</Label>
                                <Input
                                  value={step.selector || ''}
                                  onChange={e => handleUpdateStep(step.id, { selector: e.target.value })}
                                  placeholder="button, #login, [data-testid='submit']"
                                />
                              </div>
                            )}
                            {(step.action === 'fill' || step.action === 'select') && (
                              <div className="space-y-2 col-span-2">
                                <Label>Value</Label>
                                <Input
                                  value={step.value || ''}
                                  onChange={e => handleUpdateStep(step.id, { value: e.target.value })}
                                  placeholder="Text to enter"
                                />
                              </div>
                            )}
                            {step.action === 'expect' && (
                              <div className="space-y-2 col-span-2">
                                <Label>Assertion</Label>
                                <Input
                                  value={step.assertion || ''}
                                  onChange={e => handleUpdateStep(step.id, { assertion: e.target.value })}
                                  placeholder="toBeVisible(), toHaveText('...')"
                                />
                              </div>
                            )}
                            {step.action === 'wait' && (
                              <div className="space-y-2">
                                <Label>Timeout (ms)</Label>
                                <Input
                                  type="number"
                                  value={step.timeout || 1000}
                                  onChange={e => handleUpdateStep(step.id, { timeout: parseInt(e.target.value) })}
                                />
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {selectedTest.steps.length === 0 && (
                      <div className="py-12 text-center text-sm text-muted-foreground">
                        No steps yet. Click "Add Step" to create test actions.
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
              <Play size={48} className="mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium mb-2">No test selected</p>
              <p className="text-sm text-muted-foreground mb-4">
                Create or select a test to configure
              </p>
              <Button onClick={handleAddTest}>
                <Plus size={16} className="mr-2" />
                Create Test
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
