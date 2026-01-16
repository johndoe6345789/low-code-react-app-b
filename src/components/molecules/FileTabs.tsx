import { ProjectFile } from '@/types/project'
import { FileCode, X } from '@phosphor-icons/react'

interface FileTabsProps {
  files: ProjectFile[]
  activeFileId: string | null
  onFileSelect: (fileId: string) => void
  onFileClose: (fileId: string) => void
}

export function FileTabs({ files, activeFileId, onFileSelect, onFileClose }: FileTabsProps) {
  return (
    <div className="flex items-center gap-1">
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
    </div>
  )
}
