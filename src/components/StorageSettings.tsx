import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Database, HardDrive, CloudArrowUp, CloudArrowDown, Trash, Info } from '@phosphor-icons/react'
import { storage } from '@/lib/storage'
import { db } from '@/lib/db'
import { toast } from 'sonner'

export function StorageSettings() {
  const [isMigrating, setIsMigrating] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [migrationProgress, setMigrationProgress] = useState(0)
  const [stats, setStats] = useState<{
    indexedDBCount: number
    sparkKVCount: number
  } | null>(null)

  const loadStats = async () => {
    try {
      const [settingsCount, sparkKeys] = await Promise.all([
        db.count('settings'),
        window.spark?.kv.keys() || Promise.resolve([]),
      ])

      setStats({
        indexedDBCount: settingsCount,
        sparkKVCount: sparkKeys.length,
      })
    } catch (error) {
      console.error('Failed to load stats:', error)
      toast.error('Failed to load storage statistics')
    }
  }

  const handleMigrate = async () => {
    setIsMigrating(true)
    setMigrationProgress(0)

    try {
      const result = await storage.migrateFromSparkKV()
      setMigrationProgress(100)

      toast.success(
        `Migration complete! ${result.migrated} items migrated${
          result.failed > 0 ? `, ${result.failed} failed` : ''
        }`
      )

      await loadStats()
    } catch (error) {
      console.error('Migration failed:', error)
      toast.error('Migration failed. Check console for details.')
    } finally {
      setIsMigrating(false)
    }
  }

  const handleSync = async () => {
    setIsSyncing(true)

    try {
      const result = await storage.syncToSparkKV()

      toast.success(
        `Sync complete! ${result.synced} items synced${
          result.failed > 0 ? `, ${result.failed} failed` : ''
        }`
      )

      await loadStats()
    } catch (error) {
      console.error('Sync failed:', error)
      toast.error('Sync failed. Check console for details.')
    } finally {
      setIsSyncing(false)
    }
  }

  const handleClearIndexedDB = async () => {
    if (!confirm('Are you sure you want to clear all IndexedDB data? This cannot be undone.')) {
      return
    }

    try {
      await db.clear('settings')
      await db.clear('files')
      await db.clear('models')
      await db.clear('components')
      await db.clear('workflows')
      await db.clear('projects')

      toast.success('IndexedDB cleared successfully')
      await loadStats()
    } catch (error) {
      console.error('Failed to clear IndexedDB:', error)
      toast.error('Failed to clear IndexedDB')
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Storage Management</h1>
        <p className="text-muted-foreground">
          Manage your local database and sync with cloud storage
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info size={20} />
            Storage Information
          </CardTitle>
          <CardDescription>
            This application uses IndexedDB as the primary local database, with Spark KV as a
            fallback/sync option
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Button onClick={loadStats} variant="outline" size="sm">
              Refresh Stats
            </Button>
          </div>

          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <HardDrive size={16} />
                    IndexedDB (Primary)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold">{stats.indexedDBCount}</span>
                    <span className="text-sm text-muted-foreground">items</span>
                  </div>
                  <Badge variant="default" className="mt-2">
                    Active
                  </Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Database size={16} />
                    Spark KV (Fallback)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold">{stats.sparkKVCount}</span>
                    <span className="text-sm text-muted-foreground">items</span>
                  </div>
                  <Badge variant="secondary" className="mt-2">
                    Backup
                  </Badge>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CloudArrowDown size={20} />
            Data Migration
          </CardTitle>
          <CardDescription>
            Migrate existing data from Spark KV to IndexedDB for improved performance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isMigrating && (
            <div className="space-y-2">
              <Progress value={migrationProgress} />
              <p className="text-sm text-muted-foreground text-center">
                Migrating data... {migrationProgress}%
              </p>
            </div>
          )}

          <Button
            onClick={handleMigrate}
            disabled={isMigrating}
            className="w-full"
            size="lg"
          >
            <CloudArrowDown size={20} className="mr-2" />
            {isMigrating ? 'Migrating...' : 'Migrate from Spark KV to IndexedDB'}
          </Button>

          <p className="text-xs text-muted-foreground">
            This will copy all data from Spark KV into IndexedDB. Your Spark KV data will remain
            unchanged.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CloudArrowUp size={20} />
            Backup & Sync
          </CardTitle>
          <CardDescription>Sync IndexedDB data back to Spark KV as a backup</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={handleSync}
            disabled={isSyncing}
            variant="outline"
            className="w-full"
            size="lg"
          >
            <CloudArrowUp size={20} className="mr-2" />
            {isSyncing ? 'Syncing...' : 'Sync to Spark KV'}
          </Button>

          <p className="text-xs text-muted-foreground">
            This will update Spark KV with your current IndexedDB data. Useful for creating backups
            or syncing across devices.
          </p>
        </CardContent>
      </Card>

      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Trash size={20} />
            Danger Zone
          </CardTitle>
          <CardDescription>Irreversible actions that affect your data</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleClearIndexedDB} variant="destructive" className="w-full">
            <Trash size={20} className="mr-2" />
            Clear All IndexedDB Data
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
