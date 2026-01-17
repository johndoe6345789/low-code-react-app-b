import { ProjectFile } from '@/types/project'
import { LazyMonacoEditor } from './LazyMonacoEditor'

interface MonacoEditorPanelProps {
  file: ProjectFile
  onChange: (content: string) => void
}

export function MonacoEditorPanel({ file, onChange }: MonacoEditorPanelProps) {
  return <LazyMonacoEditor file={file} onChange={onChange} />
}
