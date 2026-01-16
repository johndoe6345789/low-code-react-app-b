import { useState } from 'react'
import { ProjectFile } from '@/types/project'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FileCode, FolderOpen, Plus, Folder } from '@phosphor-icons/react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface FileExplorerProps {
  files: ProjectFile[]
  activeFileId: string | null
  onFileSelect: (fileId: string) => void
  onFileAdd: (file: ProjectFile) => void
}

export function FileExplorer({
  files,
  activeFileId,
  onFileSelect,
  onFileAdd,
}: FileExplorerProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newFileName, setNewFileName] = useState('')
  const [newFileLanguage, setNewFileLanguage] = useState('typescript')

  const handleAddFile = () => {
    if (!newFileName.trim()) return

    const newFile: ProjectFile = {
      id: `file-${Date.now()}`,
      name: newFileName,
      path: `/src/${newFileName}`,
      content: '',
      language: newFileLanguage,
    }

    onFileAdd(newFile)
    setNewFileName('')
    setIsAddDialogOpen(false)
  }

  const groupedFiles = files.reduce((acc, file) => {
    const dir = file.path.split('/').slice(0, -1).join('/') || '/'
    if (!acc[dir]) acc[dir] = []
    acc[dir].push(file)
    return acc
  }, {} as Record<string, ProjectFile[]>)

  return (
    <div className="h-full flex flex-col border-r border-border bg-card">
      <div className="p-3 border-b border-border flex items-center justify-between">
        <h3 className="font-semibold text-sm uppercase tracking-wide flex items-center gap-2">
          <FolderOpen size={18} weight="duotone" />
          Files
        </h3>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="h-7 w-7 p-0">
              <Plus size={14} />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New File</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>File Name</Label>
                <Input
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  placeholder="example.tsx"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddFile()
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Language</Label>
                <Select
                  value={newFileLanguage}
                  onValueChange={setNewFileLanguage}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="typescript">TypeScript</SelectItem>
                    <SelectItem value="javascript">JavaScript</SelectItem>
                    <SelectItem value="css">CSS</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="prisma">Prisma</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddFile} className="w-full">
                Add File
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2">
          {Object.entries(groupedFiles).map(([dir, dirFiles]) => (
            <div key={dir} className="mb-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1 px-2">
                <Folder size={14} />
                <span>{dir}</span>
              </div>
              <div className="space-y-0.5">
                {dirFiles.map((file) => (
                  <button
                    key={file.id}
                    onClick={() => onFileSelect(file.id)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors ${
                      activeFileId === file.id
                        ? 'bg-accent text-accent-foreground'
                        : 'hover:bg-muted text-foreground'
                    }`}
                  >
                    <FileCode size={16} />
                    <span className="truncate">{file.name}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
