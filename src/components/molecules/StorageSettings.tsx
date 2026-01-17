import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { useStorageBackend } from '@/hooks/use-unified-storage'
import { toast } from 'sonner'
import { Database, HardDrive, Cloud, Cpu, Download, Upload } from '@phosphor-icons/react'

export function StorageSettings() {
  const {
    backend,
    isLoading,
    switchToFlask,
    switchToIndexedDB,
    switchToSQLite,
    exportData,
    importData,
  } = useStorageBackend()

  const [flaskUrl, setFlaskUrl] = useState(
    localStorage.getItem('codeforge-flask-url') || 'http://localhost:5001'
  )
  const [isSwitching, setIsSwitching] = useState(false)

  const handleSwitchToFlask = async () => {
    setIsSwitching(true)
    try {
      await switchToFlask(flaskUrl)
      toast.success('Switched to Flask backend')
    } catch (error) {
      toast.error(`Failed to switch to Flask: ${error}`)
    } finally {
      setIsSwitching(false)
    }
  }

  const handleSwitchToIndexedDB = async () => {
    setIsSwitching(true)
    try {
      await switchToIndexedDB()
      toast.success('Switched to IndexedDB')
    } catch (error) {
      toast.error(`Failed to switch to IndexedDB: ${error}`)
    } finally {
      setIsSwitching(false)
    }
  }

  const handleSwitchToSQLite = async () => {
    setIsSwitching(true)
    try {
      await switchToSQLite()
      toast.success('Switched to SQLite')
    } catch (error) {
      toast.error(`Failed to switch to SQLite: ${error}`)
    } finally {
      setIsSwitching(false)
    }
  }

  const handleExport = async () => {
    try {
      const data = await exportData()
      const json = JSON.stringify(data, null, 2)
      const blob = new Blob([json], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `codeforge-backup-${Date.now()}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast.success('Data exported successfully')
    } catch (error) {
      toast.error(`Failed to export data: ${error}`)
    }
  }

  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      try {
        const text = await file.text()
        const data = JSON.parse(text)
        await importData(data)
        toast.success('Data imported successfully')
      } catch (error) {
        toast.error(`Failed to import data: ${error}`)
      }
    }
    input.click()
  }

  const getBackendIcon = (backendType: string | null) => {
    switch (backendType) {
      case 'flask':
        return <Cpu className="w-5 h-5" />
      case 'indexeddb':
        return <HardDrive className="w-5 h-5" />
      case 'sqlite':
        return <Database className="w-5 h-5" />
      case 'sparkkv':
        return <Cloud className="w-5 h-5" />
      default:
        return <Database className="w-5 h-5" />
    }
  }

  const getBackendLabel = (backendType: string | null) => {
    switch (backendType) {
      case 'flask':
        return 'Flask Backend'
      case 'indexeddb':
        return 'IndexedDB'
      case 'sqlite':
        return 'SQLite'
      case 'sparkkv':
        return 'Spark KV'
      default:
        return 'Unknown'
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getBackendIcon(backend)}
            Storage Backend
          </CardTitle>
          <CardDescription>
            Choose where your data is stored
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Current backend:</span>
            <Badge variant="secondary" className="flex items-center gap-1">
              {getBackendIcon(backend)}
              {getBackendLabel(backend)}
            </Badge>
          </div>

          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="flask-url">Flask Backend URL</Label>
              <div className="flex gap-2">
                <Input
                  id="flask-url"
                  value={flaskUrl}
                  onChange={(e) => setFlaskUrl(e.target.value)}
                  placeholder="http://localhost:5001"
                  disabled={isSwitching || isLoading}
                />
                <Button
                  onClick={handleSwitchToFlask}
                  disabled={isSwitching || isLoading || backend === 'flask'}
                  variant={backend === 'flask' ? 'secondary' : 'default'}
                >
                  <Cpu className="w-4 h-4 mr-2" />
                  {backend === 'flask' ? 'Active' : 'Use Flask'}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Store data on a Flask server (persistent across devices)
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleSwitchToIndexedDB}
                disabled={isSwitching || isLoading || backend === 'indexeddb'}
                variant={backend === 'indexeddb' ? 'secondary' : 'outline'}
                className="flex-1"
              >
                <HardDrive className="w-4 h-4 mr-2" />
                {backend === 'indexeddb' ? 'Active' : 'Use IndexedDB'}
              </Button>
              <Button
                onClick={handleSwitchToSQLite}
                disabled={isSwitching || isLoading || backend === 'sqlite'}
                variant={backend === 'sqlite' ? 'secondary' : 'outline'}
                className="flex-1"
              >
                <Database className="w-4 h-4 mr-2" />
                {backend === 'sqlite' ? 'Active' : 'Use SQLite'}
              </Button>
            </div>

            <div className="text-xs text-muted-foreground space-y-1">
              <p><strong>IndexedDB (Default):</strong> Browser storage, large capacity, works offline</p>
              <p><strong>SQLite:</strong> Browser storage with SQL queries, requires sql.js package</p>
              <p><strong>Flask:</strong> Server storage, persistent across devices, requires backend</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
          <CardDescription>
            Export or import your data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={handleExport} variant="outline" className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
            <Button onClick={handleImport} variant="outline" className="flex-1">
              <Upload className="w-4 h-4 mr-2" />
              Import Data
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Backup your data to a JSON file or restore from a previous backup
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
