import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { usePersistence } from '@/hooks/use-persistence'
import { useAppDispatch } from '@/store'
import {
  syncToFlaskBulk,
  syncFromFlaskBulk,
  checkFlaskConnection,
} from '@/store/slices/syncSlice'
import copy from '@/data/persistence-dashboard.json'

export function usePersistenceDashboard() {
  const dispatch = useAppDispatch()
  const { status, metrics, autoSyncStatus, syncNow, configureAutoSync } = usePersistence()
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(false)
  const [syncing, setSyncing] = useState(false)

  useEffect(() => {
    dispatch(checkFlaskConnection())
    const interval = setInterval(() => {
      dispatch(checkFlaskConnection())
    }, 10000)

    return () => clearInterval(interval)
  }, [dispatch])

  const handleSyncToFlask = async () => {
    setSyncing(true)
    try {
      await dispatch(syncToFlaskBulk()).unwrap()
      toast.success(copy.toasts.syncToSuccess)
    } catch (error: any) {
      toast.error(copy.toasts.syncFailed.replace('{{error}}', String(error)))
    } finally {
      setSyncing(false)
    }
  }

  const handleSyncFromFlask = async () => {
    setSyncing(true)
    try {
      await dispatch(syncFromFlaskBulk()).unwrap()
      toast.success(copy.toasts.syncFromSuccess)
    } catch (error: any) {
      toast.error(copy.toasts.syncFailed.replace('{{error}}', String(error)))
    } finally {
      setSyncing(false)
    }
  }

  const handleAutoSyncToggle = (enabled: boolean) => {
    setAutoSyncEnabled(enabled)
    configureAutoSync({ enabled, syncOnChange: true })
    toast.info(enabled ? copy.toasts.autoSyncEnabled : copy.toasts.autoSyncDisabled)
  }

  const handleManualSync = async () => {
    try {
      await syncNow()
      toast.success(copy.toasts.manualSyncSuccess)
    } catch (error: any) {
      toast.error(copy.toasts.manualSyncFailed.replace('{{error}}', String(error)))
    }
  }

  const handleCheckConnection = () => {
    dispatch(checkFlaskConnection())
  }

  return {
    status,
    metrics,
    autoSyncStatus,
    autoSyncEnabled,
    syncing,
    handleSyncToFlask,
    handleSyncFromFlask,
    handleManualSync,
    handleAutoSyncToggle,
    handleCheckConnection,
  }
}
