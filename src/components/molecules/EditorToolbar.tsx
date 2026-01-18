import { ProjectFile } from '@/types/project'
import { FileTabs } from './FileTabs'
import { EditorActions } from './EditorActions'
import { Flex } from '@/components/atoms'

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
    <Flex 
      align="center" 
      justify="between" 
      gap="xs" 
      className="bg-secondary/50 border-b border-border px-2 py-1"
    >
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
    </Flex>
  )
}
