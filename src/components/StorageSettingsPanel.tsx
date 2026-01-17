import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useStorageBackend } from '@/hooks/use-unified-storage'
import { Database, HardDrive, Cloud, Download, Upload, CircleNotch } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useState } from 'react'

export function StorageSettingsPanel() {
  const {
    backend,
    isLoading,
    switchToSQLite,
    switchToIndexedDB,
    exportData,
    importData,
  } = useStorageBackend()

  const [isSwitching, setIsSwitching] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)

  const handleSwitchToSQLite = async () => {
    if (backend === 'sqlite') {
      toast.info('Already using SQLite')
      return
    }

    setIsSwitching(true)
    try {
      await switchToSQLite()
      toast.success('Switched to SQLite storage')
    } catch (error) {
      toast.error(`Failed to switch to SQLite: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsSwitching(false)
    }
  }

  const handleSwitchToIndexedDB = async () => {
    if (backend === 'indexeddb') {
      toast.info('Already using IndexedDB')
      return
    }

    setIsSwitching(true)
    try {
      await switchToIndexedDB()
      toast.success('Switched to IndexedDB storage')
    } catch (error) {
      toast.error(`Failed to switch to IndexedDB: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsSwitching(false)
    }
  }

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const data = await exportData()
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `codeforge-data-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast.success('Data exported successfully')
    } catch (error) {
      toast.error(`Failed to export data: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsExporting(false)
    }
  }

  const handleImport = async () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'application/json'
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      setIsImporting(true)
      try {
        const text = await file.text()
        const data = JSON.parse(text)
        await importData(data)
        toast.success('Data imported successfully')
      } catch (error) {
        toast.error(`Failed to import data: ${error instanceof Error ? error.message : 'Unknown error'}`)
      } finally {
        setIsImporting(false)
      }
    }

    input.click()
  }

  const getBackendIcon = () => {
    switch (backend) {
      case 'sqlite':
        return <HardDrive className="w-5 h-5" />
      case 'indexeddb':
        return <Database className="w-5 h-5" />
      case 'sparkkv':
        return <Cloud className="w-5 h-5" />
      default:
        return <Database className="w-5 h-5" />
    }
  }

  const getBackendLabel = () => {
    switch (backend) {
      case 'sqlite':
        return 'SQLite (On-disk)'
      case 'indexeddb':
        return 'IndexedDB (Browser)'
      case 'sparkkv':
        return 'Spark KV (Cloud)'
      default:
        return 'Unknown'
    }
  }

  const getBackendDescription = () => {
    switch (backend) {
      case 'sqlite':
        return 'Data stored in SQLite database persisted to localStorage'
      case 'indexeddb':
        return 'Data stored in browser IndexedDB (recommended for most users)'
      case 'sparkkv':
        return 'Data stored in Spark cloud key-value store'
      default:
        return 'No storage backend detected'
    }
  }

  if (isLoading && !backend) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Storage Settings
          </CardTitle>
          <CardDescription>Detecting storage backend...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <CircleNotch className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5" />
          Storage Settings
        </CardTitle>
        <CardDescription>
          Manage your local data storage preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Current Backend:</span>
              {getBackendIcon()}
              <span className="text-sm">{getBackendLabel()}</span>
            </div>
            <Badge variant="secondary">{backend?.toUpperCase() || 'UNKNOWN'}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">{getBackendDescription()}</p>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-medium">Switch Storage Backend</h3>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={handleSwitchToSQLite}
              disabled={backend === 'sqlite' || isSwitching}
              variant={backend === 'sqlite' ? 'default' : 'outline'}
              size="sm"
            >
              {isSwitching ? (
                <CircleNotch className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <HardDrive className="w-4 h-4 mr-2" />
              )}
              SQLite
            </Button>
            <Button
              onClick={handleSwitchToIndexedDB}
              disabled={backend === 'indexeddb' || isSwitching}
              variant={backend === 'indexeddb' ? 'default' : 'outline'}
              size="sm"
            >
              {isSwitching ? (
                <CircleNotch className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Database className="w-4 h-4 mr-2" />
              )}
              IndexedDB
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Switching storage backends will migrate all existing data
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-medium">Data Management</h3>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={handleExport}
              disabled={isExporting}
              variant="outline"
              size="sm"
            >
              {isExporting ? (
                <CircleNotch className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              Export Data
            </Button>
            <Button
              onClick={handleImport}
              disabled={isImporting}
              variant="outline"
              size="sm"
            >
              {isImporting ? (
                <CircleNotch className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Upload className="w-4 h-4 mr-2" />
              )}
              Import Data
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Export your data as a JSON file or import from a previous backup
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
