import { Middleware } from '@reduxjs/toolkit'
import { db } from '@/lib/db'
import { syncToFlask } from './flaskSync'
import { RootState } from '../index'

interface PersistenceConfig {
  storeName: string
  enabled: boolean
  syncToFlask: boolean
  debounceMs: number
  batchSize: number
}

const defaultConfig: PersistenceConfig = {
  storeName: '',
  enabled: true,
  syncToFlask: true,
  debounceMs: 300,
  batchSize: 10,
}

const sliceToPersistenceMap: Record<string, PersistenceConfig> = {
  files: { ...defaultConfig, storeName: 'files' },
  models: { ...defaultConfig, storeName: 'models' },
  components: { ...defaultConfig, storeName: 'components' },
  componentTrees: { ...defaultConfig, storeName: 'componentTrees' },
  workflows: { ...defaultConfig, storeName: 'workflows' },
  lambdas: { ...defaultConfig, storeName: 'lambdas' },
  theme: { ...defaultConfig, storeName: 'theme' },
  settings: { ...defaultConfig, storeName: 'settings', syncToFlask: false },
}

type PendingOperation = {
  type: 'put' | 'delete'
  storeName: string
  key: string
  value?: any
  timestamp: number
}

class PersistenceQueue {
  private queue: Map<string, PendingOperation> = new Map()
  private processing = false
  private pendingFlush = false
  private debounceTimers: Map<string, ReturnType<typeof setTimeout>> = new Map()

  enqueue(operation: PendingOperation, debounceMs: number) {
    const opKey = `${operation.storeName}:${operation.key}`
    
    const existingTimer = this.debounceTimers.get(opKey)
    if (existingTimer) {
      clearTimeout(existingTimer)
    }

    this.queue.set(opKey, operation)

    const timer = setTimeout(() => {
      this.debounceTimers.delete(opKey)
      this.processQueue()
    }, debounceMs)

    this.debounceTimers.set(opKey, timer)
  }

  async processQueue() {
    if (this.processing) {
      this.pendingFlush = true
      return
    }

    if (this.queue.size === 0) return

    this.processing = true

    try {
      const operations = Array.from(this.queue.values())
      this.queue.clear()

      const results = await Promise.allSettled(
        operations.map(async (op) => {
          try {
            if (op.type === 'put') {
              await db.put(op.storeName as any, op.value)
              if (sliceToPersistenceMap[op.storeName]?.syncToFlask) {
                await syncToFlask(op.storeName, op.key, op.value, 'put')
              }
            } else if (op.type === 'delete') {
              await db.delete(op.storeName as any, op.key)
              if (sliceToPersistenceMap[op.storeName]?.syncToFlask) {
                await syncToFlask(op.storeName, op.key, null, 'delete')
              }
            }
          } catch (error) {
            console.error(`[PersistenceMiddleware] Failed to persist ${op.type} for ${op.storeName}:${op.key}`, error)
            throw error
          }
        })
      )

      const failed = results.filter(r => r.status === 'rejected')
      if (failed.length > 0) {
        console.warn(`[PersistenceMiddleware] ${failed.length} operations failed`)
      }
    } finally {
      this.processing = false
      const needsFlush = this.pendingFlush || this.queue.size > 0
      this.pendingFlush = false
      if (needsFlush) {
        await this.processQueue()
      }
    }
  }

  async flush() {
    for (const timer of this.debounceTimers.values()) {
      clearTimeout(timer)
    }
    this.debounceTimers.clear()
    await this.processQueue()
  }
}

const persistenceQueue = new PersistenceQueue()

export const createPersistenceMiddleware = (): Middleware => {
  return (storeAPI) => (next) => (action: any) => {
    const result = next(action)

    if (!action.type) return result

    const [sliceName, actionName] = action.type.split('/')

    const config = sliceToPersistenceMap[sliceName]
    if (!config || !config.enabled) return result

    const state = storeAPI.getState() as RootState

    const sliceState = state[sliceName as keyof RootState]
    if (!sliceState) return result

    try {
      if (actionName === 'addItem' || actionName === 'updateItem' || actionName === 'saveFile' || 
          actionName === 'saveModel' || actionName === 'saveComponent' || actionName === 'saveComponentTree' ||
          actionName === 'saveWorkflow' || actionName === 'saveLambda') {
        
        const item = action.payload
        if (item && item.id) {
          persistenceQueue.enqueue({
            type: 'put',
            storeName: config.storeName,
            key: item.id,
            value: { ...item, updatedAt: Date.now() },
            timestamp: Date.now(),
          }, config.debounceMs)
        }
      }

      if (actionName === 'addItems' || actionName === 'setItems' || actionName === 'setFiles' || 
          actionName === 'setModels' || actionName === 'setComponents' || actionName === 'setComponentTrees' ||
          actionName === 'setWorkflows' || actionName === 'setLambdas') {
        
        const items = action.payload
        if (Array.isArray(items)) {
          items.forEach((item: any) => {
            if (item && item.id) {
              persistenceQueue.enqueue({
                type: 'put',
                storeName: config.storeName,
                key: item.id,
                value: { ...item, updatedAt: Date.now() },
                timestamp: Date.now(),
              }, config.debounceMs)
            }
          })
        }
      }

      if (actionName === 'removeItem' || actionName === 'deleteFile' || actionName === 'deleteModel' ||
          actionName === 'deleteComponent' || actionName === 'deleteComponentTree' || 
          actionName === 'deleteWorkflow' || actionName === 'deleteLambda') {
        
        const itemId = typeof action.payload === 'string' ? action.payload : action.payload?.id
        if (itemId) {
          persistenceQueue.enqueue({
            type: 'delete',
            storeName: config.storeName,
            key: itemId,
            timestamp: Date.now(),
          }, config.debounceMs)
        }
      }

      if (actionName === 'setTheme') {
        persistenceQueue.enqueue({
          type: 'put',
          storeName: 'theme',
          key: 'current',
          value: action.payload,
          timestamp: Date.now(),
        }, config.debounceMs)
      }

      if (actionName === 'updateSettings') {
        persistenceQueue.enqueue({
          type: 'put',
          storeName: 'settings',
          key: 'appSettings',
          value: action.payload,
          timestamp: Date.now(),
        }, config.debounceMs)
      }

    } catch (error) {
      console.error('[PersistenceMiddleware] Error handling action:', action.type, error)
    }

    return result
  }
}

export const flushPersistence = () => persistenceQueue.flush()

export const configurePersistence = (sliceName: string, config: Partial<PersistenceConfig>) => {
  if (sliceToPersistenceMap[sliceName]) {
    sliceToPersistenceMap[sliceName] = {
      ...sliceToPersistenceMap[sliceName],
      ...config,
    }
  }
}

export const disablePersistence = (sliceName: string) => {
  if (sliceToPersistenceMap[sliceName]) {
    sliceToPersistenceMap[sliceName].enabled = false
  }
}

export const enablePersistence = (sliceName: string) => {
  if (sliceToPersistenceMap[sliceName]) {
    sliceToPersistenceMap[sliceName].enabled = true
  }
}
