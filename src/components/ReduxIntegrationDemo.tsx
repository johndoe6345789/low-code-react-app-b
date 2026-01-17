import { useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { 
  ArrowsClockwise, 
  Database, 
  CloudArrowUp, 
  CloudArrowDown,
  CheckCircle,
  XCircle,
  Clock,
  Trash,
  FilePlus
} from '@phosphor-icons/react'
import { useReduxFiles } from '@/hooks/use-redux-files'
import { useReduxComponentTrees } from '@/hooks/use-redux-component-trees'
import { useReduxSync } from '@/hooks/use-redux-sync'
import { useAppSelector } from '@/store'

export function ReduxIntegrationDemo() {
  const { files, load: loadFiles, save: saveFile, remove: removeFile } = useReduxFiles()
  const { trees, load: loadTrees } = useReduxComponentTrees()
  const { 
    status, 
    lastSyncedAt, 
    flaskConnected, 
    flaskStats,
    syncToFlask, 
    syncFromFlask,
    checkConnection,
    clearFlaskData
  } = useReduxSync()

  const settings = useAppSelector((state) => state.settings.settings)

  useEffect(() => {
    loadFiles()
    loadTrees()
  }, [loadFiles, loadTrees])

  const handleCreateTestFile = () => {
    const newFile = {
      id: `file-${Date.now()}`,
      name: `test-${Date.now()}.tsx`,
      content: '// Test file created via Redux',
      language: 'typescript',
      path: '/test',
      updatedAt: Date.now(),
    }
    saveFile(newFile)
    toast.success('Test file created and saved to IndexedDB')
  }

  const handleDeleteFile = (fileId: string) => {
    removeFile(fileId)
    toast.success('File deleted from IndexedDB')
  }

  const handleSyncUp = () => {
    syncToFlask()
    toast.info('Syncing to Flask API...')
  }

  const handleSyncDown = () => {
    syncFromFlask()
    toast.info('Syncing from Flask API...')
  }

  const handleClearFlask = () => {
    clearFlaskData()
    toast.warning('Clearing Flask storage...')
  }

  const getSyncStatusBadge = () => {
    switch (status) {
      case 'idle':
        return <Badge variant="outline">Idle</Badge>
      case 'syncing':
        return <Badge variant="secondary" className="animate-pulse">Syncing...</Badge>
      case 'success':
        return <Badge variant="default" className="bg-green-600"><CheckCircle className="w-3 h-3 mr-1" />Success</Badge>
      case 'error':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Error</Badge>
    }
  }

  const getConnectionBadge = () => {
    return flaskConnected ? (
      <Badge variant="default" className="bg-green-600">
        <CheckCircle className="w-3 h-3 mr-1" />Connected
      </Badge>
    ) : (
      <Badge variant="destructive">
        <XCircle className="w-3 h-3 mr-1" />Disconnected
      </Badge>
    )
  }

  return (
    <div className="h-full w-full overflow-auto p-6 space-y-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Redux Integration Demo</h1>
          <p className="text-muted-foreground">
            Comprehensive Redux Toolkit integration with IndexedDB and Flask API synchronization
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                IndexedDB Status
              </CardTitle>
              <CardDescription>Local browser storage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Files</span>
                <Badge variant="outline">{files.length}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Component Trees</span>
                <Badge variant="outline">{trees.length}</Badge>
              </div>
              <Separator />
              <Button 
                onClick={handleCreateTestFile} 
                variant="outline" 
                size="sm" 
                className="w-full"
              >
                <FilePlus className="w-4 h-4 mr-2" />
                Create Test File
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CloudArrowUp className="w-5 h-5" />
                Flask API Status
              </CardTitle>
              <CardDescription>Remote server connection</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Connection</span>
                {getConnectionBadge()}
              </div>
              {flaskStats && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Keys</span>
                    <Badge variant="outline">{flaskStats.totalKeys}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Storage Size</span>
                    <Badge variant="outline">
                      {(flaskStats.totalSizeBytes / 1024).toFixed(2)} KB
                    </Badge>
                  </div>
                </>
              )}
              <Separator />
              <Button 
                onClick={checkConnection} 
                variant="outline" 
                size="sm" 
                className="w-full"
              >
                <ArrowsClockwise className="w-4 h-4 mr-2" />
                Check Connection
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowsClockwise className="w-5 h-5" />
                Sync Status
              </CardTitle>
              <CardDescription>Data synchronization</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Status</span>
                {getSyncStatusBadge()}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Auto Sync</span>
                <Badge variant={settings.autoSync ? "default" : "outline"}>
                  {settings.autoSync ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
              {lastSyncedAt && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Last Sync</span>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(lastSyncedAt).toLocaleTimeString()}
                  </Badge>
                </div>
              )}
              <Separator />
              <div className="flex gap-2">
                <Button 
                  onClick={handleSyncUp} 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  disabled={!flaskConnected || status === 'syncing'}
                >
                  <CloudArrowUp className="w-4 h-4 mr-1" />
                  Push
                </Button>
                <Button 
                  onClick={handleSyncDown} 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  disabled={!flaskConnected || status === 'syncing'}
                >
                  <CloudArrowDown className="w-4 h-4 mr-1" />
                  Pull
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Files in Redux Store</CardTitle>
            <CardDescription>
              Files managed by Redux and synced with IndexedDB/Flask
            </CardDescription>
          </CardHeader>
          <CardContent>
            {files.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Database className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No files yet. Create a test file to get started.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-3 border border-border rounded-md hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="font-medium">{file.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {file.path} • Updated {new Date(file.updatedAt).toLocaleString()}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteFile(file.id)}
                    >
                      <Trash className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Component Trees in Redux Store</CardTitle>
            <CardDescription>
              JSON component trees loaded from components.json
            </CardDescription>
          </CardHeader>
          <CardContent>
            {trees.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Database className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No component trees loaded yet.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {trees.map((tree) => (
                  <div
                    key={tree.id}
                    className="flex items-center justify-between p-3 border border-border rounded-md hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="font-medium">{tree.name}</div>
                      {tree.description && (
                        <div className="text-xs text-muted-foreground">{tree.description}</div>
                      )}
                    </div>
                    <Badge variant="outline">
                      {tree.root.type}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mt-6 border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>
              Irreversible operations - use with caution
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="destructive"
              onClick={handleClearFlask}
              disabled={!flaskConnected}
            >
              <Trash className="w-4 h-4 mr-2" />
              Clear Flask Storage
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
