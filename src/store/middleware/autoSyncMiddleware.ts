import { Middleware } from '@reduxjs/toolkit'
import { syncToFlaskBulk, checkFlaskConnection } from '../slices/syncSlice'
import { RootState } from '../index'

interface AutoSyncConfig {
  enabled: boolean
  intervalMs: number
  syncOnChange: boolean
  maxQueueSize: number
}

export class AutoSyncManager {
  private config: AutoSyncConfig = {
    enabled: false,
    intervalMs: 30000,
    syncOnChange: false,
    maxQueueSize: 50,
  }

  private timer: ReturnType<typeof setTimeout> | null = null
  private lastSyncTime = 0
  private changeCounter = 0
  private dispatch: any = null
  private syncInFlight: Promise<void> | null = null
  private pendingSync = false

  configure(config: Partial<AutoSyncConfig>) {
    this.config = { ...this.config, ...config }
    
    if (this.config.enabled) {
      this.start()
    } else {
      this.stop()
    }
  }

  setDispatch(dispatch: any) {
    this.dispatch = dispatch
  }

  start() {
    if (this.timer || !this.dispatch) return

    this.timer = setInterval(() => {
      if (this.shouldSync()) {
        this.performSync()
      }
    }, this.config.intervalMs)

    this.dispatch(checkFlaskConnection())
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  }

  private shouldSync(): boolean {
    if (!this.config.enabled) return false

    const timeSinceLastSync = Date.now() - this.lastSyncTime
    if (timeSinceLastSync < this.config.intervalMs) return false

    if (this.config.syncOnChange && this.changeCounter === 0) return false

    return true
  }

  private async performSync() {
    if (!this.dispatch) return

    if (this.syncInFlight) {
      this.pendingSync = true
      return
    }

    const syncPromise = (async () => {
      try {
        await this.dispatch(syncToFlaskBulk())
        this.lastSyncTime = Date.now()
        this.changeCounter = 0
      } catch (error) {
        console.error('[AutoSync] Sync failed:', error)
      }
    })()

    this.syncInFlight = syncPromise

    try {
      await syncPromise
    } finally {
      this.syncInFlight = null
    }

    if (this.pendingSync) {
      this.pendingSync = false
      await this.performSync()
    }
  }

  trackChange() {
    this.changeCounter++
    
    if (this.changeCounter >= this.config.maxQueueSize && this.config.syncOnChange) {
      this.performSync()
    }
  }

  getConfig(): AutoSyncConfig {
    return { ...this.config }
  }

  getStatus() {
    return {
      enabled: this.config.enabled,
      lastSyncTime: this.lastSyncTime,
      changeCounter: this.changeCounter,
      nextSyncIn: this.config.enabled 
        ? Math.max(0, this.config.intervalMs - (Date.now() - this.lastSyncTime))
        : null,
    }
  }

  async syncNow() {
    await this.performSync()
  }
}

export const autoSyncManager = new AutoSyncManager()

export const createAutoSyncMiddleware = (): Middleware => {
  return (storeAPI) => {
    autoSyncManager.setDispatch(storeAPI.dispatch)

    return (next) => (action: any) => {
      const result = next(action)

      if (!action.type) return result

      if (action.type === 'settings/updateSettings' && action.payload?.autoSync !== undefined) {
        const state = storeAPI.getState() as RootState
        const { autoSync, autoSyncInterval } = (state.settings as any) || {}
        
        autoSyncManager.configure({
          enabled: autoSync ?? false,
          intervalMs: autoSyncInterval ?? 30000,
        })
      }

      const changeActions = [
        'files/addItem',
        'files/updateItem',
        'files/removeItem',
        'models/addItem',
        'models/updateItem',
        'models/removeItem',
        'components/addItem',
        'components/updateItem',
        'components/removeItem',
        'componentTrees/addItem',
        'componentTrees/updateItem',
        'componentTrees/removeItem',
        'workflows/addItem',
        'workflows/updateItem',
        'workflows/removeItem',
        'lambdas/addItem',
        'lambdas/updateItem',
        'lambdas/removeItem',
      ]

      if (changeActions.includes(action.type)) {
        autoSyncManager.trackChange()
      }

      return result
    }
  }
}

export const configureAutoSync = (config: Partial<AutoSyncConfig>) => autoSyncManager.configure(config)
export const getAutoSyncStatus = () => autoSyncManager.getStatus()
export const triggerAutoSync = () => autoSyncManager.syncNow()
