import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Sparkle } from '@phosphor-icons/react'
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
import { ProjectFile } from '@/types/project'
import { toast } from 'sonner'
import fileExplorerCopy from '@/data/file-explorer.json'
import { Plus } from '@phosphor-icons/react'

interface FileExplorerDialogProps {
  onFileAdd: (file: ProjectFile) => void
}

export function FileExplorerDialog({ onFileAdd }: FileExplorerDialogProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newFileName, setNewFileName] = useState('')
  const [newFileLanguage, setNewFileLanguage] = useState('typescript')
  const [aiDescription, setAiDescription] = useState('')
  const [aiFileType, setAiFileType] = useState<'component' | 'page' | 'api' | 'utility'>(
    'component'
  )
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
      toast.error(fileExplorerCopy.toast.missingFields)
      return
    }

    try {
      setIsGenerating(true)
      toast.info(fileExplorerCopy.toast.generating)

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
        toast.success(fileExplorerCopy.toast.generated)
      } else {
        toast.error(fileExplorerCopy.toast.generationFailed)
      }
    } catch (error) {
      toast.error(fileExplorerCopy.toast.generationError)
      console.error(error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-7 w-7 p-0">
          <Plus size={14} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{fileExplorerCopy.dialog.title}</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="manual">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual">{fileExplorerCopy.dialog.tabs.manual}</TabsTrigger>
            <TabsTrigger value="ai">
              <Sparkle size={14} className="mr-2" weight="duotone" />
              {fileExplorerCopy.dialog.tabs.ai}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="manual" className="space-y-4">
            <div className="space-y-2">
              <Label>{fileExplorerCopy.dialog.fields.fileName}</Label>
              <Input
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                placeholder={fileExplorerCopy.dialog.placeholders.manualFileName}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddFile()
                }}
              />
            </div>
            <div className="space-y-2">
              <Label>{fileExplorerCopy.dialog.fields.language}</Label>
              <Select value={newFileLanguage} onValueChange={setNewFileLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="typescript">
                    {fileExplorerCopy.options.languages.typescript}
                  </SelectItem>
                  <SelectItem value="javascript">
                    {fileExplorerCopy.options.languages.javascript}
                  </SelectItem>
                  <SelectItem value="css">{fileExplorerCopy.options.languages.css}</SelectItem>
                  <SelectItem value="json">{fileExplorerCopy.options.languages.json}</SelectItem>
                  <SelectItem value="prisma">
                    {fileExplorerCopy.options.languages.prisma}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleAddFile} className="w-full">
              {fileExplorerCopy.dialog.buttons.addFile}
            </Button>
          </TabsContent>
          <TabsContent value="ai" className="space-y-4">
            <div className="space-y-2">
              <Label>{fileExplorerCopy.dialog.fields.fileName}</Label>
              <Input
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                placeholder={fileExplorerCopy.dialog.placeholders.aiFileName}
              />
            </div>
            <div className="space-y-2">
              <Label>{fileExplorerCopy.dialog.fields.fileType}</Label>
              <Select value={aiFileType} onValueChange={(value: any) => setAiFileType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="component">
                    {fileExplorerCopy.options.fileTypes.component}
                  </SelectItem>
                  <SelectItem value="page">{fileExplorerCopy.options.fileTypes.page}</SelectItem>
                  <SelectItem value="api">{fileExplorerCopy.options.fileTypes.api}</SelectItem>
                  <SelectItem value="utility">
                    {fileExplorerCopy.options.fileTypes.utility}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{fileExplorerCopy.dialog.fields.description}</Label>
              <Textarea
                value={aiDescription}
                onChange={(e) => setAiDescription(e.target.value)}
                placeholder={fileExplorerCopy.dialog.placeholders.description}
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label>{fileExplorerCopy.dialog.fields.language}</Label>
              <Select value={newFileLanguage} onValueChange={setNewFileLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="typescript">
                    {fileExplorerCopy.options.languages.typescript}
                  </SelectItem>
                  <SelectItem value="javascript">
                    {fileExplorerCopy.options.languages.javascript}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleGenerateFileWithAI} className="w-full" disabled={isGenerating}>
              {isGenerating ? (
                fileExplorerCopy.dialog.buttons.generating
              ) : (
                <>
                  <Sparkle size={16} className="mr-2" weight="duotone" />
                  {fileExplorerCopy.dialog.buttons.generate}
                </>
              )}
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
