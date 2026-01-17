import { useState } from 'react'
import { ConflictItem } from '@/types/conflicts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  ArrowsLeftRight, 
  CheckCircle, 
  Clock, 
  Database,
  Cloud,
  Code,
  MagnifyingGlass,
  CaretDown,
  CaretRight,
} from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'

interface ConflictCardProps {
  conflict: ConflictItem
  onResolve: (conflictId: string, strategy: 'local' | 'remote' | 'merge') => void
  onViewDetails: (conflict: ConflictItem) => void
  isResolving: boolean
}

export function ConflictCard({ conflict, onResolve, onViewDetails, isResolving }: ConflictCardProps) {
  const [expanded, setExpanded] = useState(false)
  
  const isLocalNewer = conflict.localTimestamp > conflict.remoteTimestamp
  const timeDiff = Math.abs(conflict.localTimestamp - conflict.remoteTimestamp)
  const timeDiffMinutes = Math.round(timeDiff / 1000 / 60)

  const getEntityIcon = () => {
    switch (conflict.entityType) {
      case 'files':
        return <Code size={20} weight="duotone" className="text-primary" />
      case 'models':
        return <Database size={20} weight="duotone" className="text-accent" />
      default:
        return <Database size={20} weight="duotone" className="text-muted-foreground" />
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="border-destructive/30 hover:border-destructive/50 transition-colors">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className="mt-0.5">{getEntityIcon()}</div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-base font-mono truncate">
                  {conflict.id}
                </CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    {conflict.entityType}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {timeDiffMinutes}m difference
                  </span>
                </CardDescription>
              </div>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? <CaretDown size={16} /> : <CaretRight size={16} />}
            </Button>
          </div>
        </CardHeader>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <CardContent className="space-y-4">
                <Separator />
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Database size={16} className="text-primary" />
                      <h4 className="text-sm font-medium">Local Version</h4>
                      {isLocalNewer && (
                        <Badge variant="secondary" className="text-xs">
                          Newer
                        </Badge>
                      )}
                    </div>
                    <div className="bg-muted/50 rounded-md p-3 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock size={12} />
                        {format(new Date(conflict.localTimestamp), 'MMM d, h:mm a')}
                      </div>
                      <pre className="text-xs overflow-hidden text-ellipsis">
                        {JSON.stringify(conflict.localVersion, null, 2).slice(0, 200)}...
                      </pre>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Cloud size={16} className="text-accent" />
                      <h4 className="text-sm font-medium">Remote Version</h4>
                      {!isLocalNewer && (
                        <Badge variant="secondary" className="text-xs">
                          Newer
                        </Badge>
                      )}
                    </div>
                    <div className="bg-muted/50 rounded-md p-3 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock size={12} />
                        {format(new Date(conflict.remoteTimestamp), 'MMM d, h:mm a')}
                      </div>
                      <pre className="text-xs overflow-hidden text-ellipsis">
                        {JSON.stringify(conflict.remoteVersion, null, 2).slice(0, 200)}...
                      </pre>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onResolve(conflict.id, 'local')}
                    disabled={isResolving}
                    className="flex-1 min-w-[120px]"
                  >
                    <Database size={16} />
                    Keep Local
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onResolve(conflict.id, 'remote')}
                    disabled={isResolving}
                    className="flex-1 min-w-[120px]"
                  >
                    <Cloud size={16} />
                    Keep Remote
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onResolve(conflict.id, 'merge')}
                    disabled={isResolving}
                    className="flex-1 min-w-[120px]"
                  >
                    <ArrowsLeftRight size={16} />
                    Merge Both
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => onViewDetails(conflict)}
                    disabled={isResolving}
                  >
                    <MagnifyingGlass size={16} />
                    Details
                  </Button>
                </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  )
}
