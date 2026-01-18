import { useState } from 'react'
import { ComponentNode } from '@/types/project'
import { AIService } from '@/lib/ai-service'
import { toast } from 'sonner'
import componentTreeBuilderData from '@/data/component-tree-builder.json'
import { ComponentInspector } from '@/components/component-tree-builder/ComponentInspector'
import { ComponentTreeToolbar } from '@/components/component-tree-builder/ComponentTreeToolbar'
import { ComponentTreeView } from '@/components/component-tree-builder/ComponentTreeView'
import {
  addChildNode,
  createComponentNode,
  deleteNodeFromTree,
  findNodeById,
  updateNodeInTree,
} from '@/components/component-tree-builder/tree-utils'

interface ComponentTreeBuilderProps {
  components: ComponentNode[]
  onComponentsChange: (components: ComponentNode[]) => void
}

const { muiComponents, prompts } = componentTreeBuilderData

export function ComponentTreeBuilder({
  components,
  onComponentsChange,
}: ComponentTreeBuilderProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set())

  const selectedNode = selectedNodeId
    ? findNodeById(components, selectedNodeId)
    : null

  const addRootComponent = () => {
    const newNode = createComponentNode({
      name: `Component${components.length + 1}`,
    })
    onComponentsChange([...components, newNode])
    setSelectedNodeId(newNode.id)
  }

  const addChildComponent = (parentId: string) => {
    const newNode = createComponentNode()
    onComponentsChange(addChildNode(components, parentId, newNode))
    setExpandedNodes(new Set([...expandedNodes, parentId]))
    setSelectedNodeId(newNode.id)
  }

  const deleteNode = (nodeId: string) => {
    onComponentsChange(deleteNodeFromTree(components, nodeId))
    if (selectedNodeId === nodeId) {
      setSelectedNodeId(null)
    }
  }

  const updateNode = (nodeId: string, updates: Partial<ComponentNode>) => {
    onComponentsChange(updateNodeInTree(components, nodeId, updates))
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
    const description = prompt(prompts.generateComponentDescription)
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

  return (
    <div className="h-full flex gap-4 p-6">
      <div className="w-80 flex flex-col gap-4">
        <ComponentTreeToolbar
          onGenerate={generateComponentWithAI}
          onAddRoot={addRootComponent}
        />
        <ComponentTreeView
          nodes={components}
          selectedNodeId={selectedNodeId}
          expandedNodes={expandedNodes}
          onSelectNode={setSelectedNodeId}
          onToggleExpand={toggleExpand}
        />
      </div>
      <ComponentInspector
        selectedNode={selectedNode}
        muiComponents={muiComponents}
        onDelete={deleteNode}
        onUpdate={updateNode}
        onAddChild={addChildComponent}
      />
    </div>
  )
}
