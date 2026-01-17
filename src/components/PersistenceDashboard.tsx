import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { 
  Database, 
  CloudArrowUp, 
  CloudArrowDown, 
  ArrowsClockwise, 
  CheckCircle, 
  XCircle,
  Clock,
  ChartLine,
  Gauge
} from '@phosphor-icons/react'
import { usePersistence } from '@/hooks/use-persistence'
import { useAppDispatch, useAppSelector } from '@/store'
import { syncToFlaskBulk, syncFromFlaskBulk, checkFlaskConnection } from '@/store/slices/syncSlice'
import { toast } from 'sonner'

export function PersistenceDashboard() {
  const dispatch = useAppDispatch()
  const { status, metrics, autoSyncStatus, syncNow, configureAutoSync } = usePersistence()
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(false)
  const [syncing, setSyncing] = useState(false)

  useEffect(() => {
    dispatch(checkFlaskConnection())
    const interval = setInterval(() => {
      dispatch(checkFlaskConnection())
    }, 10000)

    return () => clearInterval(interval)
  }, [dispatch])

  const handleSyncToFlask = async () => {
    setSyncing(true)
    try {
      await dispatch(syncToFlaskBulk()).unwrap()
      toast.success('Successfully synced to Flask')
    } catch (error: any) {
      toast.error(`Sync failed: ${error}`)
    } finally {
      setSyncing(false)
    }
  }

  const handleSyncFromFlask = async () => {
    setSyncing(true)
    try {
      await dispatch(syncFromFlaskBulk()).unwrap()
      toast.success('Successfully synced from Flask')
    } catch (error: any) {
      toast.error(`Sync failed: ${error}`)
    } finally {
      setSyncing(false)
    }
  }

  const handleAutoSyncToggle = (enabled: boolean) => {
    setAutoSyncEnabled(enabled)
    configureAutoSync({ enabled, syncOnChange: true })
    toast.info(enabled ? 'Auto-sync enabled' : 'Auto-sync disabled')
  }

  const handleManualSync = async () => {
    try {
      await syncNow()
      toast.success('Manual sync completed')
    } catch (error: any) {
      toast.error(`Manual sync failed: ${error}`)
    }
  }

  const getStatusColor = () => {
    if (!status.flaskConnected) return 'bg-destructive'
    if (status.syncStatus === 'syncing') return 'bg-amber-500'
    if (status.syncStatus === 'success') return 'bg-accent'
    if (status.syncStatus === 'error') return 'bg-destructive'
    return 'bg-muted'
  }

  const getStatusText = () => {
    if (!status.flaskConnected) return 'Disconnected'
    if (status.syncStatus === 'syncing') return 'Syncing...'
    if (status.syncStatus === 'success') return 'Synced'
    if (status.syncStatus === 'error') return 'Error'
    return 'Idle'
  }

  const formatTime = (timestamp: number | null) => {
    if (!timestamp) return 'Never'
    const date = new Date(timestamp)
    return date.toLocaleTimeString()
  }

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`
    return `${(ms / 1000).toFixed(1)}s`
  }

  const getSuccessRate = () => {
    if (metrics.totalOperations === 0) return 0
    return Math.round((metrics.successfulOperations / metrics.totalOperations) * 100)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Persistence & Sync Dashboard</h1>
        <Badge className={`${getStatusColor()} text-white`}>
          {getStatusText()}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6 space-y-4 border-sidebar-border hover:bg-muted/50 transition-colors">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Database className="text-primary" />
              Connection Status
            </h3>
            {status.flaskConnected ? (
              <CheckCircle className="text-accent" weight="fill" />
            ) : (
              <XCircle className="text-destructive" weight="fill" />
            )}
          </div>
          <Separator />
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Local Storage:</span>
              <span className="font-medium">IndexedDB</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Remote Storage:</span>
              <span className="font-medium">
                {status.flaskConnected ? 'Flask API' : 'Offline'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Last Sync:</span>
              <span className="font-medium">{formatTime(status.lastSyncTime)}</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-4 border-sidebar-border hover:bg-muted/50 transition-colors">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <ChartLine className="text-accent" />
              Sync Metrics
            </h3>
            <Gauge className="text-muted-foreground" />
          </div>
          <Separator />
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Operations:</span>
              <span className="font-medium">{metrics.totalOperations}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Success Rate:</span>
              <span className="font-medium text-accent">{getSuccessRate()}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Avg Duration:</span>
              <span className="font-medium">{formatDuration(metrics.averageOperationTime)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Failed:</span>
              <span className="font-medium text-destructive">{metrics.failedOperations}</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-4 border-sidebar-border hover:bg-muted/50 transition-colors">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Clock className="text-amber-500" />
              Auto-Sync
            </h3>
            <Switch checked={autoSyncEnabled} onCheckedChange={handleAutoSyncToggle} />
          </div>
          <Separator />
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Status:</span>
              <span className="font-medium">
                {autoSyncStatus.enabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Changes Pending:</span>
              <span className="font-medium">{autoSyncStatus.changeCounter}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Next Sync:</span>
              <span className="font-medium">
                {autoSyncStatus.nextSyncIn !== null 
                  ? formatDuration(autoSyncStatus.nextSyncIn)
                  : 'N/A'}
              </span>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6 space-y-4 border-sidebar-border">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <ArrowsClockwise className="text-primary" />
          Manual Sync Operations
        </h3>
        <Separator />
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={handleSyncToFlask}
            disabled={syncing || !status.flaskConnected}
            className="flex items-center gap-2"
          >
            <CloudArrowUp />
            Push to Flask
          </Button>
          <Button
            onClick={handleSyncFromFlask}
            disabled={syncing || !status.flaskConnected}
            variant="outline"
            className="flex items-center gap-2"
          >
            <CloudArrowDown />
            Pull from Flask
          </Button>
          <Button
            onClick={handleManualSync}
            disabled={syncing || !autoSyncStatus.enabled}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowsClockwise />
            Trigger Auto-Sync
          </Button>
          <Button
            onClick={() => dispatch(checkFlaskConnection())}
            variant="outline"
            className="flex items-center gap-2"
          >
            <CheckCircle />
            Check Connection
          </Button>
        </div>
      </Card>

      {status.error && (
        <Card className="p-6 border-destructive bg-destructive/10">
          <div className="flex items-start gap-3">
            <XCircle className="text-destructive mt-1" weight="fill" />
            <div>
              <h3 className="font-semibold text-destructive mb-1">Sync Error</h3>
              <p className="text-sm text-muted-foreground">{status.error}</p>
            </div>
          </div>
        </Card>
      )}

      <Card className="p-6 space-y-4 border-sidebar-border">
        <h3 className="text-lg font-semibold">How Persistence Works</h3>
        <Separator />
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>
            <strong className="text-foreground">Automatic Persistence:</strong> All Redux state changes are automatically persisted to IndexedDB with a 300ms debounce.
          </p>
          <p>
            <strong className="text-foreground">Flask Sync:</strong> When connected, data is synced bidirectionally with the Flask API backend.
          </p>
          <p>
            <strong className="text-foreground">Auto-Sync:</strong> Enable auto-sync to automatically push changes to Flask at regular intervals (default: 30s).
          </p>
          <p>
            <strong className="text-foreground">Conflict Resolution:</strong> When conflicts are detected during sync, you'll be notified to resolve them manually.
          </p>
        </div>
      </Card>
    </div>
  )
}
