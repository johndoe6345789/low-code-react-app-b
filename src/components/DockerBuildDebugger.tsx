import { useState } from 'react'
import { useKV } from '@/hooks/use-kv'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Terminal, Warning, CheckCircle, Copy, Code, MagnifyingGlass, Sparkle } from '@phosphor-icons/react'
import { parseDockerLog, getSolutionsForError, knowledgeBase } from '@/lib/docker-parser'
import { DockerError, KnowledgeBaseItem } from '@/types/docker'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

export function DockerBuildDebugger() {
  const [logInput, setLogInput] = useKV<string>('docker-log-input', '')
  const [parsedErrors, setParsedErrors] = useState<DockerError[]>([])
  const [selectedKbItem, setSelectedKbItem] = useState<KnowledgeBaseItem | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const handleParse = () => {
    if (!logInput.trim()) {
      toast.error('Please paste a Docker build log first')
      return
    }
    
    const errors = parseDockerLog(logInput)
    
    if (errors.length === 0) {
      toast.info('No errors detected in the log')
    } else {
      setParsedErrors(errors)
      toast.success(`Found ${errors.length} error${errors.length > 1 ? 's' : ''}`)
    }
  }

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} copied to clipboard`)
  }

  const filteredKnowledgeBase = knowledgeBase.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.explanation.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <Tabs defaultValue="analyzer" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:inline-grid bg-card/50 backdrop-blur-sm">
          <TabsTrigger value="analyzer" className="gap-2">
            <Terminal size={16} weight="bold" />
            <span className="hidden sm:inline">Log Analyzer</span>
            <span className="sm:hidden">Analyze</span>
          </TabsTrigger>
          <TabsTrigger value="knowledge" className="gap-2">
            <MagnifyingGlass size={16} weight="bold" />
            <span className="hidden sm:inline">Knowledge Base</span>
            <span className="sm:hidden">Knowledge</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analyzer" className="space-y-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Terminal size={20} weight="bold" className="text-primary" />
                    Paste Build Log
                  </CardTitle>
                  <CardDescription>
                    Copy your Docker build output and paste it below for analysis
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={logInput}
                onChange={(e) => setLogInput(e.target.value)}
                placeholder="Paste your Docker build log here...

Example:
#30 50.69 Error: Cannot find module @rollup/rollup-linux-arm64-musl
#30 ERROR: process '/bin/sh -c npm run build' did not complete successfully: exit code: 1"
                className="min-h-[300px] font-mono text-sm bg-secondary/50 border-border/50 focus:border-accent/50 focus:ring-accent/20"
              />
              <div className="flex gap-3">
                <Button onClick={handleParse} className="gap-2" size="lg">
                  <Sparkle size={18} weight="fill" />
                  Analyze Log
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setLogInput('')
                    setParsedErrors([])
                  }}
                  size="lg"
                >
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>

          <AnimatePresence mode="wait">
            {parsedErrors.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {parsedErrors.map((error, index) => (
                  <Card key={error.id} className="border-destructive/30 bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Warning size={24} weight="fill" className="text-destructive animate-pulse" />
                            <CardTitle className="text-destructive">Error #{index + 1}</CardTitle>
                            <Badge variant="destructive" className="font-mono">
                              {error.type}
                            </Badge>
                            {error.exitCode && (
                              <Badge variant="outline" className="font-mono">
                                Exit Code: {error.exitCode}
                              </Badge>
                            )}
                            {error.stage && (
                              <Badge variant="secondary" className="font-mono">
                                {error.stage}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground font-mono">{error.message}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {error.context.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                            <Code size={16} weight="bold" />
                            Error Context
                          </h4>
                          <ScrollArea className="h-32 rounded-md border border-border/50 bg-secondary/50 p-3">
                            <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap">
                              {error.context.join('\n')}
                            </pre>
                          </ScrollArea>
                        </div>
                      )}

                      <Separator />

                      <div>
                        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <CheckCircle size={20} weight="bold" className="text-accent" />
                          Recommended Solutions
                        </h4>
                        <div className="space-y-4">
                          {getSolutionsForError(error).map((solution, sIndex) => (
                            <motion.div
                              key={sIndex}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: sIndex * 0.1 }}
                            >
                              <Card className="bg-secondary/30 border-accent/20">
                                <CardHeader>
                                  <CardTitle className="text-base text-accent">
                                    {solution.title}
                                  </CardTitle>
                                  <CardDescription>{solution.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                  <div>
                                    <h5 className="text-sm font-semibold mb-2">Steps:</h5>
                                    <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                                      {solution.steps.map((step, stepIndex) => (
                                        <li key={stepIndex}>{step}</li>
                                      ))}
                                    </ol>
                                  </div>
                                  {solution.code && (
                                    <div>
                                      <div className="flex items-center justify-between mb-2">
                                        <h5 className="text-sm font-semibold">Code:</h5>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => handleCopy(solution.code!, 'Code')}
                                          className="gap-2 h-7"
                                        >
                                          <Copy size={14} />
                                          Copy
                                        </Button>
                                      </div>
                                      <ScrollArea className="max-h-48 rounded-md border border-border/50 bg-secondary/50 p-3">
                                        <pre className="text-xs font-mono text-foreground whitespace-pre-wrap">
                                          {solution.code}
                                        </pre>
                                      </ScrollArea>
                                      {solution.codeLanguage && (
                                        <p className="text-xs text-muted-foreground mt-1">
                                          Language: {solution.codeLanguage}
                                        </p>
                                      )}
                                    </div>
                                  )}
                                </CardContent>
                              </Card>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </TabsContent>

        <TabsContent value="knowledge" className="space-y-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MagnifyingGlass size={20} weight="bold" className="text-primary" />
                Search Knowledge Base
              </CardTitle>
              <CardDescription>
                Browse common Docker build errors and their solutions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <MagnifyingGlass 
                  size={20} 
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search errors, categories, or keywords..."
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-border/50 bg-secondary/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/50"
                />
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            {filteredKnowledgeBase.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <Card 
                  className="border-border/50 bg-card/50 backdrop-blur-sm cursor-pointer hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5 transition-all"
                  onClick={() => setSelectedKbItem(item)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base">{item.title}</CardTitle>
                      <Badge variant="secondary" className="text-xs shrink-0">
                        {item.category}
                      </Badge>
                    </div>
                    <CardDescription className="text-xs font-mono text-muted-foreground">
                      {item.pattern}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {item.explanation}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredKnowledgeBase.length === 0 && (
            <Alert>
              <AlertDescription>
                No results found for "{searchQuery}". Try different keywords.
              </AlertDescription>
            </Alert>
          )}

          <AnimatePresence mode="wait">
            {selectedKbItem && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
                onClick={() => setSelectedKbItem(null)}
              >
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.9 }}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full max-w-3xl max-h-[90vh] overflow-auto"
                >
                  <Card className="border-border bg-card">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">{selectedKbItem.category}</Badge>
                            <CardTitle>{selectedKbItem.title}</CardTitle>
                          </div>
                          <p className="text-sm font-mono text-muted-foreground">
                            Pattern: {selectedKbItem.pattern}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedKbItem(null)}
                        >
                          Close
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h4 className="font-semibold mb-2">Explanation</h4>
                        <p className="text-sm text-muted-foreground">
                          {selectedKbItem.explanation}
                        </p>
                      </div>

                      <Separator />

                      <div>
                        <h4 className="font-semibold mb-4 flex items-center gap-2">
                          <CheckCircle size={18} weight="bold" className="text-accent" />
                          Solutions
                        </h4>
                        <div className="space-y-4">
                          {selectedKbItem.solutions.map((solution, index) => (
                            <Card key={index} className="bg-secondary/30 border-accent/20">
                              <CardHeader>
                                <CardTitle className="text-base text-accent">
                                  {solution.title}
                                </CardTitle>
                                <CardDescription>{solution.description}</CardDescription>
                              </CardHeader>
                              <CardContent className="space-y-3">
                                <div>
                                  <h5 className="text-sm font-semibold mb-2">Steps:</h5>
                                  <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                                    {solution.steps.map((step, stepIndex) => (
                                      <li key={stepIndex}>{step}</li>
                                    ))}
                                  </ol>
                                </div>
                                {solution.code && (
                                  <div>
                                    <div className="flex items-center justify-between mb-2">
                                      <h5 className="text-sm font-semibold">Code:</h5>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleCopy(solution.code!, 'Code')}
                                        className="gap-2 h-7"
                                      >
                                        <Copy size={14} />
                                        Copy
                                      </Button>
                                    </div>
                                    <ScrollArea className="max-h-48 rounded-md border border-border/50 bg-secondary/50 p-3">
                                      <pre className="text-xs font-mono text-foreground whitespace-pre-wrap">
                                        {solution.code}
                                      </pre>
                                    </ScrollArea>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </TabsContent>
      </Tabs>
    </div>
  )
}
