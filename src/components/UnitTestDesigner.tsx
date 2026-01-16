import { useState } from 'react'
import { UnitTest, TestCase } from '@/types/project'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Trash, Flask, Sparkle } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'

interface UnitTestDesignerProps {
  tests: UnitTest[]
  onTestsChange: (tests: UnitTest[]) => void
}

export function UnitTestDesigner({ tests, onTestsChange }: UnitTestDesignerProps) {
  const [selectedTestId, setSelectedTestId] = useState<string | null>(tests[0]?.id || null)
  const selectedTest = tests.find(t => t.id === selectedTestId)

  const handleAddTest = () => {
    const newTest: UnitTest = {
      id: `unit-test-${Date.now()}`,
      name: 'New Test Suite',
      description: '',
      testType: 'component',
      targetFile: '',
      testCases: []
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

  const handleUpdateTest = (testId: string, updates: Partial<UnitTest>) => {
    onTestsChange(
      tests.map(t => t.id === testId ? { ...t, ...updates } : t)
    )
  }

  const handleAddTestCase = () => {
    if (!selectedTest) return
    const newCase: TestCase = {
      id: `case-${Date.now()}`,
      description: 'should work correctly',
      assertions: ['expect(...).toBe(...)'],
      setup: '',
      teardown: ''
    }
    handleUpdateTest(selectedTest.id, {
      testCases: [...selectedTest.testCases, newCase]
    })
  }

  const handleUpdateTestCase = (caseId: string, updates: Partial<TestCase>) => {
    if (!selectedTest) return
    handleUpdateTest(selectedTest.id, {
      testCases: selectedTest.testCases.map(c => c.id === caseId ? { ...c, ...updates } : c)
    })
  }

  const handleDeleteTestCase = (caseId: string) => {
    if (!selectedTest) return
    handleUpdateTest(selectedTest.id, {
      testCases: selectedTest.testCases.filter(c => c.id !== caseId)
    })
  }

  const handleAddAssertion = (caseId: string) => {
    if (!selectedTest) return
    const testCase = selectedTest.testCases.find(c => c.id === caseId)
    if (!testCase) return
    handleUpdateTestCase(caseId, {
      assertions: [...testCase.assertions, 'expect(...).toBe(...)']
    })
  }

  const handleUpdateAssertion = (caseId: string, index: number, value: string) => {
    if (!selectedTest) return
    const testCase = selectedTest.testCases.find(c => c.id === caseId)
    if (!testCase) return
    const newAssertions = [...testCase.assertions]
    newAssertions[index] = value
    handleUpdateTestCase(caseId, { assertions: newAssertions })
  }

  const handleDeleteAssertion = (caseId: string, index: number) => {
    if (!selectedTest) return
    const testCase = selectedTest.testCases.find(c => c.id === caseId)
    if (!testCase) return
    handleUpdateTestCase(caseId, {
      assertions: testCase.assertions.filter((_, i) => i !== index)
    })
  }

  const handleGenerateWithAI = async () => {
    const description = prompt('Describe the component/function you want to test:')
    if (!description) return

    try {
      toast.info('Generating test with AI...')
      const promptText = `You are a unit test generator. Create tests based on: "${description}"

Return a valid JSON object with a single property "test":
{
  "test": {
    "id": "unique-id",
    "name": "ComponentName/FunctionName Tests",
    "description": "Test suite description",
    "testType": "component" | "function" | "hook" | "integration",
    "targetFile": "/path/to/file.tsx",
    "testCases": [
      {
        "id": "case-id",
        "description": "should render correctly",
        "assertions": [
          "expect(screen.getByText('Hello')).toBeInTheDocument()",
          "expect(result).toBe(true)"
        ],
        "setup": "const { getByText } = render(<Component />)",
        "teardown": "cleanup()"
      }
    ]
  }
}

Create comprehensive test cases with appropriate assertions for React Testing Library or Vitest.`

      const response = await window.spark.llm(promptText, 'gpt-4o', true)
      const parsed = JSON.parse(response)
      onTestsChange([...tests, parsed.test])
      setSelectedTestId(parsed.test.id)
      toast.success('Test suite generated successfully!')
    } catch (error) {
      console.error(error)
      toast.error('Failed to generate test')
    }
  }

  const getTestTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      component: 'bg-blue-500',
      function: 'bg-green-500',
      hook: 'bg-purple-500',
      integration: 'bg-orange-500'
    }
    return colors[type] || 'bg-gray-500'
  }

  return (
    <div className="h-full flex">
      <div className="w-80 border-r border-border bg-card">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold text-sm">Test Suites</h2>
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
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-2 h-2 rounded-full ${getTestTypeColor(test.testType)}`} />
                    <div className="font-medium text-sm truncate">{test.name}</div>
                  </div>
                  <div className="text-xs text-muted-foreground truncate">{test.targetFile || 'No file'}</div>
                  <div className="text-xs text-muted-foreground">{test.testCases.length} cases</div>
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
                No test suites yet. Click + to create one.
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      <div className="flex-1 p-6">
        {selectedTest ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Test Suite Configuration</h2>
              <Button variant="outline">
                <Flask size={16} className="mr-2" weight="fill" />
                Run Tests
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Test Suite Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="test-name">Test Suite Name</Label>
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
                    placeholder="What does this test suite cover?"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="test-type">Test Type</Label>
                    <Select
                      value={selectedTest.testType}
                      onValueChange={(value: any) => handleUpdateTest(selectedTest.id, { testType: value })}
                    >
                      <SelectTrigger id="test-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="component">Component</SelectItem>
                        <SelectItem value="function">Function</SelectItem>
                        <SelectItem value="hook">Hook</SelectItem>
                        <SelectItem value="integration">Integration</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="target-file">Target File</Label>
                    <Input
                      id="target-file"
                      value={selectedTest.targetFile}
                      onChange={e => handleUpdateTest(selectedTest.id, { targetFile: e.target.value })}
                      placeholder="/src/components/Button.tsx"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Test Cases</CardTitle>
                    <CardDescription>Define individual test cases</CardDescription>
                  </div>
                  <Button size="sm" onClick={handleAddTestCase}>
                    <Plus size={14} className="mr-1" />
                    Add Test Case
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[450px]">
                  <div className="space-y-4">
                    {selectedTest.testCases.map((testCase, index) => (
                      <Card key={testCase.id}>
                        <CardContent className="pt-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <Badge variant="outline">Case {index + 1}</Badge>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteTestCase(testCase.id)}
                            >
                              <Trash size={14} />
                            </Button>
                          </div>
                          <div className="space-y-2">
                            <Label>Description (it...)</Label>
                            <Input
                              value={testCase.description}
                              onChange={e => handleUpdateTestCase(testCase.id, { description: e.target.value })}
                              placeholder="should render correctly"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Setup Code (optional)</Label>
                            <Textarea
                              value={testCase.setup || ''}
                              onChange={e => handleUpdateTestCase(testCase.id, { setup: e.target.value })}
                              placeholder="const { getByText } = render(<Component />)"
                              className="font-mono text-xs"
                              rows={2}
                            />
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label>Assertions</Label>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleAddAssertion(testCase.id)}
                              >
                                <Plus size={12} />
                              </Button>
                            </div>
                            <div className="space-y-2">
                              {testCase.assertions.map((assertion, assertionIndex) => (
                                <div key={assertionIndex} className="flex gap-2">
                                  <Input
                                    value={assertion}
                                    onChange={e => handleUpdateAssertion(testCase.id, assertionIndex, e.target.value)}
                                    placeholder="expect(...).toBe(...)"
                                    className="font-mono text-xs"
                                  />
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleDeleteAssertion(testCase.id, assertionIndex)}
                                  >
                                    <Trash size={12} />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Teardown Code (optional)</Label>
                            <Textarea
                              value={testCase.teardown || ''}
                              onChange={e => handleUpdateTestCase(testCase.id, { teardown: e.target.value })}
                              placeholder="cleanup()"
                              className="font-mono text-xs"
                              rows={2}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {selectedTest.testCases.length === 0 && (
                      <div className="py-12 text-center text-sm text-muted-foreground">
                        No test cases yet. Click "Add Test Case" to create one.
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
              <Flask size={48} className="mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium mb-2">No test suite selected</p>
              <p className="text-sm text-muted-foreground mb-4">
                Create or select a test suite to configure
              </p>
              <Button onClick={handleAddTest}>
                <Plus size={16} className="mr-2" />
                Create Test Suite
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
