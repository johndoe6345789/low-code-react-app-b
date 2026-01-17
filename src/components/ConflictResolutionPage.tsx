import { useState, useEffect } from 'react'
import { useConflictResolution } from '@/hooks/use-conflict-resolution'
import { ConflictItem, ConflictResolutionStrategy } from '@/types/conflicts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ConflictCard } from '@/components/ConflictCard'
import { ConflictDetailsDialog } from '@/components/ConflictDetailsDialog'
import {
  Warning,
  ArrowsClockwise,
  CheckCircle,
  XCircle,
  Database,
  Cloud,
  ArrowsLeftRight,
  Trash,
  MagnifyingGlass,
} from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

export function ConflictResolutionPage() {
  const {
    conflicts,
    stats,
    autoResolveStrategy,
    detectingConflicts,
    resolvingConflict,
    error,
    hasConflicts,
    detect,
    resolve,
    resolveAll,
    clear,
    setAutoResolve,
  } = useConflictResolution()

  const [selectedConflict, setSelectedConflict] = useState<ConflictItem | null>(null)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)
  const [filterType, setFilterType] = useState<string>('all')

  useEffect(() => {
    detect().catch(() => {})
  }, [])

  const handleDetect = async () => {
    try {
      const detected = await detect()
      if (detected.length === 0) {
        toast.success('No conflicts detected')
      } else {
        toast.info(`Found ${detected.length} conflict${detected.length === 1 ? '' : 's'}`)
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to detect conflicts')
    }
  }

  const handleResolve = async (conflictId: string, strategy: ConflictResolutionStrategy) => {
    try {
      await resolve(conflictId, strategy)
      toast.success(`Conflict resolved using ${strategy} version`)
    } catch (err: any) {
      toast.error(err.message || 'Failed to resolve conflict')
    }
  }

  const handleResolveAll = async (strategy: ConflictResolutionStrategy) => {
    try {
      await resolveAll(strategy)
      toast.success(`All conflicts resolved using ${strategy} version`)
    } catch (err: any) {
      toast.error(err.message || 'Failed to resolve all conflicts')
    }
  }

  const handleViewDetails = (conflict: ConflictItem) => {
    setSelectedConflict(conflict)
    setDetailsDialogOpen(true)
  }

  const filteredConflicts = filterType === 'all'
    ? conflicts
    : conflicts.filter(c => c.entityType === filterType)

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="flex-none border-b bg-card/50">
        <div className="p-6 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold font-mono tracking-tight">
                Conflict Resolution
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage sync conflicts between local and remote data
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleDetect}
                disabled={detectingConflicts}
              >
                <ArrowsClockwise size={16} className={detectingConflicts ? 'animate-spin' : ''} />
                Detect Conflicts
              </Button>

              {hasConflicts && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => clear()}
                >
                  <Trash size={16} />
                  Clear All
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">{stats.totalConflicts}</div>
                    <div className="text-xs text-muted-foreground">Total Conflicts</div>
                  </div>
                  <Warning size={24} className="text-destructive" weight="duotone" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">{stats.conflictsByType.files || 0}</div>
                    <div className="text-xs text-muted-foreground">Files</div>
                  </div>
                  <Database size={24} className="text-primary" weight="duotone" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">{stats.conflictsByType.models || 0}</div>
                    <div className="text-xs text-muted-foreground">Models</div>
                  </div>
                  <Database size={24} className="text-accent" weight="duotone" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">
                      {(stats.conflictsByType.components || 0) + 
                       (stats.conflictsByType.workflows || 0)}
                    </div>
                    <div className="text-xs text-muted-foreground">Other</div>
                  </div>
                  <Cloud size={24} className="text-muted-foreground" weight="duotone" />
                </div>
              </CardContent>
            </Card>
          </div>

          {hasConflicts && (
            <Card className="border-destructive/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <ArrowsLeftRight size={20} />
                  Bulk Resolution
                </CardTitle>
                <CardDescription>
                  Apply a resolution strategy to all conflicts at once
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleResolveAll('local')}
                  disabled={detectingConflicts || !!resolvingConflict}
                >
                  <Database size={16} />
                  Keep All Local
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleResolveAll('remote')}
                  disabled={detectingConflicts || !!resolvingConflict}
                >
                  <Cloud size={16} />
                  Keep All Remote
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleResolveAll('merge')}
                  disabled={detectingConflicts || !!resolvingConflict}
                >
                  <ArrowsLeftRight size={16} />
                  Merge All
                </Button>

                <Separator orientation="vertical" className="h-8 mx-2" />

                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Auto-resolve:</span>
                  <Select
                    value={autoResolveStrategy || 'none'}
                    onValueChange={(value) => 
                      setAutoResolve(value === 'none' ? null : value as ConflictResolutionStrategy)
                    }
                  >
                    <SelectTrigger className="w-[140px] h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Disabled</SelectItem>
                      <SelectItem value="local">Always Local</SelectItem>
                      <SelectItem value="remote">Always Remote</SelectItem>
                      <SelectItem value="merge">Always Merge</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-hidden p-6">
        {hasConflicts && (
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MagnifyingGlass size={20} className="text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Filter by type:</span>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[160px] h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="files">Files</SelectItem>
                  <SelectItem value="models">Models</SelectItem>
                  <SelectItem value="components">Components</SelectItem>
                  <SelectItem value="workflows">Workflows</SelectItem>
                  <SelectItem value="lambdas">Lambdas</SelectItem>
                  <SelectItem value="componentTrees">Component Trees</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Badge variant="secondary">
              {filteredConflicts.length} conflict{filteredConflicts.length === 1 ? '' : 's'}
            </Badge>
          </div>
        )}

        <ScrollArea className="h-[calc(100vh-500px)]">
          <div className="space-y-4 pr-4">
            <AnimatePresence mode="popLayout">
              {filteredConflicts.length > 0 ? (
                filteredConflicts.map((conflict) => (
                  <ConflictCard
                    key={conflict.id}
                    conflict={conflict}
                    onResolve={handleResolve}
                    onViewDetails={handleViewDetails}
                    isResolving={resolvingConflict === conflict.id}
                  />
                ))
              ) : hasConflicts ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <XCircle size={48} className="mx-auto text-muted-foreground mb-4" weight="duotone" />
                  <p className="text-muted-foreground">
                    No conflicts found for this filter
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <CheckCircle size={64} className="mx-auto text-accent mb-4" weight="duotone" />
                  <h3 className="text-xl font-semibold mb-2">No Conflicts Detected</h3>
                  <p className="text-muted-foreground mb-6">
                    Your local and remote data are in sync
                  </p>
                  <Button onClick={handleDetect} disabled={detectingConflicts}>
                    <ArrowsClockwise size={16} />
                    Check Again
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </ScrollArea>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4"
          >
            <Card className="border-destructive">
              <CardContent className="pt-6 flex items-center gap-3">
                <XCircle size={24} className="text-destructive" weight="duotone" />
                <div className="flex-1">
                  <div className="font-medium">Error</div>
                  <div className="text-sm text-muted-foreground">{error}</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

      <ConflictDetailsDialog
        conflict={selectedConflict}
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        onResolve={handleResolve}
        isResolving={!!resolvingConflict}
      />
    </div>
  )
}
