import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { usePWA } from '@/hooks/use-pwa'
import { useState, useEffect } from 'react'
import { 
  Download, 
  CloudArrowDown, 
  Trash, 
  Bell, 
  WifiSlash, 
  WifiHigh,
  CheckCircle,
  XCircle,
  Question
} from '@phosphor-icons/react'
import { toast } from 'sonner'

export function PWASettings() {
  const { 
    isInstalled, 
    isInstallable, 
    isOnline, 
    isUpdateAvailable,
    installApp, 
    updateApp, 
    clearCache,
    requestNotificationPermission,
    registration
  } = usePWA()
  
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default')
  const [cacheSize, setCacheSize] = useState<string>('Calculating...')

  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission)
    }

    if ('storage' in navigator && 'estimate' in navigator.storage) {
      navigator.storage.estimate().then(estimate => {
        const usageInMB = ((estimate.usage || 0) / (1024 * 1024)).toFixed(2)
        setCacheSize(`${usageInMB} MB`)
      })
    }
  }, [])

  const handleInstall = async () => {
    const success = await installApp()
    if (success) {
      toast.success('App installed successfully!')
    } else {
      toast.error('Installation cancelled')
    }
  }

  const handleUpdate = () => {
    updateApp()
    toast.info('Updating app...')
  }

  const handleClearCache = () => {
    clearCache()
    toast.success('Cache cleared! Reloading...')
  }

  const handleNotificationToggle = async (enabled: boolean) => {
    if (enabled) {
      const permission = await requestNotificationPermission()
      setNotificationPermission(permission as NotificationPermission)
      
      if (permission === 'granted') {
        toast.success('Notifications enabled')
      } else {
        toast.error('Notification permission denied')
      }
    }
  }

  const getPermissionIcon = () => {
    switch (notificationPermission) {
      case 'granted':
        return <CheckCircle size={16} className="text-accent" weight="fill" />
      case 'denied':
        return <XCircle size={16} className="text-destructive" weight="fill" />
      default:
        return <Question size={16} className="text-muted-foreground" weight="fill" />
    }
  }

  return (
    <div className="h-full overflow-auto p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">PWA Settings</h2>
        <p className="text-sm text-muted-foreground">
          Configure Progressive Web App features and behavior
        </p>
      </div>

      <div className="grid gap-6">
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-1">Installation Status</h3>
              <p className="text-sm text-muted-foreground">
                Install the app for offline access and better performance
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Download size={20} className="text-muted-foreground" />
                <div>
                  <Label className="text-base">App Installation</Label>
                  <p className="text-xs text-muted-foreground">
                    {isInstalled ? 'Installed' : isInstallable ? 'Available' : 'Not available'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isInstalled && (
                  <Badge variant="default">Installed</Badge>
                )}
                {isInstallable && !isInstalled && (
                  <Button size="sm" onClick={handleInstall}>
                    Install Now
                  </Button>
                )}
                {!isInstallable && !isInstalled && (
                  <Badge variant="secondary">Not Available</Badge>
                )}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-1">Connection Status</h3>
              <p className="text-sm text-muted-foreground">
                Current network connectivity status
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isOnline ? (
                  <WifiHigh size={20} className="text-accent" />
                ) : (
                  <WifiSlash size={20} className="text-destructive" />
                )}
                <div>
                  <Label className="text-base">Network Status</Label>
                  <p className="text-xs text-muted-foreground">
                    {isOnline ? 'Connected to internet' : 'Working offline'}
                  </p>
                </div>
              </div>
              <Badge variant={isOnline ? 'default' : 'destructive'}>
                {isOnline ? 'Online' : 'Offline'}
              </Badge>
            </div>
          </div>
        </Card>

        {isUpdateAvailable && (
          <Card className="p-6 border-accent">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-1">Update Available</h3>
                <p className="text-sm text-muted-foreground">
                  A new version of the app is ready to install
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CloudArrowDown size={20} className="text-accent" />
                  <div>
                    <Label className="text-base">App Update</Label>
                    <p className="text-xs text-muted-foreground">
                      Update now for latest features
                    </p>
                  </div>
                </div>
                <Button onClick={handleUpdate}>
                  Update Now
                </Button>
              </div>
            </div>
          </Card>
        )}

        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-1">Notifications</h3>
              <p className="text-sm text-muted-foreground">
                Receive updates about your projects and builds
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell size={20} className="text-muted-foreground" />
                <div>
                  <Label className="text-base">Push Notifications</Label>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-muted-foreground">
                      Permission: {notificationPermission}
                    </p>
                    {getPermissionIcon()}
                  </div>
                </div>
              </div>
              <Switch
                checked={notificationPermission === 'granted'}
                onCheckedChange={handleNotificationToggle}
                disabled={notificationPermission === 'denied'}
              />
            </div>

            {notificationPermission === 'denied' && (
              <div className="text-xs text-destructive bg-destructive/10 p-3 rounded-md">
                Notifications are blocked. Please enable them in your browser settings.
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-1">Cache Management</h3>
              <p className="text-sm text-muted-foreground">
                Manage offline storage and cached resources
              </p>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Cache Size</Label>
                <span className="text-sm font-mono text-muted-foreground">{cacheSize}</span>
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-sm">Service Worker</Label>
                <Badge variant={registration ? 'default' : 'secondary'}>
                  {registration ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>

            <Separator />

            <Button 
              variant="destructive" 
              className="w-full" 
              onClick={handleClearCache}
            >
              <Trash size={16} className="mr-2" />
              Clear Cache & Reload
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              This will remove all cached files and reload the app
            </p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-1">PWA Features</h3>
              <p className="text-sm text-muted-foreground">
                Progressive Web App capabilities
              </p>
            </div>

            <div className="grid gap-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Offline Support</span>
                <CheckCircle size={16} className="text-accent" weight="fill" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Installable</span>
                {isInstallable || isInstalled ? (
                  <CheckCircle size={16} className="text-accent" weight="fill" />
                ) : (
                  <XCircle size={16} className="text-muted-foreground" weight="fill" />
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Background Sync</span>
                <CheckCircle size={16} className="text-accent" weight="fill" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Push Notifications</span>
                {'Notification' in window ? (
                  <CheckCircle size={16} className="text-accent" weight="fill" />
                ) : (
                  <XCircle size={16} className="text-muted-foreground" weight="fill" />
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">App Shortcuts</span>
                <CheckCircle size={16} className="text-accent" weight="fill" />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
