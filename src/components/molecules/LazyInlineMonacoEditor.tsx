import { Suspense, lazy } from 'react'

const MonacoEditor = lazy(() => 
  import('@monaco-editor/react').then(module => ({
    default: module.default
  }))
)

interface LazyInlineMonacoEditorProps {
  height?: string
  defaultLanguage?: string
  language?: string
  value?: string
  onChange?: (value: string | undefined) => void
  theme?: string
  options?: any
}

function InlineMonacoEditorFallback() {
  return (
    <div className="flex items-center justify-center bg-muted/50 rounded-md" style={{ height: '300px' }}>
      <div className="flex flex-col items-center gap-2">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-muted-foreground">Loading editor...</p>
      </div>
    </div>
  )
}

export function LazyInlineMonacoEditor({ 
  height = '300px',
  defaultLanguage,
  language,
  value,
  onChange,
  theme = 'vs-dark',
  options = {}
}: LazyInlineMonacoEditorProps) {
  return (
    <Suspense fallback={<InlineMonacoEditorFallback />}>
      <MonacoEditor
        height={height}
        defaultLanguage={defaultLanguage}
        language={language}
        value={value}
        onChange={onChange}
        theme={theme}
        options={{
          minimap: { enabled: false },
          fontSize: 12,
          ...options
        }}
      />
    </Suspense>
  )
}
