import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { FloppyDisk, Trash, PencilSimple, CheckCircle, Clock } from '@phosphor-icons/react'
import { useAppDispatch, useAppSelector } from '@/store'
import { saveFile, deleteFile } from '@/store/slices/filesSlice'
import { toast } from 'sonner'

export function PersistenceExample() {
  const dispatch = useAppDispatch()
  const files = useAppSelector((state) => state.files.files)
  const [fileName, setFileName] = useState('')
  const [fileContent, setFileContent] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)

  const handleSave = async () => {
    if (!fileName.trim()) {
      toast.error('File name is required')
      return
    }

    const fileItem = {
      id: editingId || `file-${Date.now()}`,
      name: fileName,
      content: fileContent,
      language: 'javascript',
      path: `/src/${fileName}`,
      updatedAt: Date.now(),
    }

    try {
      await dispatch(saveFile(fileItem)).unwrap()
      toast.success(`File "${fileName}" saved automatically!`, {
        description: 'Synced to IndexedDB and Flask API',
      })
      setFileName('')
      setFileContent('')
      setEditingId(null)
    } catch (error: any) {
      toast.error('Failed to save file', {
        description: error,
      })
    }
  }

  const handleEdit = (file: any) => {
    setEditingId(file.id)
    setFileName(file.name)
    setFileContent(file.content)
  }

  const handleDelete = async (fileId: string, name: string) => {
    try {
      await dispatch(deleteFile(fileId)).unwrap()
      toast.success(`File "${name}" deleted`, {
        description: 'Automatically synced to storage',
      })
    } catch (error: any) {
      toast.error('Failed to delete file', {
        description: error,
      })
    }
  }

  const handleCancel = () => {
    setFileName('')
    setFileContent('')
    setEditingId(null)
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Persistence Middleware Example</h1>
        <p className="text-muted-foreground">
          Demonstrates automatic persistence of Redux state to IndexedDB and Flask API
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 space-y-4 border-sidebar-border">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {editingId ? 'Edit File' : 'Create File'}
            </h2>
            {editingId && (
              <Badge variant="outline" className="text-amber-500 border-amber-500">
                Editing
              </Badge>
            )}
          </div>
          <Separator />

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fileName">File Name</Label>
              <Input
                id="fileName"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="example.js"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fileContent">Content</Label>
              <textarea
                id="fileContent"
                value={fileContent}
                onChange={(e) => setFileContent(e.target.value)}
                placeholder="console.log('Hello, world!')"
                className="w-full h-32 px-3 py-2 border border-input rounded-md bg-background font-mono text-sm resize-none"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSave} className="flex items-center gap-2 flex-1">
                <FloppyDisk />
                {editingId ? 'Update File' : 'Save File'}
              </Button>
              {editingId && (
                <Button onClick={handleCancel} variant="outline">
                  Cancel
                </Button>
              )}
            </div>

            <div className="p-4 bg-muted/50 rounded-lg space-y-2">
              <div className="flex items-start gap-2">
                <CheckCircle className="text-accent mt-1" weight="fill" />
                <div className="text-sm">
                  <p className="font-semibold text-foreground">Automatic Persistence</p>
                  <p className="text-muted-foreground">
                    Data is automatically saved to IndexedDB with 300ms debounce
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="text-primary mt-1" weight="fill" />
                <div className="text-sm">
                  <p className="font-semibold text-foreground">Flask Sync</p>
                  <p className="text-muted-foreground">
                    Changes are synced to Flask API backend automatically
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-4 border-sidebar-border">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Saved Files</h2>
            <Badge variant="secondary">{files.length} files</Badge>
          </div>
          <Separator />

          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {files.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>No files yet</p>
                <p className="text-sm mt-1">Create your first file to see it appear here</p>
              </div>
            ) : (
              files.map((file) => (
                <Card
                  key={file.id}
                  className="p-4 space-y-2 hover:bg-muted/50 transition-colors border-sidebar-border"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{file.name}</h3>
                      <p className="text-sm text-muted-foreground truncate">
                        {file.path}
                      </p>
                    </div>
                    <Badge variant="outline" className="ml-2 shrink-0">
                      {file.language}
                    </Badge>
                  </div>

                  {file.content && (
                    <div className="bg-muted/50 p-2 rounded text-xs font-mono text-muted-foreground max-h-20 overflow-hidden">
                      {file.content.substring(0, 100)}
                      {file.content.length > 100 && '...'}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      Updated: {new Date(file.updatedAt).toLocaleTimeString()}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(file)}
                        className="h-8 flex items-center gap-1"
                      >
                        <PencilSimple />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(file.id, file.name)}
                        className="h-8 flex items-center gap-1 text-destructive hover:text-destructive"
                      >
                        <Trash />
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </Card>
      </div>

      <Card className="p-6 space-y-4 border-primary/50 bg-primary/5">
        <h3 className="text-lg font-semibold">How It Works</h3>
        <Separator />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="space-y-2">
            <div className="font-semibold text-primary">1. Redux Action</div>
            <p className="text-muted-foreground">
              When you save or delete a file, a Redux action is dispatched
            </p>
          </div>
          <div className="space-y-2">
            <div className="font-semibold text-primary">2. Middleware Intercepts</div>
            <p className="text-muted-foreground">
              Persistence middleware automatically intercepts the action and queues the operation
            </p>
          </div>
          <div className="space-y-2">
            <div className="font-semibold text-primary">3. Auto-Sync</div>
            <p className="text-muted-foreground">
              After 300ms debounce, data is saved to IndexedDB and synced to Flask API
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
