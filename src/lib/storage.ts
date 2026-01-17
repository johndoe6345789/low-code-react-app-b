import { db } from './db'

export interface StorageOptions {
  useIndexedDB?: boolean
  useSparkKV?: boolean
  preferIndexedDB?: boolean
}

const defaultOptions: StorageOptions = {
  useIndexedDB: true,
  useSparkKV: true,
  preferIndexedDB: true,
}

class HybridStorage {
  private options: StorageOptions

  constructor(options: Partial<StorageOptions> = {}) {
    this.options = { ...defaultOptions, ...options }
  }

  async get<T>(key: string): Promise<T | undefined> {
    if (this.options.preferIndexedDB && this.options.useIndexedDB) {
      try {
        const value = await db.get('settings', key)
        if (value !== undefined) {
          return value.value as T
        }
      } catch (error) {
        console.warn('IndexedDB get failed, trying Spark KV:', error)
      }
    }

    if (this.options.useSparkKV && typeof window !== 'undefined' && window.spark) {
      try {
        return await window.spark.kv.get<T>(key)
      } catch (error) {
        console.warn('Spark KV get failed:', error)
      }
    }

    if (!this.options.preferIndexedDB && this.options.useIndexedDB) {
      try {
        const value = await db.get('settings', key)
        if (value !== undefined) {
          return value.value as T
        }
      } catch (error) {
        console.warn('IndexedDB get failed:', error)
      }
    }

    return undefined
  }

  async set<T>(key: string, value: T): Promise<void> {
    const errors: Error[] = []

    if (this.options.useIndexedDB) {
      try {
        await db.put('settings', { key, value })
      } catch (error) {
        console.warn('IndexedDB set failed:', error)
        errors.push(error as Error)
      }
    }

    if (this.options.useSparkKV && typeof window !== 'undefined' && window.spark) {
      try {
        await window.spark.kv.set(key, value)
      } catch (error) {
        console.warn('Spark KV set failed:', error)
        errors.push(error as Error)
      }
    }

    if (errors.length === 2) {
      throw new Error('Both storage methods failed')
    }
  }

  async delete(key: string): Promise<void> {
    const errors: Error[] = []

    if (this.options.useIndexedDB) {
      try {
        await db.delete('settings', key)
      } catch (error) {
        console.warn('IndexedDB delete failed:', error)
        errors.push(error as Error)
      }
    }

    if (this.options.useSparkKV && typeof window !== 'undefined' && window.spark) {
      try {
        await window.spark.kv.delete(key)
      } catch (error) {
        console.warn('Spark KV delete failed:', error)
        errors.push(error as Error)
      }
    }

    if (errors.length === 2) {
      throw new Error('Both storage methods failed')
    }
  }

  async keys(): Promise<string[]> {
    const allKeys = new Set<string>()

    if (this.options.useIndexedDB) {
      try {
        const settings = await db.getAll('settings')
        settings.forEach((setting) => allKeys.add(setting.key))
      } catch (error) {
        console.warn('IndexedDB keys failed:', error)
      }
    }

    if (this.options.useSparkKV && typeof window !== 'undefined' && window.spark) {
      try {
        const sparkKeys = await window.spark.kv.keys()
        sparkKeys.forEach((key) => allKeys.add(key))
      } catch (error) {
        console.warn('Spark KV keys failed:', error)
      }
    }

    return Array.from(allKeys)
  }

  async migrateFromSparkKV(): Promise<{ migrated: number; failed: number }> {
    if (!this.options.useIndexedDB) {
      throw new Error('IndexedDB is not enabled')
    }

    if (!window.spark) {
      throw new Error('Spark KV is not available')
    }

    let migrated = 0
    let failed = 0

    try {
      const keys = await window.spark.kv.keys()

      for (const key of keys) {
        try {
          const value = await window.spark.kv.get(key)
          if (value !== undefined) {
            await db.put('settings', { key, value })
            migrated++
          }
        } catch (error) {
          console.error(`Failed to migrate key ${key}:`, error)
          failed++
        }
      }
    } catch (error) {
      console.error('Migration failed:', error)
      throw error
    }

    return { migrated, failed }
  }

  async syncToSparkKV(): Promise<{ synced: number; failed: number }> {
    if (!this.options.useSparkKV) {
      throw new Error('Spark KV is not enabled')
    }

    if (!window.spark) {
      throw new Error('Spark KV is not available')
    }

    let synced = 0
    let failed = 0

    try {
      const settings = await db.getAll('settings')

      for (const setting of settings) {
        try {
          await window.spark.kv.set(setting.key, setting.value)
          synced++
        } catch (error) {
          console.error(`Failed to sync key ${setting.key}:`, error)
          failed++
        }
      }
    } catch (error) {
      console.error('Sync failed:', error)
      throw error
    }

    return { synced, failed }
  }
}

export const storage = new HybridStorage()

export const indexedDBOnlyStorage = new HybridStorage({
  useIndexedDB: true,
  useSparkKV: false,
})

export const sparkKVOnlyStorage = new HybridStorage({
  useIndexedDB: false,
  useSparkKV: true,
})
