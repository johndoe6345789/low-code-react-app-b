import { useState, useRef } from 'react'
import { ComponentTree, ComponentNode } from '@/types/project'
import { TreeFormDialog } from '@/components/molecules'
import { TreeListPanel } from '@/components/organisms'
import { ComponentTreeBuilder } from '@/components/ComponentTreeBuilder'
import { TreeIcon } from '@/components/atoms'
import { toast } from 'sonner'

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
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  const handleExportJson = () => {
    if (!selectedTree) {
      toast.error('No tree selected to export')
      return
    }

    try {
      const json = JSON.stringify(selectedTree, null, 2)
      const blob = new Blob([json], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${selectedTree.name.toLowerCase().replace(/\s+/g, '-')}-tree.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast.success('Component tree exported as JSON')
    } catch (error) {
      console.error('Export failed:', error)
      toast.error('Failed to export component tree')
    }
  }

  const handleImportJson = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      const importedTree = JSON.parse(text) as ComponentTree

      if (!importedTree.id || !importedTree.name || !Array.isArray(importedTree.rootNodes)) {
        toast.error('Invalid component tree JSON format')
        return
      }

      const newTree: ComponentTree = {
        ...importedTree,
        id: `tree-${Date.now()}`,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }

      onTreesChange((current) => [...current, newTree])
      setSelectedTreeId(newTree.id)
      toast.success(`Component tree "${newTree.name}" imported successfully`)
    } catch (error) {
      console.error('Import failed:', error)
      toast.error('Failed to import component tree. Please check the JSON format.')
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <div className="h-full flex">
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />

      <TreeListPanel
        trees={trees}
        selectedTreeId={selectedTreeId}
        onTreeSelect={setSelectedTreeId}
        onTreeEdit={openEditDialog}
        onTreeDuplicate={handleDuplicateTree}
        onTreeDelete={handleDeleteTree}
        onCreateNew={() => setCreateDialogOpen(true)}
        onImportJson={handleImportJson}
        onExportJson={handleExportJson}
      />

      <div className="flex-1 overflow-hidden">
        {selectedTree ? (
          <ComponentTreeBuilder
            components={selectedTree.rootNodes}
            onComponentsChange={handleComponentsChange}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <TreeIcon size={64} className="mx-auto mb-4 opacity-50" />
              <p>Select a component tree to edit</p>
            </div>
          </div>
        )}
      </div>

      <TreeFormDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        title="Create Component Tree"
        description="Create a new component tree to organize your UI components"
        name={newTreeName}
        treeDescription={newTreeDescription}
        onNameChange={setNewTreeName}
        onDescriptionChange={setNewTreeDescription}
        onSubmit={handleCreateTree}
        submitLabel="Create Tree"
      />

      <TreeFormDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        title="Edit Component Tree"
        description="Update the component tree details"
        name={newTreeName}
        treeDescription={newTreeDescription}
        onNameChange={setNewTreeName}
        onDescriptionChange={setNewTreeDescription}
        onSubmit={handleEditTree}
        submitLabel="Save Changes"
      />
    </div>
  )
}
