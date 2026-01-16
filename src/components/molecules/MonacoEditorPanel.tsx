import Editor from '@monaco-editor/react'
import { ProjectFile } from '@/types/project'

interface MonacoEditorPanelProps {
  file: ProjectFile
  onChange: (content: string) => void
}

export function MonacoEditorPanel({ file, onChange }: MonacoEditorPanelProps) {
  return (
    <Editor
      height="100%"
      language={file.language}
      value={file.content}
      onChange={(value) => onChange(value || '')}
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
  )
}
