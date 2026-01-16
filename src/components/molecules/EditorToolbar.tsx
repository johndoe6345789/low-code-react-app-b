import { ProjectFile } from '@/types/project'
import { FileTabs } from './FileTabs'
import { EditorActions } from './EditorActions'

interface EditorToolbarProps {
  openFiles: ProjectFile[]
  activeFileId: string | null
  activeFile: ProjectFile | undefined
  onFileSelect: (fileId: string) => void
  onFileClose: (fileId: string) => void
  onExplain: () => void
  onImprove: () => void
}

export function EditorToolbar({
  openFiles,
  activeFileId,
  activeFile,
  onFileSelect,
  onFileClose,
  onExplain,
  onImprove,
}: EditorToolbarProps) {
  return (
    <div className="flex items-center gap-1 bg-secondary/50 border-b border-border px-2 py-1 justify-between">
      <FileTabs
        files={openFiles}
        activeFileId={activeFileId}
        onFileSelect={onFileSelect}
        onFileClose={onFileClose}
      />
      {activeFile && (
        <EditorActions
          onExplain={onExplain}
          onImprove={onImprove}
        />
      )}
    </div>
  )
}
