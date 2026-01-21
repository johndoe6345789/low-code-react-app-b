import { ProjectFile } from '@/types/project'
import { useDialogState } from '@/hooks/use-dialog-state'
import { useFileFilters } from '@/hooks/use-file-filters'
import { useCodeExplanation } from '@/hooks/use-code-explanation'
import { useAIOperations } from '@/hooks/use-ai-operations'
import { EditorToolbar } from '@/components/molecules/EditorToolbar'
import { MonacoEditorPanel } from '@/components/molecules/MonacoEditorPanel'
import { EmptyEditorState } from '@/components/molecules/EmptyEditorState'
import { CodeExplanationDialog } from '@/lib/json-ui/json-components'

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
  const { isOpen: showExplainDialog, setIsOpen: setShowExplainDialog } = useDialogState()
  const { explanation, isExplaining, explain } = useCodeExplanation()
  const { improveCode } = useAIOperations()
  const { getOpenFiles, findFileById } = useFileFilters(files)

  const activeFile = findFileById(activeFileId) || undefined
  const openFiles = getOpenFiles(activeFileId)

  const handleImproveCode = async () => {
    if (!activeFile) return

    const instruction = prompt('How would you like to improve this code?')
    if (!instruction) return

    const improvedCode = await improveCode(activeFile.content, instruction)
    if (improvedCode) {
      onFileChange(activeFile.id, improvedCode)
    }
  }

  const handleExplainCode = async () => {
    if (!activeFile) return
    setShowExplainDialog(true)
    await explain(activeFile.content)
  }

  return (
    <div className="h-full flex flex-col">
      {openFiles.length > 0 ? (
        <>
          <EditorToolbar
            openFiles={openFiles}
            activeFileId={activeFileId}
            activeFile={activeFile}
            onFileSelect={onFileSelect}
            onFileClose={onFileClose}
            onExplain={handleExplainCode}
            onImprove={handleImproveCode}
          />
          <div className="flex-1">
            {activeFile && (
              <MonacoEditorPanel
                file={activeFile}
                onChange={(content) => onFileChange(activeFile.id, content)}
              />
            )}
          </div>
        </>
      ) : (
        <EmptyEditorState />
      )}

      <CodeExplanationDialog
        open={showExplainDialog}
        onOpenChange={setShowExplainDialog}
        fileName={activeFile?.name}
        explanation={explanation}
        isLoading={isExplaining}
      />
    </div>
  )
}
