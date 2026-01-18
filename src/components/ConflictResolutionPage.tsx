import { useState, useEffect } from 'react'
import { useConflictResolution } from '@/hooks/use-conflict-resolution'
import { ConflictItem, ConflictResolutionStrategy } from '@/types/conflicts'
import conflictResolutionCopy from '@/data/conflict-resolution.json'
import { ConflictResolutionHeader } from '@/components/conflict-resolution/ConflictResolutionHeader'
import { ConflictResolutionStatsSection } from '@/components/conflict-resolution/ConflictResolutionStats'
import { ConflictResolutionBulkActions } from '@/components/conflict-resolution/ConflictResolutionBulkActions'
import { ConflictResolutionFilters } from '@/components/conflict-resolution/ConflictResolutionFilters'
import { ConflictResolutionList } from '@/components/conflict-resolution/ConflictResolutionList'
import { ConflictResolutionError } from '@/components/conflict-resolution/ConflictResolutionError'
import { ConflictResolutionDetails } from '@/components/conflict-resolution/ConflictResolutionDetails'
import type {
  ConflictResolutionCopy,
  ConflictResolutionFilters as ConflictResolutionFilterType,
} from '@/components/conflict-resolution/types'
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
  const [filterType, setFilterType] = useState<ConflictResolutionFilterType>('all')
  const copy = conflictResolutionCopy as ConflictResolutionCopy

  useEffect(() => {
    detect().catch(() => {})
  }, [])

  const handleDetect = async () => {
    try {
      const detected = await detect()
      if (detected.length === 0) {
        toast.success(copy.toasts.noConflictsDetected)
      } else {
        const label =
          detected.length === 1 ? copy.labels.conflictSingular : copy.labels.conflictPlural
        toast.info(copy.toasts.foundConflicts
          .replace('{count}', String(detected.length))
          .replace('{label}', label))
      }
    } catch (err: any) {
      toast.error(err.message || copy.toasts.detectFailed)
    }
  }

  const handleResolve = async (conflictId: string, strategy: ConflictResolutionStrategy) => {
    try {
      await resolve(conflictId, strategy)
      toast.success(copy.toasts.resolved.replace('{strategy}', strategy))
    } catch (err: any) {
      toast.error(err.message || copy.toasts.resolveFailed)
    }
  }

  const handleResolveAll = async (strategy: ConflictResolutionStrategy) => {
    try {
      await resolveAll(strategy)
      toast.success(copy.toasts.resolvedAll.replace('{strategy}', strategy))
    } catch (err: any) {
      toast.error(err.message || copy.toasts.resolveAllFailed)
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
          <ConflictResolutionHeader
            copy={copy}
            hasConflicts={hasConflicts}
            detectingConflicts={detectingConflicts}
            onDetect={handleDetect}
            onClear={clear}
          />
          <ConflictResolutionStatsSection copy={copy} stats={stats} />
          {hasConflicts && (
            <ConflictResolutionBulkActions
              copy={copy}
              detectingConflicts={detectingConflicts}
              resolvingConflict={resolvingConflict}
              autoResolveStrategy={autoResolveStrategy}
              onResolveAll={handleResolveAll}
              onAutoResolveChange={(value) => setAutoResolve(value)}
            />
          )}
        </div>
      </div>

      <div className="flex-1 overflow-hidden p-6">
        <ConflictResolutionFilters
          copy={copy}
          hasConflicts={hasConflicts}
          filterType={filterType}
          onFilterChange={setFilterType}
          conflictCount={filteredConflicts.length}
        />

        <ConflictResolutionList
          copy={copy}
          conflicts={filteredConflicts}
          hasConflicts={hasConflicts}
          isDetecting={detectingConflicts}
          resolvingConflict={resolvingConflict}
          onResolve={handleResolve}
          onViewDetails={handleViewDetails}
          onDetect={handleDetect}
        />

        <ConflictResolutionError copy={copy} error={error} />
      </div>

      <ConflictResolutionDetails
        conflict={selectedConflict}
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        onResolve={handleResolve}
        isResolving={!!resolvingConflict}
      />
    </div>
  )
}
