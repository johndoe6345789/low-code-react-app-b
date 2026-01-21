import { ProjectFile } from '@/types/project'
import { FileCode, X } from '@phosphor-icons/react'
import { Flex } from '@/components/atoms'

interface FileTabsProps {
  files: ProjectFile[]
  activeFileId: string | null
  onFileSelect: (fileId: string) => void
  onFileClose: (fileId: string) => void
}

export function FileTabs({ files, activeFileId, onFileSelect, onFileClose }: FileTabsProps) {
  return (
    <Flex align="center" gap="xs">
      {files.map((file) => (
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
    </Flex>
  )
}
