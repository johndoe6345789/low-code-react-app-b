import { useState } from 'react'
import { ConflictItem } from '@/types/conflicts'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Database, Cloud, ArrowsLeftRight, Clock, CheckCircle } from '@phosphor-icons/react'
import { format } from 'date-fns'

interface ConflictDetailsDialogProps {
  conflict: ConflictItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onResolve: (conflictId: string, strategy: 'local' | 'remote' | 'merge') => void
  isResolving: boolean
}

export function ConflictDetailsDialog({
  conflict,
  open,
  onOpenChange,
  onResolve,
  isResolving,
}: ConflictDetailsDialogProps) {
  const [activeTab, setActiveTab] = useState<'local' | 'remote' | 'diff'>('diff')

  if (!conflict) return null

  const isLocalNewer = conflict.localTimestamp > conflict.remoteTimestamp
  const localJson = JSON.stringify(conflict.localVersion, null, 2)
  const remoteJson = JSON.stringify(conflict.remoteVersion, null, 2)

  const getDiff = () => {
    const localKeys = Object.keys(conflict.localVersion)
    const remoteKeys = Object.keys(conflict.remoteVersion)
    const allKeys = Array.from(new Set([...localKeys, ...remoteKeys]))

    return allKeys.map((key) => {
      const localValue = conflict.localVersion[key]
      const remoteValue = conflict.remoteVersion[key]
      const isDifferent = JSON.stringify(localValue) !== JSON.stringify(remoteValue)
      const onlyInLocal = !(key in conflict.remoteVersion)
      const onlyInRemote = !(key in conflict.localVersion)

      return {
        key,
        localValue,
        remoteValue,
        isDifferent,
        onlyInLocal,
        onlyInRemote,
      }
    })
  }

  const diff = getDiff()
  const conflictingKeys = diff.filter((d) => d.isDifferent)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="font-mono text-lg">Conflict Details</DialogTitle>
          <DialogDescription className="flex items-center gap-2">
            <Badge variant="outline">{conflict.entityType}</Badge>
            <span>{conflict.id}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-2">
          <div className="flex items-center gap-2">
            <Database size={20} className="text-primary" />
            <div className="flex-1">
              <div className="text-sm font-medium">Local Version</div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock size={12} />
                {format(new Date(conflict.localTimestamp), 'PPp')}
              </div>
            </div>
            {isLocalNewer && (
              <Badge variant="secondary" className="text-xs">
                Newer
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Cloud size={20} className="text-accent" />
            <div className="flex-1">
              <div className="text-sm font-medium">Remote Version</div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock size={12} />
                {format(new Date(conflict.remoteTimestamp), 'PPp')}
              </div>
            </div>
            {!isLocalNewer && (
              <Badge variant="secondary" className="text-xs">
                Newer
              </Badge>
            )}
          </div>
        </div>

        <Separator />

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="flex-1 flex flex-col min-h-0">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="diff" className="gap-2">
              <ArrowsLeftRight size={16} />
              Differences ({conflictingKeys.length})
            </TabsTrigger>
            <TabsTrigger value="local" className="gap-2">
              <Database size={16} />
              Local
            </TabsTrigger>
            <TabsTrigger value="remote" className="gap-2">
              <Cloud size={16} />
              Remote
            </TabsTrigger>
          </TabsList>

          <TabsContent value="diff" className="flex-1 min-h-0">
            <ScrollArea className="h-[400px] rounded-md border">
              <div className="p-4 space-y-2">
                {diff.map((item) => (
                  <div
                    key={item.key}
                    className={`p-3 rounded-md border ${
                      item.isDifferent
                        ? 'border-destructive/30 bg-destructive/5'
                        : 'border-border bg-muted/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-sm font-medium">{item.key}</span>
                      {item.isDifferent && (
                        <Badge variant="destructive" className="text-xs">
                          Conflict
                        </Badge>
                      )}
                      {!item.isDifferent && (
                        <Badge variant="secondary" className="text-xs">
                          <CheckCircle size={12} />
                          Match
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                      <div>
                        <div className="text-muted-foreground mb-1">Local:</div>
                        <div className={item.onlyInLocal ? 'text-primary font-medium' : ''}>
                          {item.onlyInLocal ? (
                            <Badge variant="outline" className="text-xs">Only in local</Badge>
                          ) : (
                            <pre className="whitespace-pre-wrap break-words">
                              {JSON.stringify(item.localValue, null, 2)}
                            </pre>
                          )}
                        </div>
                      </div>

                      <div>
                        <div className="text-muted-foreground mb-1">Remote:</div>
                        <div className={item.onlyInRemote ? 'text-accent font-medium' : ''}>
                          {item.onlyInRemote ? (
                            <Badge variant="outline" className="text-xs">Only in remote</Badge>
                          ) : (
                            <pre className="whitespace-pre-wrap break-words">
                              {JSON.stringify(item.remoteValue, null, 2)}
                            </pre>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="local" className="flex-1 min-h-0">
            <ScrollArea className="h-[400px] rounded-md border">
              <pre className="p-4 text-xs font-mono">{localJson}</pre>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="remote" className="flex-1 min-h-0">
            <ScrollArea className="h-[400px] rounded-md border">
              <pre className="p-4 text-xs font-mono">{remoteJson}</pre>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <Separator />

        <div className="flex justify-between gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                onResolve(conflict.id, 'local')
                onOpenChange(false)
              }}
              disabled={isResolving}
            >
              <Database size={16} />
              Keep Local
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                onResolve(conflict.id, 'remote')
                onOpenChange(false)
              }}
              disabled={isResolving}
            >
              <Cloud size={16} />
              Keep Remote
            </Button>
            <Button
              onClick={() => {
                onResolve(conflict.id, 'merge')
                onOpenChange(false)
              }}
              disabled={isResolving}
            >
              <ArrowsLeftRight size={16} />
              Merge Both
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
