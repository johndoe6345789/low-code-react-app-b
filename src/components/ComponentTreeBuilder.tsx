import { useState } from 'react'
import { ComponentNode } from '@/types/project'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Plus, Trash, Tree, CaretRight, CaretDown, Sparkle } from '@phosphor-icons/react'
import { Textarea } from '@/components/ui/textarea'
import { AIService } from '@/lib/ai-service'
import { toast } from 'sonner'

interface ComponentTreeBuilderProps {
  components: ComponentNode[]
  onComponentsChange: (components: ComponentNode[]) => void
}

const MUI_COMPONENTS = [
  'Box',
  'Container',
  'Grid',
  'Stack',
  'Paper',
  'Card',
  'CardContent',
  'CardActions',
  'Button',
  'TextField',
  'Typography',
  'AppBar',
  'Toolbar',
  'List',
  'ListItem',
  'ListItemText',
  'Divider',
  'Avatar',
  'Chip',
  'IconButton',
]

export function ComponentTreeBuilder({
  components,
  onComponentsChange,
}: ComponentTreeBuilderProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set())

  const findNodeById = (
    nodes: ComponentNode[],
    id: string
  ): ComponentNode | null => {
    for (const node of nodes) {
      if (node.id === id) return node
      const found = findNodeById(node.children, id)
      if (found) return found
    }
    return null
  }

  const selectedNode = selectedNodeId ? findNodeById(components, selectedNodeId) : null

  const addRootComponent = () => {
    const newNode: ComponentNode = {
      id: `node-${Date.now()}`,
      type: 'Box',
      name: `Component${components.length + 1}`,
      props: {},
      children: [],
    }
    onComponentsChange([...components, newNode])
    setSelectedNodeId(newNode.id)
  }

  const addChildComponent = (parentId: string) => {
    const newNode: ComponentNode = {
      id: `node-${Date.now()}`,
      type: 'Box',
      name: 'NewComponent',
      props: {},
      children: [],
    }

    const addChild = (nodes: ComponentNode[]): ComponentNode[] => {
      return nodes.map((node) => {
        if (node.id === parentId) {
          return { ...node, children: [...node.children, newNode] }
        }
        return { ...node, children: addChild(node.children) }
      })
    }

    onComponentsChange(addChild(components))
    setExpandedNodes(new Set([...expandedNodes, parentId]))
    setSelectedNodeId(newNode.id)
  }

  const deleteNode = (nodeId: string) => {
    const deleteFromTree = (nodes: ComponentNode[]): ComponentNode[] => {
      return nodes
        .filter((node) => node.id !== nodeId)
        .map((node) => ({ ...node, children: deleteFromTree(node.children) }))
    }

    onComponentsChange(deleteFromTree(components))
    if (selectedNodeId === nodeId) {
      setSelectedNodeId(null)
    }
  }

  const updateNode = (nodeId: string, updates: Partial<ComponentNode>) => {
    const updateInTree = (nodes: ComponentNode[]): ComponentNode[] => {
      return nodes.map((node) => {
        if (node.id === nodeId) {
          return { ...node, ...updates }
        }
        return { ...node, children: updateInTree(node.children) }
      })
    }

    onComponentsChange(updateInTree(components))
  }

  const toggleExpand = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes)
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId)
    } else {
      newExpanded.add(nodeId)
    }
    setExpandedNodes(newExpanded)
  }

  const generateComponentWithAI = async () => {
    const description = prompt('Describe the component you want to create:')
    if (!description) return

    try {
      toast.info('Generating component with AI...')
      const component = await AIService.generateComponent(description)
      
      if (component) {
        onComponentsChange([...components, component])
        setSelectedNodeId(component.id)
        setExpandedNodes(new Set([...Array.from(expandedNodes), component.id]))
        toast.success(`Component "${component.name}" created successfully!`)
      } else {
        toast.error('AI generation failed. Please try again.')
      }
    } catch (error) {
      toast.error('Failed to generate component')
      console.error(error)
    }
  }

  const renderTreeNode = (node: ComponentNode, level: number = 0) => {
    const isExpanded = expandedNodes.has(node.id)
    const isSelected = selectedNodeId === node.id
    const hasChildren = node.children.length > 0

    return (
      <div key={node.id}>
        <button
          onClick={() => setSelectedNodeId(node.id)}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors ${
            isSelected
              ? 'bg-accent text-accent-foreground'
              : 'hover:bg-muted text-foreground'
          }`}
          style={{ paddingLeft: `${level * 20 + 12}px` }}
        >
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                toggleExpand(node.id)
              }}
              className="hover:text-accent"
            >
              {isExpanded ? <CaretDown size={16} /> : <CaretRight size={16} />}
            </button>
          )}
          {!hasChildren && <div className="w-4" />}
          <Tree size={16} />
          <span className="font-medium">{node.name}</span>
          <span className="text-muted-foreground text-xs ml-auto">{node.type}</span>
        </button>
        {isExpanded &&
          node.children.map((child) => renderTreeNode(child, level + 1))}
      </div>
    )
  }

  return (
    <div className="h-full flex gap-4 p-6">
      <div className="w-80 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm uppercase tracking-wide">
            Component Tree
          </h3>
          <div className="flex gap-1">
            <Button 
              size="sm" 
              variant="outline"
              onClick={generateComponentWithAI} 
              className="h-8 w-8 p-0"
              title="Generate component with AI"
            >
              <Sparkle size={16} weight="duotone" />
            </Button>
            <Button size="sm" onClick={addRootComponent} className="h-8 w-8 p-0">
              <Plus size={16} />
            </Button>
          </div>
        </div>
        <ScrollArea className="flex-1 border rounded-lg">
          <div className="p-2 space-y-1">
            {components.map((node) => renderTreeNode(node))}
          </div>
        </ScrollArea>
      </div>

      <Card className="flex-1 p-6">
        {selectedNode ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold">Component Properties</h4>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => deleteNode(selectedNode.id)}
              >
                <Trash size={16} />
              </Button>
            </div>

            <div className="grid gap-4">
              <div className="space-y-2">
                <Label>Component Name</Label>
                <Input
                  value={selectedNode.name}
                  onChange={(e) =>
                    updateNode(selectedNode.id, { name: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Component Type</Label>
                <Select
                  value={selectedNode.type}
                  onValueChange={(value) =>
                    updateNode(selectedNode.id, { type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MUI_COMPONENTS.map((comp) => (
                      <SelectItem key={comp} value={comp}>
                        {comp}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Props (JSON)</Label>
                <Textarea
                  value={JSON.stringify(selectedNode.props, null, 2)}
                  onChange={(e) => {
                    try {
                      const props = JSON.parse(e.target.value)
                      updateNode(selectedNode.id, { props })
                    } catch (err) {
                      console.debug('Invalid JSON while typing:', err)
                    }
                  }}
                  className="font-mono text-sm h-64"
                  placeholder='{"variant": "contained", "color": "primary"}'
                />
              </div>

              <Button onClick={() => addChildComponent(selectedNode.id)}>
                <Plus size={16} className="mr-2" />
                Add Child Component
              </Button>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <Tree size={48} className="mx-auto mb-4 opacity-50" />
              <p>Select a component to edit properties</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
