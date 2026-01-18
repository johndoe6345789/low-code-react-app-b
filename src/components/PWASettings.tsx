import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import pwaSettingsCopy from '@/data/pwa-settings.json'
import { usePWA } from '@/hooks/use-pwa'
import { useEffect, useState } from 'react'
import { CheckCircle, WifiHigh, WifiSlash, XCircle } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { CacheSection } from './pwa-settings/CacheSection'
import { InstallSection } from './pwa-settings/InstallSection'
import { NotificationsSection } from './pwa-settings/NotificationsSection'
import { UpdateSection } from './pwa-settings/UpdateSection'

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
  const [cacheSize, setCacheSize] = useState<string>(pwaSettingsCopy.defaults.cacheCalculating)

  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission)
    }

    if ('storage' in navigator && 'estimate' in navigator.storage) {
      navigator.storage.estimate().then((estimate) => {
        const usageInMB = ((estimate.usage || 0) / (1024 * 1024)).toFixed(2)
        setCacheSize(`${usageInMB} ${pwaSettingsCopy.cache.storageUnit}`)
      })
    }
  }, [])

  const handleInstall = async () => {
    const success = await installApp()
    if (success) {
      toast.success(pwaSettingsCopy.toasts.installSuccess)
    } else {
      toast.error(pwaSettingsCopy.toasts.installCancelled)
    }
  }

  const handleUpdate = () => {
    updateApp()
    toast.info(pwaSettingsCopy.toasts.update)
  }

  const handleClearCache = () => {
    clearCache()
    toast.success(pwaSettingsCopy.toasts.cacheCleared)
  }

  const handleNotificationToggle = async (enabled: boolean) => {
    if (enabled) {
      const permission = await requestNotificationPermission()
      setNotificationPermission(permission as NotificationPermission)

      if (permission === 'granted') {
        toast.success(pwaSettingsCopy.toasts.notificationsEnabled)
      } else {
        toast.error(pwaSettingsCopy.toasts.notificationsDenied)
      }
    }
  }

  return (
    <div className="h-full overflow-auto p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">{pwaSettingsCopy.header.title}</h2>
        <p className="text-sm text-muted-foreground">{pwaSettingsCopy.header.description}</p>
      </div>

      <div className="grid gap-6">
        <InstallSection
          isInstalled={isInstalled}
          isInstallable={isInstallable}
          onInstall={handleInstall}
          copy={pwaSettingsCopy.install}
        />

        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-1">{pwaSettingsCopy.connection.title}</h3>
              <p className="text-sm text-muted-foreground">{pwaSettingsCopy.connection.description}</p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isOnline ? (
                  <WifiHigh size={20} className="text-accent" />
                ) : (
                  <WifiSlash size={20} className="text-destructive" />
                )}
                <div>
                  <Label className="text-base">{pwaSettingsCopy.connection.label}</Label>
                  <p className="text-xs text-muted-foreground">
                    {isOnline ? pwaSettingsCopy.connection.status.online : pwaSettingsCopy.connection.status.offline}
                  </p>
                </div>
              </div>
              <Badge variant={isOnline ? 'default' : 'destructive'}>
                {isOnline ? pwaSettingsCopy.connection.badge.online : pwaSettingsCopy.connection.badge.offline}
              </Badge>
            </div>
          </div>
        </Card>

        <UpdateSection
          isUpdateAvailable={isUpdateAvailable}
          onUpdate={handleUpdate}
          copy={pwaSettingsCopy.update}
        />

        <NotificationsSection
          permission={notificationPermission}
          onToggle={handleNotificationToggle}
          copy={pwaSettingsCopy.notifications}
        />

        <CacheSection
          cacheSize={cacheSize}
          hasRegistration={Boolean(registration)}
          onClearCache={handleClearCache}
          copy={pwaSettingsCopy.cache}
        />

        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-1">{pwaSettingsCopy.features.title}</h3>
              <p className="text-sm text-muted-foreground">{pwaSettingsCopy.features.description}</p>
            </div>

            <div className="grid gap-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{pwaSettingsCopy.features.items.offline}</span>
                <CheckCircle size={16} className="text-accent" weight="fill" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{pwaSettingsCopy.features.items.installable}</span>
                {isInstallable || isInstalled ? (
                  <CheckCircle size={16} className="text-accent" weight="fill" />
                ) : (
                  <XCircle size={16} className="text-muted-foreground" weight="fill" />
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{pwaSettingsCopy.features.items.backgroundSync}</span>
                <CheckCircle size={16} className="text-accent" weight="fill" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{pwaSettingsCopy.features.items.pushNotifications}</span>
                {'Notification' in window ? (
                  <CheckCircle size={16} className="text-accent" weight="fill" />
                ) : (
                  <XCircle size={16} className="text-muted-foreground" weight="fill" />
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{pwaSettingsCopy.features.items.shortcuts}</span>
                <CheckCircle size={16} className="text-accent" weight="fill" />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
