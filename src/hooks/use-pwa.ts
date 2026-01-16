import { useState, useEffect } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

interface PWAState {
  isInstallable: boolean
  isInstalled: boolean
  isOnline: boolean
  isUpdateAvailable: boolean
  registration: ServiceWorkerRegistration | null
}

export function usePWA() {
  const [state, setState] = useState<PWAState>({
    isInstallable: false,
    isInstalled: false,
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    isUpdateAvailable: false,
    registration: null,
  })
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const checkInstalled = () => {
      try {
        const isStandalone = window.matchMedia && window.matchMedia('(display-mode: standalone)').matches
        const isIOSStandalone = (window.navigator as any).standalone === true
        setState(prev => ({ ...prev, isInstalled: isStandalone || isIOSStandalone }))
      } catch (error) {
        console.error('[PWA] Error checking install status:', error)
      }
    }

    checkInstalled()

    const handleBeforeInstallPrompt = (e: Event) => {
      try {
        e.preventDefault()
        const installEvent = e as BeforeInstallPromptEvent
        setDeferredPrompt(installEvent)
        setState(prev => ({ ...prev, isInstallable: true }))
      } catch (error) {
        console.error('[PWA] Error handling beforeinstallprompt:', error)
      }
    }

    const handleAppInstalled = () => {
      setState(prev => ({ ...prev, isInstalled: true, isInstallable: false }))
      setDeferredPrompt(null)
    }

    const handleOnline = () => {
      setState(prev => ({ ...prev, isOnline: true }))
    }

    const handleOffline = () => {
      setState(prev => ({ ...prev, isOnline: false }))
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          setState(prev => ({ ...prev, registration }))

          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  setState(prev => ({ ...prev, isUpdateAvailable: true }))
                }
              })
            }
          })

          registration.update()
        })
        .catch(error => {
          console.error('[PWA] Service Worker registration failed:', error)
        })

      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'CACHE_CLEARED') {
          window.location.reload()
        }
      })
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const installApp = async () => {
    if (!deferredPrompt) return false

    try {
      await deferredPrompt.prompt()
      const choiceResult = await deferredPrompt.userChoice
      
      if (choiceResult.outcome === 'accepted') {
        setState(prev => ({ ...prev, isInstallable: false }))
        setDeferredPrompt(null)
        return true
      }
      return false
    } catch (error) {
      console.error('[PWA] Install prompt failed:', error)
      return false
    }
  }

  const updateApp = () => {
    if (state.registration) {
      state.registration.waiting?.postMessage({ type: 'SKIP_WAITING' })
      window.location.reload()
    }
  }

  const clearCache = () => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'CLEAR_CACHE' })
    }
  }

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      return 'unsupported'
    }

    if (Notification.permission === 'granted') {
      return 'granted'
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission()
      return permission
    }

    return Notification.permission
  }

  const showNotification = async (title: string, options?: NotificationOptions) => {
    if (Notification.permission === 'granted' && state.registration) {
      await state.registration.showNotification(title, {
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        ...options,
      })
    }
  }

  return {
    ...state,
    installApp,
    updateApp,
    clearCache,
    requestNotificationPermission,
    showNotification,
  }
}
