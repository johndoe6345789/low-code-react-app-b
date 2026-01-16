import Editor from '@monaco-editor/react'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProjectFile } from '@/types/project'
import { FileCode, X } from '@phosphor-icons/react'

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
  const activeFile = files.find((f) => f.id === activeFileId)
  const openFiles = files.filter((f) => f.id === activeFileId || files.length < 5)

  return (
    <div className="h-full flex flex-col">
      {openFiles.length > 0 ? (
        <>
          <div className="flex items-center gap-1 bg-secondary/50 border-b border-border px-2 py-1">
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
    </div>
  )
}
