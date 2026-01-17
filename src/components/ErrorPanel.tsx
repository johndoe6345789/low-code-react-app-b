import { useState, useEffect } from 'react'
import { CodeError } from '@/types/errors'
import { ProjectFile } from '@/types/project'
import { ErrorRepairService } from '@/lib/error-repair-service'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
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
import {
  Badge,
  ActionButton,
  Stack,
  Flex,
  Heading,
  Text,
  EmptyState,
  IconText,
  Code,
  StatusIcon,
  PanelHeader
} from '@/components/atoms'

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
        <Flex align="center" justify="between">
          <Flex align="center" gap="md">
            <IconText icon={<Wrench size={20} weight="duotone" className="text-accent" />}>
              <Heading level={3}>Error Detection & Repair</Heading>
            </IconText>
            {errors.length > 0 && (
              <Flex gap="sm">
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
              </Flex>
            )}
          </Flex>
          <Flex gap="sm">
            <ActionButton
              icon={<Lightning size={16} />}
              label={isScanning ? 'Scanning...' : 'Scan'}
              onClick={scanForErrors}
              disabled={isScanning || isRepairing}
              variant="outline"
            />
            <ActionButton
              icon={<Wrench size={16} />}
              label={isRepairing ? 'Repairing...' : 'Repair All'}
              onClick={repairAllErrors}
              disabled={errors.length === 0 || isRepairing || isScanning}
              variant="default"
            />
          </Flex>
        </Flex>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6">
          {errors.length === 0 && !isScanning && (
            <EmptyState
              icon={<CheckCircle size={48} weight="duotone" className="text-green-500" />}
              title="No Issues Found"
              description="All files are looking good! Click 'Scan' to check again."
            />
          )}

          {isScanning && (
            <EmptyState
              icon={<Lightning size={48} weight="duotone" className="text-accent animate-pulse" />}
              title="Scanning Files..."
              description="Analyzing your code for errors and issues"
            />
          )}

          {errors.length > 0 && (
            <Stack direction="vertical" spacing="md">
              {Object.entries(errorsByFile).map(([fileId, fileErrors]) => {
                const file = files.find(f => f.id === fileId)
                if (!file) return null

                return (
                  <Card key={fileId} className="overflow-hidden">
                    <div className="bg-muted px-4 py-3">
                      <Flex align="center" justify="between">
                        <Flex align="center" gap="sm">
                          <FileCode size={18} weight="duotone" />
                          <Text className="font-medium">{file.name}</Text>
                          <Badge variant="outline" size="sm">
                            {fileErrors.length} {fileErrors.length === 1 ? 'issue' : 'issues'}
                          </Badge>
                        </Flex>
                        <Flex gap="sm">
                          <ActionButton
                            icon={<ArrowRight size={14} />}
                            label="Open"
                            onClick={() => onFileSelect(fileId)}
                            variant="outline"
                            size="sm"
                          />
                          <ActionButton
                            icon={<Wrench size={14} />}
                            label="Repair"
                            onClick={() => repairFileWithContext(fileId)}
                            disabled={isRepairing}
                            variant="default"
                            size="sm"
                          />
                        </Flex>
                      </Flex>
                    </div>

                    <div className="p-4 space-y-2">
                      {fileErrors.map((error) => (
                        <Collapsible key={error.id}>
                          <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                            <div className="mt-0.5">
                              {getSeverityIcon(error.severity)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <Flex align="center" gap="sm" className="mb-1">
                                <Badge variant={getSeverityColor(error.severity) as any} size="sm">
                                  {error.type}
                                </Badge>
                                {error.line && (
                                  <Text variant="caption">
                                    Line {error.line}
                                  </Text>
                                )}
                                {error.isFixed && (
                                  <Badge variant="outline" size="sm" className="text-green-500 border-green-500">
                                    <CheckCircle size={12} className="mr-1" />
                                    Fixed
                                  </Badge>
                                )}
                              </Flex>
                              <Text variant="body" className="mb-2">{error.message}</Text>
                              {error.code && (
                                <CollapsibleTrigger asChild>
                                  <button
                                    className="text-xs text-accent hover:text-accent/80 underline"
                                  >
                                    {expandedErrors.has(error.id) ? 'Hide' : 'Show'} code
                                  </button>
                                </CollapsibleTrigger>
                              )}
                            </div>
                            <ActionButton
                              icon={<Wrench size={14} />}
                              label=""
                              onClick={() => repairSingleError(error)}
                              disabled={isRepairing || error.isFixed}
                              variant="outline"
                              size="sm"
                            />
                          </div>
                          {error.code && (
                            <CollapsibleContent>
                              <div className="ml-8 mt-2 p-3 bg-muted rounded">
                                <Code className="text-xs">{error.code}</Code>
                              </div>
                            </CollapsibleContent>
                          )}
                        </Collapsible>
                      ))}
                    </div>
                  </Card>
                )
              })}
            </Stack>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
