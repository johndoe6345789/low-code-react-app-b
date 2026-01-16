import { FileCode } from '@phosphor-icons/react'

export function EmptyEditorState() {
  return (
    <div className="flex-1 flex items-center justify-center text-muted-foreground">
      <div className="text-center">
        <FileCode size={48} className="mx-auto mb-4 opacity-50" />
        <p>Select a file to edit</p>
      </div>
    </div>
  )
}
