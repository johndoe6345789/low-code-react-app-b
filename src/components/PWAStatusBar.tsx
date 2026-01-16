import { usePWA } from '@/hooks/use-pwa'
import { WifiSlash, WifiHigh } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

export function PWAStatusBar() {
  const { isOnline } = usePWA()
  const [showOffline, setShowOffline] = useState(false)

  useEffect(() => {
    if (!isOnline) {
      setShowOffline(true)
    } else if (showOffline) {
      const timer = setTimeout(() => {
        setShowOffline(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isOnline, showOffline])

  return (
    <AnimatePresence>
      {showOffline && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`fixed top-0 left-0 right-0 z-50 py-2 px-4 text-center text-sm font-medium ${
            isOnline 
              ? 'bg-accent text-accent-foreground' 
              : 'bg-destructive text-destructive-foreground'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            {isOnline ? (
              <>
                <WifiHigh size={16} weight="bold" />
                <span>Back online</span>
              </>
            ) : (
              <>
                <WifiSlash size={16} weight="bold" />
                <span>You're offline - Changes will sync when you reconnect</span>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
