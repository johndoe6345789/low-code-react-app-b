import { useState } from 'react'
import { NextJsConfig, NpmSettings, NpmPackage } from '@/types/project'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Trash, Package, Cube, Code } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'

interface ProjectSettingsDesignerProps {
  nextjsConfig: NextJsConfig
  npmSettings: NpmSettings
  onNextjsConfigChange: (config: NextJsConfig | ((current: NextJsConfig) => NextJsConfig)) => void
  onNpmSettingsChange: (settings: NpmSettings | ((current: NpmSettings) => NpmSettings)) => void
}

export function ProjectSettingsDesigner({
  nextjsConfig,
  npmSettings,
  onNextjsConfigChange,
  onNpmSettingsChange,
}: ProjectSettingsDesignerProps) {
  const [packageDialogOpen, setPackageDialogOpen] = useState(false)
  const [editingPackage, setEditingPackage] = useState<NpmPackage | null>(null)
  const [scriptDialogOpen, setScriptDialogOpen] = useState(false)
  const [scriptKey, setScriptKey] = useState('')
  const [scriptValue, setScriptValue] = useState('')
  const [editingScriptKey, setEditingScriptKey] = useState<string | null>(null)

  const handleAddPackage = () => {
    setEditingPackage({
      id: `package-${Date.now()}`,
      name: '',
      version: 'latest',
      isDev: false,
    })
    setPackageDialogOpen(true)
  }

  const handleEditPackage = (pkg: NpmPackage) => {
    setEditingPackage({ ...pkg })
    setPackageDialogOpen(true)
  }

  const handleSavePackage = () => {
    if (!editingPackage || !editingPackage.name) return

    onNpmSettingsChange((current) => {
      const existingIndex = current.packages.findIndex((p) => p.id === editingPackage.id)
      if (existingIndex >= 0) {
        const updated = [...current.packages]
        updated[existingIndex] = editingPackage
        return { ...current, packages: updated }
      } else {
        return { ...current, packages: [...current.packages, editingPackage] }
      }
    })

    setPackageDialogOpen(false)
    setEditingPackage(null)
  }

  const handleDeletePackage = (packageId: string) => {
    onNpmSettingsChange((current) => ({
      ...current,
      packages: current.packages.filter((p) => p.id !== packageId),
    }))
  }

  const handleAddScript = () => {
    setScriptKey('')
    setScriptValue('')
    setEditingScriptKey(null)
    setScriptDialogOpen(true)
  }

  const handleEditScript = (key: string, value: string) => {
    setScriptKey(key)
    setScriptValue(value)
    setEditingScriptKey(key)
    setScriptDialogOpen(true)
  }

  const handleSaveScript = () => {
    if (!scriptKey || !scriptValue) return

    onNpmSettingsChange((current) => {
      const scripts = { ...current.scripts }
      if (editingScriptKey && editingScriptKey !== scriptKey) {
        delete scripts[editingScriptKey]
      }
      scripts[scriptKey] = scriptValue
      return { ...current, scripts }
    })

    setScriptDialogOpen(false)
    setScriptKey('')
    setScriptValue('')
    setEditingScriptKey(null)
  }

  const handleDeleteScript = (key: string) => {
    onNpmSettingsChange((current) => {
      const scripts = { ...current.scripts }
      delete scripts[key]
      return { ...current, scripts }
    })
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
            <Cube size={24} weight="duotone" className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Project Settings</h2>
            <p className="text-sm text-muted-foreground">
              Configure Next.js and npm settings
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="nextjs" className="flex-1 flex flex-col">
        <div className="border-b border-border px-6">
          <TabsList>
            <TabsTrigger value="nextjs">Next.js Config</TabsTrigger>
            <TabsTrigger value="packages">NPM Packages</TabsTrigger>
            <TabsTrigger value="scripts">Scripts</TabsTrigger>
          </TabsList>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-6">
            <TabsContent value="nextjs" className="mt-0">
              <div className="max-w-2xl space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Application Settings</CardTitle>
                    <CardDescription>Basic Next.js application configuration</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="app-name">Application Name</Label>
                      <Input
                        id="app-name"
                        value={nextjsConfig.appName}
                        onChange={(e) =>
                          onNextjsConfigChange((current) => ({
                            ...current,
                            appName: e.target.value,
                          }))
                        }
                        placeholder="my-nextjs-app"
                      />
                    </div>

                    <div>
                      <Label htmlFor="import-alias">Import Alias</Label>
                      <Input
                        id="import-alias"
                        value={nextjsConfig.importAlias}
                        onChange={(e) =>
                          onNextjsConfigChange((current) => ({
                            ...current,
                            importAlias: e.target.value,
                          }))
                        }
                        placeholder="@/*"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Used for module imports (e.g., import {'{'} Button {'}'} from "@/components")
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Features</CardTitle>
                    <CardDescription>Enable or disable Next.js features</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="typescript">TypeScript</Label>
                        <p className="text-xs text-muted-foreground">
                          Use TypeScript for type safety
                        </p>
                      </div>
                      <Switch
                        id="typescript"
                        checked={nextjsConfig.typescript}
                        onCheckedChange={(checked) =>
                          onNextjsConfigChange((current) => ({
                            ...current,
                            typescript: checked,
                          }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="eslint">ESLint</Label>
                        <p className="text-xs text-muted-foreground">Code linting and formatting</p>
                      </div>
                      <Switch
                        id="eslint"
                        checked={nextjsConfig.eslint}
                        onCheckedChange={(checked) =>
                          onNextjsConfigChange((current) => ({
                            ...current,
                            eslint: checked,
                          }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="tailwind">Tailwind CSS</Label>
                        <p className="text-xs text-muted-foreground">Utility-first CSS framework</p>
                      </div>
                      <Switch
                        id="tailwind"
                        checked={nextjsConfig.tailwind}
                        onCheckedChange={(checked) =>
                          onNextjsConfigChange((current) => ({
                            ...current,
                            tailwind: checked,
                          }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="src-dir">Use src/ Directory</Label>
                        <p className="text-xs text-muted-foreground">
                          Organize code inside src/ folder
                        </p>
                      </div>
                      <Switch
                        id="src-dir"
                        checked={nextjsConfig.srcDirectory}
                        onCheckedChange={(checked) =>
                          onNextjsConfigChange((current) => ({
                            ...current,
                            srcDirectory: checked,
                          }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="app-router">App Router</Label>
                        <p className="text-xs text-muted-foreground">
                          Use the new App Router (vs Pages Router)
                        </p>
                      </div>
                      <Switch
                        id="app-router"
                        checked={nextjsConfig.appRouter}
                        onCheckedChange={(checked) =>
                          onNextjsConfigChange((current) => ({
                            ...current,
                            appRouter: checked,
                          }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="turbopack">Turbopack (Beta)</Label>
                        <p className="text-xs text-muted-foreground">
                          Faster incremental bundler
                        </p>
                      </div>
                      <Switch
                        id="turbopack"
                        checked={nextjsConfig.turbopack || false}
                        onCheckedChange={(checked) =>
                          onNextjsConfigChange((current) => ({
                            ...current,
                            turbopack: checked,
                          }))
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="packages" className="mt-0">
              <div className="max-w-4xl">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold">NPM Packages</h3>
                    <p className="text-sm text-muted-foreground">
                      Manage project dependencies
                    </p>
                  </div>
                  <Button onClick={handleAddPackage}>
                    <Plus size={16} className="mr-2" />
                    Add Package
                  </Button>
                </div>

                <div className="mb-6">
                  <Label htmlFor="package-manager">Package Manager</Label>
                  <Select
                    value={npmSettings.packageManager}
                    onValueChange={(value: any) =>
                      onNpmSettingsChange((current) => ({
                        ...current,
                        packageManager: value,
                      }))
                    }
                  >
                    <SelectTrigger id="package-manager" className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="npm">npm</SelectItem>
                      <SelectItem value="yarn">yarn</SelectItem>
                      <SelectItem value="pnpm">pnpm</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-3">Dependencies</h4>
                    <div className="space-y-2">
                      {npmSettings.packages
                        .filter((pkg) => !pkg.isDev)
                        .map((pkg) => (
                          <Card key={pkg.id}>
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <Package size={18} className="text-primary" />
                                    <code className="font-semibold">{pkg.name}</code>
                                    <Badge variant="secondary">{pkg.version}</Badge>
                                  </div>
                                  {pkg.description && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                      {pkg.description}
                                    </p>
                                  )}
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleEditPackage(pkg)}
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-destructive"
                                    onClick={() => handleDeletePackage(pkg.id)}
                                  >
                                    <Trash size={16} />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      {npmSettings.packages.filter((pkg) => !pkg.isDev).length === 0 && (
                        <Card className="p-8 text-center">
                          <p className="text-muted-foreground">No dependencies added yet</p>
                        </Card>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Dev Dependencies</h4>
                    <div className="space-y-2">
                      {npmSettings.packages
                        .filter((pkg) => pkg.isDev)
                        .map((pkg) => (
                          <Card key={pkg.id}>
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <Package size={18} className="text-muted-foreground" />
                                    <code className="font-semibold">{pkg.name}</code>
                                    <Badge variant="secondary">{pkg.version}</Badge>
                                    <Badge variant="outline" className="text-xs">
                                      dev
                                    </Badge>
                                  </div>
                                  {pkg.description && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                      {pkg.description}
                                    </p>
                                  )}
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleEditPackage(pkg)}
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-destructive"
                                    onClick={() => handleDeletePackage(pkg.id)}
                                  >
                                    <Trash size={16} />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      {npmSettings.packages.filter((pkg) => pkg.isDev).length === 0 && (
                        <Card className="p-8 text-center">
                          <p className="text-muted-foreground">No dev dependencies added yet</p>
                        </Card>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="scripts" className="mt-0">
              <div className="max-w-3xl">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold">NPM Scripts</h3>
                    <p className="text-sm text-muted-foreground">
                      Define custom commands for your project
                    </p>
                  </div>
                  <Button onClick={handleAddScript}>
                    <Plus size={16} className="mr-2" />
                    Add Script
                  </Button>
                </div>

                <div className="space-y-2">
                  {Object.entries(npmSettings.scripts).map(([key, value]) => (
                    <Card key={key}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Code size={18} className="text-primary flex-shrink-0" />
                              <code className="font-semibold text-sm">{key}</code>
                            </div>
                            <code className="text-xs text-muted-foreground block truncate">
                              {value}
                            </code>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditScript(key, value)}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-destructive"
                              onClick={() => handleDeleteScript(key)}
                            >
                              <Trash size={16} />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {Object.keys(npmSettings.scripts).length === 0 && (
                    <Card className="p-8 text-center">
                      <p className="text-muted-foreground">No scripts defined yet</p>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>
          </div>
        </ScrollArea>
      </Tabs>

      <Dialog open={packageDialogOpen} onOpenChange={setPackageDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingPackage?.name ? 'Edit Package' : 'Add Package'}
            </DialogTitle>
            <DialogDescription>Configure npm package details</DialogDescription>
          </DialogHeader>
          {editingPackage && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="package-name">Package Name</Label>
                <Input
                  id="package-name"
                  value={editingPackage.name}
                  onChange={(e) =>
                    setEditingPackage({ ...editingPackage, name: e.target.value })
                  }
                  placeholder="e.g., react-query, axios"
                />
              </div>
              <div>
                <Label htmlFor="package-version">Version</Label>
                <Input
                  id="package-version"
                  value={editingPackage.version}
                  onChange={(e) =>
                    setEditingPackage({ ...editingPackage, version: e.target.value })
                  }
                  placeholder="latest, ^1.0.0, ~2.3.4"
                />
              </div>
              <div>
                <Label htmlFor="package-description">Description (Optional)</Label>
                <Input
                  id="package-description"
                  value={editingPackage.description || ''}
                  onChange={(e) =>
                    setEditingPackage({ ...editingPackage, description: e.target.value })
                  }
                  placeholder="What is this package for?"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="package-dev">Development Dependency</Label>
                <Switch
                  id="package-dev"
                  checked={editingPackage.isDev}
                  onCheckedChange={(checked) =>
                    setEditingPackage({ ...editingPackage, isDev: checked })
                  }
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setPackageDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSavePackage}>Save Package</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={scriptDialogOpen} onOpenChange={setScriptDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingScriptKey ? 'Edit Script' : 'Add Script'}</DialogTitle>
            <DialogDescription>Define a custom npm script command</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="script-name">Script Name</Label>
              <Input
                id="script-name"
                value={scriptKey}
                onChange={(e) => setScriptKey(e.target.value)}
                placeholder="e.g., dev, build, test"
              />
            </div>
            <div>
              <Label htmlFor="script-command">Command</Label>
              <Input
                id="script-command"
                value={scriptValue}
                onChange={(e) => setScriptValue(e.target.value)}
                placeholder="e.g., next dev, tsc --noEmit"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setScriptDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveScript}>Save Script</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
