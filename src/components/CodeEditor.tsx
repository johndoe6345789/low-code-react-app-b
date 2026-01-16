import { useState } from 'react'
import Editor from '@monaco-editor/react'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { ProjectFile } from '@/types/project'
import { FileCode, X, Sparkle, Info } from '@phosphor-icons/react'
import { AIService } from '@/lib/ai-service'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'

interface CodeEditorProps {
  files: ProjectFile[]
  activeFileId: string | null
  onFileChange: (fileId: string, content: string) => void
  onFileSelect: (fileId: string) => void
  onFileClose: (fileId: string) => void
}

export function CodeEditor({
  files,
  activeFileId,
  onFileChange,
  onFileSelect,
  onFileClose,
}: CodeEditorProps) {
  const [showExplainDialog, setShowExplainDialog] = useState(false)
  const [explanation, setExplanation] = useState('')
  const [isExplaining, setIsExplaining] = useState(false)

  const activeFile = files.find((f) => f.id === activeFileId)
  const openFiles = files.filter((f) => f.id === activeFileId || files.length < 5)

  const improveCodeWithAI = async () => {
    if (!activeFile) return

    const instruction = prompt('How would you like to improve this code?')
    if (!instruction) return

    try {
      toast.info('Improving code with AI...')
      const improvedCode = await AIService.improveCode(activeFile.content, instruction)
      
      if (improvedCode) {
        onFileChange(activeFile.id, improvedCode)
        toast.success('Code improved successfully!')
      } else {
        toast.error('AI improvement failed. Please try again.')
      }
    } catch (error) {
      toast.error('Failed to improve code')
      console.error(error)
    }
  }

  const explainCode = async () => {
    if (!activeFile) return

    try {
      setIsExplaining(true)
      setShowExplainDialog(true)
      setExplanation('Analyzing code...')
      
      const codeExplanation = await AIService.explainCode(activeFile.content)
      
      if (codeExplanation) {
        setExplanation(codeExplanation)
      } else {
        setExplanation('Failed to generate explanation. Please try again.')
      }
    } catch (error) {
      setExplanation('Error generating explanation.')
      console.error(error)
    } finally {
      setIsExplaining(false)
    }
  }

  return (
    <div className="h-full flex flex-col">
      {openFiles.length > 0 ? (
        <>
          <div className="flex items-center gap-1 bg-secondary/50 border-b border-border px-2 py-1 justify-between">
            <div className="flex items-center gap-1">
              {openFiles.map((file) => (
                <button
                  key={file.id}
                  onClick={() => onFileSelect(file.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm transition-colors ${
                    file.id === activeFileId
                      ? 'bg-card text-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
                  }`}
                >
                  <FileCode size={16} />
                  <span>{file.name}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onFileClose(file.id)
                    }}
                    className="hover:text-destructive"
                  >
                    <X size={14} />
                  </button>
                </button>
              ))}
            </div>
            {activeFile && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={explainCode}
                  className="h-7 text-xs"
                >
                  <Info size={14} className="mr-1" />
                  Explain
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={improveCodeWithAI}
                  className="h-7 text-xs"
                >
                  <Sparkle size={14} className="mr-1" weight="duotone" />
                  Improve
                </Button>
              </div>
            )}
          </div>
          <div className="flex-1">
            {activeFile && (
              <Editor
                height="100%"
                language={activeFile.language}
                value={activeFile.content}
                onChange={(value) => onFileChange(activeFile.id, value || '')}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  fontFamily: 'JetBrains Mono, monospace',
                  fontLigatures: true,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                }}
              />
            )}
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <FileCode size={48} className="mx-auto mb-4 opacity-50" />
            <p>Select a file to edit</p>
          </div>
        </div>
      )}

      <Dialog open={showExplainDialog} onOpenChange={setShowExplainDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Code Explanation</DialogTitle>
            <DialogDescription>
              AI-generated explanation of {activeFile?.name}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-96">
            <div className="p-4 bg-muted rounded-lg">
              {isExplaining ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Sparkle size={16} weight="duotone" className="animate-pulse" />
                  Analyzing code...
                </div>
              ) : (
                <p className="whitespace-pre-wrap text-sm">{explanation}</p>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  )
}
