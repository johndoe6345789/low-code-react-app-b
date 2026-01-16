import { useState, useEffect } from 'react'
import { CodeError } from '@/types/errors'
import { ProjectFile } from '@/types/project'
import { ErrorRepairService } from '@/lib/error-repair-service'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { 
  Warning, 
  X, 
  Wrench, 
  CheckCircle, 
  Info, 
  Lightning,
  FileCode,
  ArrowRight
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'

interface ErrorPanelProps {
  files: ProjectFile[]
  onFileChange: (fileId: string, content: string) => void
  onFileSelect: (fileId: string) => void
}

export function ErrorPanel({ files, onFileChange, onFileSelect }: ErrorPanelProps) {
  const [errors, setErrors] = useState<CodeError[]>([])
  const [isScanning, setIsScanning] = useState(false)
  const [isRepairing, setIsRepairing] = useState(false)
  const [autoRepairEnabled, setAutoRepairEnabled] = useState(false)
  const [expandedErrors, setExpandedErrors] = useState<Set<string>>(new Set())

  const scanForErrors = async () => {
    setIsScanning(true)
    try {
      const allErrors: CodeError[] = []
      
      for (const file of files) {
        const fileErrors = await ErrorRepairService.detectErrors(file)
        allErrors.push(...fileErrors)
      }
      
      setErrors(allErrors)
      
      if (allErrors.length === 0) {
        toast.success('No errors found!')
      } else {
        toast.info(`Found ${allErrors.length} issue${allErrors.length > 1 ? 's' : ''}`)
      }
    } catch (error) {
      toast.error('Error scanning failed')
      console.error(error)
    } finally {
      setIsScanning(false)
    }
  }

  const repairSingleError = async (error: CodeError) => {
    const file = files.find(f => f.id === error.fileId)
    if (!file) return

    setIsRepairing(true)
    try {
      const result = await ErrorRepairService.repairCode(file, [error])
      
      if (result.success && result.fixedCode) {
        onFileChange(file.id, result.fixedCode)
        
        setErrors(prev => prev.map(e => 
          e.id === error.id ? { ...e, isFixed: true, fixedCode: result.fixedCode } : e
        ))
        
        toast.success(`Fixed: ${error.message}`, {
          description: result.explanation,
        })
        
        await scanForErrors()
      } else {
        toast.error('Failed to repair error')
      }
    } catch (error) {
      toast.error('Repair failed')
      console.error(error)
    } finally {
      setIsRepairing(false)
    }
  }

  const repairAllErrors = async () => {
    setIsRepairing(true)
    try {
      const results = await ErrorRepairService.repairMultipleFiles(files, errors)
      
      let fixedCount = 0
      results.forEach((result, fileId) => {
        if (result.success && result.fixedCode) {
          onFileChange(fileId, result.fixedCode)
          fixedCount++
        }
      })
      
      if (fixedCount > 0) {
        toast.success(`Repaired ${fixedCount} file${fixedCount > 1 ? 's' : ''}`)
        await scanForErrors()
      } else {
        toast.error('No files could be repaired')
      }
    } catch (error) {
      toast.error('Batch repair failed')
      console.error(error)
    } finally {
      setIsRepairing(false)
    }
  }

  const repairFileWithContext = async (fileId: string) => {
    const file = files.find(f => f.id === fileId)
    if (!file) return

    const fileErrors = errors.filter(e => e.fileId === fileId)
    if (fileErrors.length === 0) return

    setIsRepairing(true)
    try {
      const relatedFiles = files.filter(f => f.id !== fileId).slice(0, 3)
      
      const result = await ErrorRepairService.repairWithContext(file, fileErrors, relatedFiles)
      
      if (result.success && result.fixedCode) {
        onFileChange(file.id, result.fixedCode)
        
        toast.success(`Repaired ${file.name}`, {
          description: result.explanation,
        })
        
        await scanForErrors()
      } else {
        toast.error('Failed to repair file')
      }
    } catch (error) {
      toast.error('Context-aware repair failed')
      console.error(error)
    } finally {
      setIsRepairing(false)
    }
  }

  const toggleErrorExpanded = (errorId: string) => {
    setExpandedErrors(prev => {
      const next = new Set(prev)
      if (next.has(errorId)) {
        next.delete(errorId)
      } else {
        next.add(errorId)
      }
      return next
    })
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'error':
        return <X size={16} weight="bold" className="text-destructive" />
      case 'warning':
        return <Warning size={16} weight="bold" className="text-yellow-500" />
      case 'info':
        return <Info size={16} weight="bold" className="text-blue-500" />
      default:
        return <Info size={16} />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'error':
        return 'destructive'
      case 'warning':
        return 'secondary'
      case 'info':
        return 'outline'
      default:
        return 'outline'
    }
  }

  const errorsByFile = errors.reduce((acc, error) => {
    if (!acc[error.fileId]) {
      acc[error.fileId] = []
    }
    acc[error.fileId].push(error)
    return acc
  }, {} as Record<string, CodeError[]>)

  const errorCount = errors.filter(e => e.severity === 'error').length
  const warningCount = errors.filter(e => e.severity === 'warning').length

  useEffect(() => {
    if (files.length > 0 && errors.length === 0) {
      scanForErrors()
    }
  }, [])

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="border-b border-border bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Wrench size={20} weight="duotone" className="text-accent" />
              <h2 className="text-lg font-semibold">Error Detection & Repair</h2>
            </div>
            {errors.length > 0 && (
              <div className="flex gap-2">
                {errorCount > 0 && (
                  <Badge variant="destructive">
                    {errorCount} {errorCount === 1 ? 'Error' : 'Errors'}
                  </Badge>
                )}
                {warningCount > 0 && (
                  <Badge variant="secondary">
                    {warningCount} {warningCount === 1 ? 'Warning' : 'Warnings'}
                  </Badge>
                )}
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={scanForErrors}
              disabled={isScanning || isRepairing}
            >
              <Lightning size={16} className="mr-2" />
              {isScanning ? 'Scanning...' : 'Scan'}
            </Button>
            <Button
              onClick={repairAllErrors}
              disabled={errors.length === 0 || isRepairing || isScanning}
            >
              <Wrench size={16} className="mr-2" />
              {isRepairing ? 'Repairing...' : 'Repair All'}
            </Button>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6">
          {errors.length === 0 && !isScanning && (
            <Card className="p-8 text-center">
              <CheckCircle size={48} weight="duotone" className="text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Issues Found</h3>
              <p className="text-sm text-muted-foreground">
                All files are looking good! Click "Scan" to check again.
              </p>
            </Card>
          )}

          {isScanning && (
            <Card className="p-8 text-center">
              <Lightning size={48} weight="duotone" className="text-accent mx-auto mb-4 animate-pulse" />
              <h3 className="text-lg font-semibold mb-2">Scanning Files...</h3>
              <p className="text-sm text-muted-foreground">
                Analyzing your code for errors and issues
              </p>
            </Card>
          )}

          {errors.length > 0 && (
            <div className="space-y-4">
              {Object.entries(errorsByFile).map(([fileId, fileErrors]) => {
                const file = files.find(f => f.id === fileId)
                if (!file) return null

                return (
                  <Card key={fileId} className="overflow-hidden">
                    <div className="bg-muted px-4 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileCode size={18} weight="duotone" />
                        <span className="font-medium">{file.name}</span>
                        <Badge variant="outline">
                          {fileErrors.length} {fileErrors.length === 1 ? 'issue' : 'issues'}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onFileSelect(fileId)}
                        >
                          <ArrowRight size={14} className="mr-1" />
                          Open
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => repairFileWithContext(fileId)}
                          disabled={isRepairing}
                        >
                          <Wrench size={14} className="mr-1" />
                          Repair
                        </Button>
                      </div>
                    </div>

                    <div className="p-4 space-y-2">
                      {fileErrors.map((error) => (
                        <Collapsible key={error.id}>
                          <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                            <div className="mt-0.5">
                              {getSeverityIcon(error.severity)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant={getSeverityColor(error.severity) as any} className="text-xs">
                                  {error.type}
                                </Badge>
                                {error.line && (
                                  <span className="text-xs text-muted-foreground">
                                    Line {error.line}
                                  </span>
                                )}
                                {error.isFixed && (
                                  <Badge variant="outline" className="text-green-500 border-green-500">
                                    <CheckCircle size={12} className="mr-1" />
                                    Fixed
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm mb-2">{error.message}</p>
                              {error.code && (
                                <CollapsibleTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-auto p-0 text-xs text-accent hover:text-accent/80"
                                  >
                                    {expandedErrors.has(error.id) ? 'Hide' : 'Show'} code
                                  </Button>
                                </CollapsibleTrigger>
                              )}
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => repairSingleError(error)}
                              disabled={isRepairing || error.isFixed}
                            >
                              <Wrench size={14} />
                            </Button>
                          </div>
                          {error.code && (
                            <CollapsibleContent>
                              <div className="ml-8 mt-2 p-3 bg-muted rounded text-xs font-mono">
                                {error.code}
                              </div>
                            </CollapsibleContent>
                          )}
                        </Collapsible>
                      ))}
                    </div>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
