import { useState } from 'react'
import { ComponentTree, ComponentNode } from '@/types/project'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Plus, Tree, Trash, Pencil, Copy, FolderOpen } from '@phosphor-icons/react'
import { ComponentTreeBuilder } from '@/components/ComponentTreeBuilder'
import { toast } from 'sonner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface ComponentTreeManagerProps {
  trees: ComponentTree[]
  onTreesChange: (updater: (trees: ComponentTree[]) => ComponentTree[]) => void
}

export function ComponentTreeManager({ trees, onTreesChange }: ComponentTreeManagerProps) {
  const [selectedTreeId, setSelectedTreeId] = useState<string | null>(trees[0]?.id || null)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [newTreeName, setNewTreeName] = useState('')
  const [newTreeDescription, setNewTreeDescription] = useState('')
  const [editingTree, setEditingTree] = useState<ComponentTree | null>(null)

  const selectedTree = trees.find(t => t.id === selectedTreeId)

  const handleCreateTree = () => {
    if (!newTreeName.trim()) {
      toast.error('Please enter a tree name')
      return
    }

    const newTree: ComponentTree = {
      id: `tree-${Date.now()}`,
      name: newTreeName,
      description: newTreeDescription,
      rootNodes: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }

    onTreesChange((current) => [...current, newTree])
    setSelectedTreeId(newTree.id)
    setNewTreeName('')
    setNewTreeDescription('')
    setCreateDialogOpen(false)
    toast.success('Component tree created')
  }

  const handleEditTree = () => {
    if (!editingTree || !newTreeName.trim()) return

    onTreesChange((current) =>
      current.map((tree) =>
        tree.id === editingTree.id
          ? { ...tree, name: newTreeName, description: newTreeDescription, updatedAt: Date.now() }
          : tree
      )
    )
    setEditDialogOpen(false)
    setEditingTree(null)
    setNewTreeName('')
    setNewTreeDescription('')
    toast.success('Component tree updated')
  }

  const handleDeleteTree = (treeId: string) => {
    if (trees.length === 1) {
      toast.error('Cannot delete the last component tree')
      return
    }

    if (confirm('Are you sure you want to delete this component tree?')) {
      onTreesChange((current) => current.filter((t) => t.id !== treeId))
      if (selectedTreeId === treeId) {
        setSelectedTreeId(trees.find(t => t.id !== treeId)?.id || null)
      }
      toast.success('Component tree deleted')
    }
  }

  const handleDuplicateTree = (tree: ComponentTree) => {
    const duplicatedTree: ComponentTree = {
      ...tree,
      id: `tree-${Date.now()}`,
      name: `${tree.name} (Copy)`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }

    onTreesChange((current) => [...current, duplicatedTree])
    setSelectedTreeId(duplicatedTree.id)
    toast.success('Component tree duplicated')
  }

  const handleComponentsChange = (components: ComponentNode[]) => {
    if (!selectedTreeId) return

    onTreesChange((current) =>
      current.map((tree) =>
        tree.id === selectedTreeId
          ? { ...tree, rootNodes: components, updatedAt: Date.now() }
          : tree
      )
    )
  }

  const openEditDialog = (tree: ComponentTree) => {
    setEditingTree(tree)
    setNewTreeName(tree.name)
    setNewTreeDescription(tree.description)
    setEditDialogOpen(true)
  }

  return (
    <div className="h-full flex">
      <div className="w-80 border-r border-border bg-card p-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Tree size={20} weight="duotone" />
            Component Trees
          </h2>
          <Button size="sm" onClick={() => setCreateDialogOpen(true)}>
            <Plus size={16} />
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <div className="space-y-2">
            {trees.map((tree) => (
              <Card
                key={tree.id}
                className={`cursor-pointer transition-all ${
                  selectedTreeId === tree.id
                    ? 'ring-2 ring-primary bg-accent'
                    : 'hover:bg-accent/50'
                }`}
                onClick={() => setSelectedTreeId(tree.id)}
              >
                <CardHeader className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-sm truncate">{tree.name}</CardTitle>
                      {tree.description && (
                        <CardDescription className="text-xs mt-1 line-clamp-2">
                          {tree.description}
                        </CardDescription>
                      )}
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {tree.rootNodes.length} components
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1 mt-2" onClick={(e) => e.stopPropagation()}>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openEditDialog(tree)}
                      title="Edit tree"
                    >
                      <Pencil size={14} />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDuplicateTree(tree)}
                      title="Duplicate tree"
                    >
                      <Copy size={14} />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteTree(tree.id)}
                      disabled={trees.length === 1}
                      title="Delete tree"
                    >
                      <Trash size={14} />
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </ScrollArea>

        {trees.length === 0 && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <FolderOpen size={48} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">No component trees yet</p>
              <Button size="sm" className="mt-2" onClick={() => setCreateDialogOpen(true)}>
                Create First Tree
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-hidden">
        {selectedTree ? (
          <ComponentTreeBuilder
            components={selectedTree.rootNodes}
            onComponentsChange={handleComponentsChange}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <Tree size={64} className="mx-auto mb-4 opacity-50" weight="duotone" />
              <p>Select a component tree to edit</p>
            </div>
          </div>
        )}
      </div>

      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Component Tree</DialogTitle>
            <DialogDescription>
              Create a new component tree to organize your UI components
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="tree-name">Tree Name</Label>
              <Input
                id="tree-name"
                value={newTreeName}
                onChange={(e) => setNewTreeName(e.target.value)}
                placeholder="e.g., Main App, Dashboard, Admin Panel"
              />
            </div>
            <div>
              <Label htmlFor="tree-description">Description</Label>
              <Textarea
                id="tree-description"
                value={newTreeDescription}
                onChange={(e) => setNewTreeDescription(e.target.value)}
                placeholder="Describe the purpose of this component tree"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTree}>Create Tree</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Component Tree</DialogTitle>
            <DialogDescription>Update the component tree details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-tree-name">Tree Name</Label>
              <Input
                id="edit-tree-name"
                value={newTreeName}
                onChange={(e) => setNewTreeName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="edit-tree-description">Description</Label>
              <Textarea
                id="edit-tree-description"
                value={newTreeDescription}
                onChange={(e) => setNewTreeDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditTree}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
