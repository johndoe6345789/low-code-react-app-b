import { useKV } from '@/hooks/use-kv'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Terminal, MagnifyingGlass } from '@phosphor-icons/react'
import { parseDockerLog } from '@/lib/docker-parser'
import { DockerError } from '@/types/docker'
import { ErrorList } from '@/components/docker-build-debugger/ErrorList'
import { LogAnalyzer } from '@/components/docker-build-debugger/LogAnalyzer'
import { KnowledgeBaseView } from '@/components/docker-build-debugger/KnowledgeBaseView'
import { toast } from 'sonner'
import dockerBuildDebuggerText from '@/data/docker-build-debugger.json'
import { useState } from 'react'

export function DockerBuildDebugger() {
  const [logInput, setLogInput] = useKV<string>('docker-log-input', '')
  const [parsedErrors, setParsedErrors] = useState<DockerError[]>([])

  const handleParse = () => {
    if (!logInput.trim()) {
      toast.error(dockerBuildDebuggerText.analyzer.emptyLogError)
      return
    }

    const errors = parseDockerLog(logInput)

    if (errors.length === 0) {
      toast.info(dockerBuildDebuggerText.analyzer.noErrorsToast)
    } else {
      setParsedErrors(errors)
      toast.success(
        dockerBuildDebuggerText.analyzer.errorsFoundToast
          .replace('{{count}}', String(errors.length))
          .replace('{{plural}}', errors.length > 1 ? 's' : '')
      )
    }
  }

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(dockerBuildDebuggerText.errors.copiedToast.replace('{{label}}', label))
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="analyzer" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:inline-grid bg-card/50 backdrop-blur-sm">
          <TabsTrigger value="analyzer" className="gap-2">
            <Terminal size={16} weight="bold" />
            <span className="hidden sm:inline">{dockerBuildDebuggerText.tabs.analyzer.label}</span>
            <span className="sm:hidden">{dockerBuildDebuggerText.tabs.analyzer.shortLabel}</span>
          </TabsTrigger>
          <TabsTrigger value="knowledge" className="gap-2">
            <MagnifyingGlass size={16} weight="bold" />
            <span className="hidden sm:inline">{dockerBuildDebuggerText.tabs.knowledge.label}</span>
            <span className="sm:hidden">{dockerBuildDebuggerText.tabs.knowledge.shortLabel}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analyzer" className="space-y-6">
          <LogAnalyzer
            logInput={logInput}
            onLogChange={setLogInput}
            onAnalyze={handleParse}
            onClear={() => {
              setLogInput('')
              setParsedErrors([])
            }}
            text={dockerBuildDebuggerText.analyzer}
          />
          <ErrorList
            errors={parsedErrors}
            onCopy={handleCopy}
            text={dockerBuildDebuggerText.errors}
            commonText={dockerBuildDebuggerText.common}
          />
        </TabsContent>

        <TabsContent value="knowledge" className="space-y-6">
          <KnowledgeBaseView
            onCopy={handleCopy}
            text={dockerBuildDebuggerText.knowledge}
            commonText={dockerBuildDebuggerText.common}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
