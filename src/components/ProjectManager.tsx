import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { FloppyDisk, FolderOpen, Trash, Copy, DownloadSimple, UploadSimple, Plus, FolderPlus } from '@phosphor-icons/react'
import { ProjectService, SavedProject } from '@/lib/project-service'
import { Project } from '@/types/project'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface ProjectManagerProps {
  currentProject: Project
  onProjectLoad: (project: Project) => void
}

export function ProjectManager({ currentProject, onProjectLoad }: ProjectManagerProps) {
  const [projects, setProjects] = useState<SavedProject[]>([])
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [loadDialogOpen, setLoadDialogOpen] = useState(false)
  const [newProjectDialogOpen, setNewProjectDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [importDialogOpen, setImportDialogOpen] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null)
  const [projectName, setProjectName] = useState('')
  const [projectDescription, setProjectDescription] = useState('')
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null)
  const [importJson, setImportJson] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadProjectsList()
  }, [])

  const loadProjectsList = async () => {
    setIsLoading(true)
    try {
      const list = await ProjectService.listProjects()
      setProjects(list)
    } catch (error) {
      console.error('Failed to load projects:', error)
      toast.error('Failed to load projects list')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveProject = async () => {
    if (!projectName.trim()) {
      toast.error('Please enter a project name')
      return
    }

    try {
      const id = currentProjectId || ProjectService.generateProjectId()
      
      await ProjectService.saveProject(
        id,
        projectName,
        currentProject,
        projectDescription
      )

      setCurrentProjectId(id)
      toast.success('Project saved successfully!')
      setSaveDialogOpen(false)
      await loadProjectsList()
    } catch (error) {
      console.error('Failed to save project:', error)
      toast.error('Failed to save project')
    }
  }

  const handleLoadProject = async (project: SavedProject) => {
    try {
      onProjectLoad(project.data)
      setCurrentProjectId(project.id)
      setProjectName(project.name)
      setProjectDescription(project.description || '')
      setLoadDialogOpen(false)
      toast.success(`Loaded project: ${project.name}`)
    } catch (error) {
      console.error('Failed to load project:', error)
      toast.error('Failed to load project')
    }
  }

  const handleDeleteProject = async () => {
    if (!projectToDelete) return

    try {
      await ProjectService.deleteProject(projectToDelete)
      toast.success('Project deleted successfully')
      setDeleteDialogOpen(false)
      setProjectToDelete(null)
      
      if (currentProjectId === projectToDelete) {
        setCurrentProjectId(null)
        setProjectName('')
        setProjectDescription('')
      }
      
      await loadProjectsList()
    } catch (error) {
      console.error('Failed to delete project:', error)
      toast.error('Failed to delete project')
    }
  }

  const handleDuplicateProject = async (id: string, name: string) => {
    try {
      const duplicated = await ProjectService.duplicateProject(id, `${name} (Copy)`)
      if (duplicated) {
        toast.success('Project duplicated successfully')
        await loadProjectsList()
      }
    } catch (error) {
      console.error('Failed to duplicate project:', error)
      toast.error('Failed to duplicate project')
    }
  }

  const handleExportProject = async (id: string, name: string) => {
    try {
      const json = await ProjectService.exportProjectAsJSON(id)
      if (json) {
        const blob = new Blob([json], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        toast.success('Project exported successfully')
      }
    } catch (error) {
      console.error('Failed to export project:', error)
      toast.error('Failed to export project')
    }
  }

  const handleImportProject = async () => {
    if (!importJson.trim()) {
      toast.error('Please paste project JSON')
      return
    }

    try {
      const imported = await ProjectService.importProjectFromJSON(importJson)
      if (imported) {
        toast.success('Project imported successfully')
        setImportDialogOpen(false)
        setImportJson('')
        await loadProjectsList()
      } else {
        toast.error('Invalid project JSON')
      }
    } catch (error) {
      console.error('Failed to import project:', error)
      toast.error('Failed to import project')
    }
  }

  const handleNewProject = () => {
    setCurrentProjectId(null)
    setProjectName('')
    setProjectDescription('')
    setNewProjectDialogOpen(false)
    toast.success('New project started')
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  return (
    <>
      <div className="flex gap-2">
        <Button onClick={() => setSaveDialogOpen(true)} variant="outline">
          <FloppyDisk size={16} className="mr-2" />
          Save Project
        </Button>
        <Button onClick={() => setLoadDialogOpen(true)} variant="outline">
          <FolderOpen size={16} className="mr-2" />
          Load Project
        </Button>
        <Button onClick={() => setNewProjectDialogOpen(true)} variant="outline">
          <FolderPlus size={16} className="mr-2" />
          New Project
        </Button>
        <Button onClick={() => setImportDialogOpen(true)} variant="outline">
          <UploadSimple size={16} className="mr-2" />
          Import
        </Button>
      </div>

      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Project</DialogTitle>
            <DialogDescription>
              Save your current project to the database
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="project-name">Project Name</Label>
              <Input
                id="project-name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="My Awesome Project"
              />
            </div>
            <div>
              <Label htmlFor="project-description">Description (Optional)</Label>
              <Textarea
                id="project-description"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                placeholder="Brief description of your project..."
                rows={3}
              />
            </div>
            {currentProjectId && (
              <Badge variant="secondary">
                This will update the existing project
              </Badge>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveProject}>
              <FloppyDisk size={16} className="mr-2" />
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={loadDialogOpen} onOpenChange={setLoadDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Load Project</DialogTitle>
            <DialogDescription>
              Select a project to load from the database
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-96">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-muted-foreground">Loading projects...</p>
              </div>
            ) : projects.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8">
                <FolderOpen size={48} className="text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No saved projects</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {projects.map((project) => (
                  <Card
                    key={project.id}
                    className={cn(
                      'cursor-pointer hover:bg-accent transition-colors',
                      currentProjectId === project.id && 'border-primary'
                    )}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-base">{project.name}</CardTitle>
                          {project.description && (
                            <CardDescription className="mt-1">
                              {project.description}
                            </CardDescription>
                          )}
                        </div>
                        {currentProjectId === project.id && (
                          <Badge variant="default">Current</Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <div className="flex gap-2 text-xs text-muted-foreground">
                        <span>Updated: {formatDate(project.updatedAt)}</span>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0 flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleLoadProject(project)}
                      >
                        <FolderOpen size={14} className="mr-1" />
                        Load
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDuplicateProject(project.id, project.name)
                        }}
                      >
                        <Copy size={14} className="mr-1" />
                        Duplicate
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleExportProject(project.id, project.name)
                        }}
                      >
                        <DownloadSimple size={14} className="mr-1" />
                        Export
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation()
                          setProjectToDelete(project.id)
                          setDeleteDialogOpen(true)
                        }}
                      >
                        <Trash size={14} className="mr-1" />
                        Delete
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <AlertDialog open={newProjectDialogOpen} onOpenChange={setNewProjectDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Start New Project?</AlertDialogTitle>
            <AlertDialogDescription>
              This will clear your current workspace. Make sure you've saved your current project if you want to keep it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleNewProject}>
              <Plus size={16} className="mr-2" />
              Start New Project
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the project from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setProjectToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProject} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              <Trash size={16} className="mr-2" />
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Import Project</DialogTitle>
            <DialogDescription>
              Paste the JSON content of an exported project
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              value={importJson}
              onChange={(e) => setImportJson(e.target.value)}
              placeholder="Paste project JSON here..."
              rows={12}
              className="font-mono text-xs"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setImportDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleImportProject}>
              <UploadSimple size={16} className="mr-2" />
              Import
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
