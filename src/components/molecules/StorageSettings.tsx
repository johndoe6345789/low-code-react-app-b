import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { useStorageBackend } from '@/hooks/use-unified-storage'
import { Database, HardDrive, Cloud, Cpu, Download, Upload } from '@phosphor-icons/react'
import {
  storageSettingsCopy,
  getBackendCopy,
  type StorageBackendKey,
} from '@/components/storage/storageSettingsConfig'
import { useStorageSwitchHandlers } from '@/components/storage/useStorageSwitchHandlers'
import { useStorageDataHandlers } from '@/components/storage/useStorageDataHandlers'

const getBackendIcon = (backend: StorageBackendKey | null) => {
  switch (backend) {
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

type BackendCardProps = {
  backend: StorageBackendKey | null
  isLoading: boolean
  flaskUrl: string
  isSwitching: boolean
  onFlaskUrlChange: (value: string) => void
  onSwitchToFlask: () => void
  onSwitchToIndexedDB: () => void
  onSwitchToSQLite: () => void
}

const BackendCard = ({
  backend,
  isLoading,
  flaskUrl,
  isSwitching,
  onFlaskUrlChange,
  onSwitchToFlask,
  onSwitchToIndexedDB,
  onSwitchToSQLite,
}: BackendCardProps) => {
  const backendCopy = getBackendCopy(backend)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getBackendIcon(backend)}
          {storageSettingsCopy.molecule.title}
        </CardTitle>
        <CardDescription>{storageSettingsCopy.molecule.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">{storageSettingsCopy.molecule.currentBackendLabel}</span>
          <Badge variant="secondary" className="flex items-center gap-1">
            {getBackendIcon(backend)}
            {backendCopy.moleculeLabel}
          </Badge>
        </div>

        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="flask-url">{storageSettingsCopy.molecule.flaskUrlLabel}</Label>
            <div className="flex gap-2">
              <Input
                id="flask-url"
                value={flaskUrl}
                onChange={(e) => onFlaskUrlChange(e.target.value)}
                placeholder={storageSettingsCopy.molecule.flaskUrlPlaceholder}
                disabled={isSwitching || isLoading}
              />
              <Button
                onClick={onSwitchToFlask}
                disabled={isSwitching || isLoading || backend === 'flask'}
                variant={backend === 'flask' ? 'secondary' : 'default'}
              >
                <Cpu className="w-4 h-4 mr-2" />
                {backend === 'flask'
                  ? storageSettingsCopy.molecule.buttons.flaskActive
                  : storageSettingsCopy.molecule.buttons.flaskUse}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">{storageSettingsCopy.molecule.flaskHelp}</p>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={onSwitchToIndexedDB}
              disabled={isSwitching || isLoading || backend === 'indexeddb'}
              variant={backend === 'indexeddb' ? 'secondary' : 'outline'}
              className="flex-1"
            >
              <HardDrive className="w-4 h-4 mr-2" />
              {backend === 'indexeddb'
                ? storageSettingsCopy.molecule.buttons.indexeddbActive
                : storageSettingsCopy.molecule.buttons.indexeddbUse}
            </Button>
            <Button
              onClick={onSwitchToSQLite}
              disabled={isSwitching || isLoading || backend === 'sqlite'}
              variant={backend === 'sqlite' ? 'secondary' : 'outline'}
              className="flex-1"
            >
              <Database className="w-4 h-4 mr-2" />
              {backend === 'sqlite'
                ? storageSettingsCopy.molecule.buttons.sqliteActive
                : storageSettingsCopy.molecule.buttons.sqliteUse}
            </Button>
          </div>

          <div className="text-xs text-muted-foreground space-y-1">
            <p>{storageSettingsCopy.molecule.backendDetails.indexeddb}</p>
            <p>{storageSettingsCopy.molecule.backendDetails.sqlite}</p>
            <p>{storageSettingsCopy.molecule.backendDetails.flask}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

type DataManagementCardProps = {
  isExporting: boolean
  isImporting: boolean
  onExport: () => void
  onImport: () => void
}

const DataManagementCard = ({
  isExporting,
  isImporting,
  onExport,
  onImport,
}: DataManagementCardProps) => (
  <Card>
    <CardHeader>
      <CardTitle>{storageSettingsCopy.molecule.dataTitle}</CardTitle>
      <CardDescription>{storageSettingsCopy.molecule.dataDescription}</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="flex gap-2">
        <Button onClick={onExport} variant="outline" className="flex-1" disabled={isExporting}>
          <Download className="w-4 h-4 mr-2" />
          {storageSettingsCopy.molecule.buttons.export}
        </Button>
        <Button onClick={onImport} variant="outline" className="flex-1" disabled={isImporting}>
          <Upload className="w-4 h-4 mr-2" />
          {storageSettingsCopy.molecule.buttons.import}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">{storageSettingsCopy.molecule.dataHelp}</p>
    </CardContent>
  </Card>
)

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
    localStorage.getItem('codeforge-flask-url') || storageSettingsCopy.molecule.flaskUrlPlaceholder
  )

  const { isSwitching, handleSwitchToFlask, handleSwitchToSQLite, handleSwitchToIndexedDB } =
    useStorageSwitchHandlers({
      backend,
      flaskUrl,
      switchToFlask,
      switchToSQLite,
      switchToIndexedDB,
    })

  const { isExporting, isImporting, handleExport, handleImport } = useStorageDataHandlers({
    exportData,
    importData,
    exportFilename: () => `${storageSettingsCopy.molecule.exportFilenamePrefix}-${Date.now()}.json`,
    importAccept: '.json',
  })

  return (
    <div className="space-y-6">
      <BackendCard
        backend={backend}
        isLoading={isLoading}
        flaskUrl={flaskUrl}
        isSwitching={isSwitching}
        onFlaskUrlChange={setFlaskUrl}
        onSwitchToFlask={handleSwitchToFlask}
        onSwitchToIndexedDB={handleSwitchToIndexedDB}
        onSwitchToSQLite={handleSwitchToSQLite}
      />
      <DataManagementCard
        isExporting={isExporting}
        isImporting={isImporting}
        onExport={handleExport}
        onImport={handleImport}
      />
    </div>
  )
}
