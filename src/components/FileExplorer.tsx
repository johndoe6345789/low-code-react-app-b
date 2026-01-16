import { useState } from 'react'
import { ProjectFile } from '@/types/project'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FileCode, FolderOpen, Plus, Folder, Sparkle } from '@phosphor-icons/react'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AIService } from '@/lib/ai-service'
import { toast } from 'sonner'

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
  const [aiDescription, setAiDescription] = useState('')
  const [aiFileType, setAiFileType] = useState<'component' | 'page' | 'api' | 'utility'>('component')
  const [isGenerating, setIsGenerating] = useState(false)

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

  const handleGenerateFileWithAI = async () => {
    if (!aiDescription.trim() || !newFileName.trim()) {
      toast.error('Please provide both a filename and description')
      return
    }

    try {
      setIsGenerating(true)
      toast.info('Generating code with AI...')
      
      const code = await AIService.generateCodeFromDescription(aiDescription, aiFileType)
      
      if (code) {
        const newFile: ProjectFile = {
          id: `file-${Date.now()}`,
          name: newFileName,
          path: `/src/${newFileName}`,
          content: code,
          language: newFileLanguage,
        }

        onFileAdd(newFile)
        setNewFileName('')
        setAiDescription('')
        setIsAddDialogOpen(false)
        toast.success('File generated successfully!')
      } else {
        toast.error('AI generation failed. Please try again.')
      }
    } catch (error) {
      toast.error('Failed to generate file')
      console.error(error)
    } finally {
      setIsGenerating(false)
    }
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
            <Tabs defaultValue="manual">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="manual">Manual</TabsTrigger>
                <TabsTrigger value="ai">
                  <Sparkle size={14} className="mr-2" weight="duotone" />
                  AI Generate
                </TabsTrigger>
              </TabsList>
              <TabsContent value="manual" className="space-y-4">
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
              </TabsContent>
              <TabsContent value="ai" className="space-y-4">
                <div className="space-y-2">
                  <Label>File Name</Label>
                  <Input
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                    placeholder="UserCard.tsx"
                  />
                </div>
                <div className="space-y-2">
                  <Label>File Type</Label>
                  <Select
                    value={aiFileType}
                    onValueChange={(value: any) => setAiFileType(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="component">Component</SelectItem>
                      <SelectItem value="page">Page</SelectItem>
                      <SelectItem value="api">API Route</SelectItem>
                      <SelectItem value="utility">Utility</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={aiDescription}
                    onChange={(e) => setAiDescription(e.target.value)}
                    placeholder="Describe what this file should do..."
                    rows={4}
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
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  onClick={handleGenerateFileWithAI} 
                  className="w-full"
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>Generating...</>
                  ) : (
                    <>
                      <Sparkle size={16} className="mr-2" weight="duotone" />
                      Generate with AI
                    </>
                  )}
                </Button>
              </TabsContent>
            </Tabs>
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
