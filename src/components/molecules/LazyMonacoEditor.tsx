import { Suspense, lazy } from 'react'
import { ProjectFile } from '@/types/project'

const MonacoEditor = lazy(() => 
  import('@monaco-editor/react').then(module => ({
    default: module.default
  }))
)

interface LazyMonacoEditorProps {
  file: ProjectFile
  onChange: (content: string) => void
}

function MonacoEditorFallback() {
  return (
    <div className="h-full w-full flex items-center justify-center bg-card">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground">Loading editor...</p>
      </div>
    </div>
  )
}

export function LazyMonacoEditor({ file, onChange }: LazyMonacoEditorProps) {
  return (
    <Suspense fallback={<MonacoEditorFallback />}>
      <MonacoEditor
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
    </Suspense>
  )
}

export function preloadMonacoEditor() {
  console.log('[MONACO] 🎯 Preloading Monaco Editor')
  import('@monaco-editor/react')
    .then(() => console.log('[MONACO] ✅ Monaco Editor preloaded'))
    .catch(err => console.warn('[MONACO] ⚠️ Monaco Editor preload failed:', err))
}
