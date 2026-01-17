import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Database, HardDrive, CloudArrowUp, CloudArrowDown, Trash, Info } from '@phosphor-icons/react'
import { storage } from '@/lib/storage'
import { toast } from 'sonner'
import { StorageSettingsPanel } from './StorageSettingsPanel'

export function StorageSettings() {
  const [isMigrating, setIsMigrating] = useState(false)
  const [backendType, setBackendType] = useState<'flask' | 'indexeddb' | null>(null)
  const [flaskUrl, setFlaskUrl] = useState('http://localhost:5001')
  const [stats, setStats] = useState<{
    totalKeys: number
  } | null>(null)

  useEffect(() => {
    const type = storage.getBackendType()
    setBackendType(type)
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const keys = await storage.keys()
      setStats({
        totalKeys: keys.length,
      })
    } catch (error) {
      console.error('Failed to load stats:', error)
      toast.error('Failed to load storage statistics')
    }
  }

  const handleMigrateToFlask = async () => {
    if (!flaskUrl) {
      toast.error('Please enter a Flask backend URL')
      return
    }

    setIsMigrating(true)

    try {
      const count = await storage.migrateToFlask(flaskUrl)
      toast.success(`Migration complete! ${count} items migrated to Flask backend`)
      
      setTimeout(() => window.location.reload(), 1000)
    } catch (error) {
      console.error('Migration failed:', error)
      toast.error('Migration failed. Check console for details.')
    } finally {
      setIsMigrating(false)
    }
  }

  const handleMigrateToIndexedDB = async () => {
    setIsMigrating(true)

    try {
      const count = await storage.migrateToIndexedDB()
      toast.success(`Migration complete! ${count} items migrated to IndexedDB`)
      
      setTimeout(() => window.location.reload(), 1000)
    } catch (error) {
      console.error('Migration failed:', error)
      toast.error('Migration failed. Check console for details.')
    } finally {
      setIsMigrating(false)
    }
  }

  const handleClearStorage = async () => {
    if (!confirm('Are you sure you want to clear all storage data? This cannot be undone.')) {
      return
    }

    try {
      await storage.clear()
      toast.success('Storage cleared successfully')
      await loadStats()
    } catch (error) {
      console.error('Failed to clear storage:', error)
      toast.error('Failed to clear storage')
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Storage Management</h1>
        <p className="text-muted-foreground">
          Manage your application storage backend
        </p>
      </div>

      <StorageSettingsPanel />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info size={20} />
            Current Storage Backend
          </CardTitle>
          <CardDescription>
            Your data is currently stored in:
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {backendType === 'flask' ? (
                <>
                  <Database size={24} />
                  <div>
                    <div className="font-semibold">Flask Backend (SQLite)</div>
                    <div className="text-sm text-muted-foreground">Using persistent database</div>
                  </div>
                </>
              ) : (
                <>
                  <HardDrive size={24} />
                  <div>
                    <div className="font-semibold">IndexedDB (Browser)</div>
                    <div className="text-sm text-muted-foreground">Using local browser storage</div>
                  </div>
                </>
              )}
            </div>
            <Badge variant={backendType === 'flask' ? 'default' : 'secondary'}>
              {backendType === 'flask' ? 'Server-Side' : 'Client-Side'}
            </Badge>
          </div>

          <Button onClick={loadStats} variant="outline" size="sm" className="w-full">
            Refresh Stats
          </Button>

          {stats && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">{stats.totalKeys}</span>
                  <span className="text-sm text-muted-foreground">total keys stored</span>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {backendType === 'indexeddb' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CloudArrowUp size={20} />
              Migrate to Flask Backend
            </CardTitle>
            <CardDescription>
              Switch to server-side storage using Flask + SQLite for better reliability
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="flask-url">Flask Backend URL</Label>
              <Input
                id="flask-url"
                type="url"
                placeholder="http://localhost:5001"
                value={flaskUrl}
                onChange={(e) => setFlaskUrl(e.target.value)}
                className="mt-2"
              />
            </div>

            <Button
              onClick={handleMigrateToFlask}
              disabled={isMigrating}
              className="w-full"
              size="lg"
            >
              <CloudArrowUp size={20} className="mr-2" />
              {isMigrating ? 'Migrating...' : 'Migrate to Flask Backend'}
            </Button>

            <p className="text-xs text-muted-foreground">
              This will copy all data from IndexedDB to the Flask backend. Your browser data will remain
              unchanged and the app will reload to use the new backend.
            </p>
          </CardContent>
        </Card>
      )}

      {backendType === 'flask' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CloudArrowDown size={20} />
              Migrate to IndexedDB
            </CardTitle>
            <CardDescription>
              Switch back to browser-side storage using IndexedDB
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleMigrateToIndexedDB}
              disabled={isMigrating}
              variant="outline"
              className="w-full"
              size="lg"
            >
              <CloudArrowDown size={20} className="mr-2" />
              {isMigrating ? 'Migrating...' : 'Migrate to IndexedDB'}
            </Button>

            <p className="text-xs text-muted-foreground">
              This will copy all data from Flask backend to IndexedDB. The server data will remain
              unchanged and the app will reload to use IndexedDB.
            </p>
          </CardContent>
        </Card>
      )}

      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Trash size={20} />
            Danger Zone
          </CardTitle>
          <CardDescription>Irreversible actions that affect your data</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleClearStorage} variant="destructive" className="w-full">
            <Trash size={20} className="mr-2" />
            Clear All Storage Data
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

