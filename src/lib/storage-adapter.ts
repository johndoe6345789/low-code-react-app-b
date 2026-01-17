const FLASK_BACKEND_URL = import.meta.env.VITE_FLASK_BACKEND_URL || 
  (typeof window !== 'undefined' && (window as any).FLASK_BACKEND_URL) || 
  ''

const USE_FLASK_BACKEND = (import.meta.env.VITE_USE_FLASK_BACKEND === 'true' || 
  (typeof window !== 'undefined' && (window as any).USE_FLASK_BACKEND === 'true')) &&
  FLASK_BACKEND_URL !== ''

export interface StorageAdapter {
  get<T>(key: string): Promise<T | undefined>
  set<T>(key: string, value: T): Promise<void>
  delete(key: string): Promise<void>
  keys(): Promise<string[]>
  clear(): Promise<void>
}

class FlaskBackendAdapter implements StorageAdapter {
  private baseUrl: string
  private isAvailable: boolean | null = null
  private readonly TIMEOUT_MS = 2000

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, '')
  }

  private async fetchWithTimeout(url: string, options: RequestInit = {}): Promise<Response> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT_MS)

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      })
      clearTimeout(timeoutId)
      return response
    } catch (error: any) {
      clearTimeout(timeoutId)
      if (error.name === 'AbortError') {
        throw new Error(`Request timeout after ${this.TIMEOUT_MS}ms`)
      }
      throw error
    }
  }

  private async checkAvailability(): Promise<boolean> {
    if (this.isAvailable !== null) {
      return this.isAvailable
    }

    try {
      const response = await this.fetchWithTimeout(`${this.baseUrl}/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
      this.isAvailable = response.ok
      console.log('[StorageAdapter] Flask backend available:', this.isAvailable)
      return this.isAvailable
    } catch (error) {
      console.warn('[StorageAdapter] Flask backend not available:', error)
      this.isAvailable = false
      return false
    }
  }

  async get<T>(key: string): Promise<T | undefined> {
    if (!(await this.checkAvailability())) {
      throw new Error('Flask backend not available')
    }

    try {
      const response = await this.fetchWithTimeout(`${this.baseUrl}/api/storage/${encodeURIComponent(key)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })

      if (response.status === 404) {
        return undefined
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data.value as T
    } catch (error) {
      console.error(`[StorageAdapter] Error getting key ${key}:`, error)
      this.isAvailable = false
      throw error
    }
  }

  async set<T>(key: string, value: T): Promise<void> {
    if (!(await this.checkAvailability())) {
      throw new Error('Flask backend not available')
    }

    try {
      const response = await this.fetchWithTimeout(`${this.baseUrl}/api/storage/${encodeURIComponent(key)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
    } catch (error) {
      console.error(`[StorageAdapter] Error setting key ${key}:`, error)
      this.isAvailable = false
      throw error
    }
  }

  async delete(key: string): Promise<void> {
    if (!(await this.checkAvailability())) {
      throw new Error('Flask backend not available')
    }

    try {
      const response = await this.fetchWithTimeout(`${this.baseUrl}/api/storage/${encodeURIComponent(key)}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      })

      if (response.status === 404) {
        return
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
    } catch (error) {
      console.error(`[StorageAdapter] Error deleting key ${key}:`, error)
      this.isAvailable = false
      throw error
    }
  }

  async keys(): Promise<string[]> {
    if (!(await this.checkAvailability())) {
      throw new Error('Flask backend not available')
    }

    try {
      const response = await this.fetchWithTimeout(`${this.baseUrl}/api/storage/keys`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data.keys
    } catch (error) {
      console.error('[StorageAdapter] Error getting keys:', error)
      this.isAvailable = false
      throw error
    }
  }

  async clear(): Promise<void> {
    if (!(await this.checkAvailability())) {
      throw new Error('Flask backend not available')
    }

    try {
      const response = await this.fetchWithTimeout(`${this.baseUrl}/api/storage/clear`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
    } catch (error) {
      console.error('[StorageAdapter] Error clearing storage:', error)
      this.isAvailable = false
      throw error
    }
  }

  async export(): Promise<Record<string, any>> {
    if (!(await this.checkAvailability())) {
      throw new Error('Flask backend not available')
    }

    try {
      const response = await this.fetchWithTimeout(`${this.baseUrl}/api/storage/export`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('[StorageAdapter] Error exporting data:', error)
      this.isAvailable = false
      throw error
    }
  }

  async import(data: Record<string, any>): Promise<number> {
    if (!(await this.checkAvailability())) {
      throw new Error('Flask backend not available')
    }

    try {
      const response = await this.fetchWithTimeout(`${this.baseUrl}/api/storage/import`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      return result.imported
    } catch (error) {
      console.error('[StorageAdapter] Error importing data:', error)
      this.isAvailable = false
      throw error
    }
  }

  async getStats(): Promise<{ total_keys: number; total_size_bytes: number; database_path: string }> {
    if (!(await this.checkAvailability())) {
      throw new Error('Flask backend not available')
    }

    try {
      const response = await this.fetchWithTimeout(`${this.baseUrl}/api/storage/stats`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('[StorageAdapter] Error getting stats:', error)
      this.isAvailable = false
      throw error
    }
  }
}

class IndexedDBAdapter implements StorageAdapter {
  private dbName = 'codeforge-db'
  private storeName = 'storage'
  private db: IDBDatabase | null = null

  private async getDB(): Promise<IDBDatabase> {
    if (this.db) {
      return this.db
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve(this.db)
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName)
        }
      }
    })
  }

  async get<T>(key: string): Promise<T | undefined> {
    const db = await this.getDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readonly')
      const store = transaction.objectStore(this.storeName)
      const request = store.get(key)

      request.onsuccess = () => resolve(request.result as T | undefined)
      request.onerror = () => reject(request.error)
    })
  }

  async set<T>(key: string, value: T): Promise<void> {
    const db = await this.getDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readwrite')
      const store = transaction.objectStore(this.storeName)
      const request = store.put(value, key)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async delete(key: string): Promise<void> {
    const db = await this.getDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readwrite')
      const store = transaction.objectStore(this.storeName)
      const request = store.delete(key)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async keys(): Promise<string[]> {
    const db = await this.getDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readonly')
      const store = transaction.objectStore(this.storeName)
      const request = store.getAllKeys()

      request.onsuccess = () => resolve(request.result.map(k => String(k)))
      request.onerror = () => reject(request.error)
    })
  }

  async clear(): Promise<void> {
    const db = await this.getDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readwrite')
      const store = transaction.objectStore(this.storeName)
      const request = store.clear()

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }
}

async function detectStorageBackend(): Promise<'flask' | 'indexeddb'> {
  if (USE_FLASK_BACKEND && FLASK_BACKEND_URL) {
    console.log('[StorageAdapter] USE_FLASK_BACKEND is true, attempting Flask backend')
    const flaskAdapter = new FlaskBackendAdapter(FLASK_BACKEND_URL)
    try {
      await flaskAdapter.get('_health_check')
      console.log('[StorageAdapter] Flask backend detected and available')
      return 'flask'
    } catch (error) {
      console.warn('[StorageAdapter] Flask backend configured but not available, falling back to IndexedDB:', error)
    }
  }

  console.log('[StorageAdapter] Using IndexedDB')
  return 'indexeddb'
}

class AutoStorageAdapter implements StorageAdapter {
  private adapter: StorageAdapter | null = null
  private fallbackAdapter: IndexedDBAdapter | null = null
  private backendType: 'flask' | 'indexeddb' | null = null
  private initPromise: Promise<void> | null = null
  private hasWarnedAboutFallback = false
  private failureCount = 0
  private readonly MAX_FAILURES_BEFORE_SWITCH = 3

  private async initialize(): Promise<void> {
    if (this.adapter) {
      return
    }

    if (!this.initPromise) {
      this.initPromise = (async () => {
        this.backendType = await detectStorageBackend()
        
        if (this.backendType === 'flask' && FLASK_BACKEND_URL) {
          this.adapter = new FlaskBackendAdapter(FLASK_BACKEND_URL)
          this.fallbackAdapter = new IndexedDBAdapter()
          console.log(`[StorageAdapter] Initialized with Flask backend: ${FLASK_BACKEND_URL} (with IndexedDB fallback)`)
        } else {
          this.adapter = new IndexedDBAdapter()
          console.log('[StorageAdapter] Initialized with IndexedDB')
        }
      })()
    }

    await this.initPromise
  }

  private switchToFallback(): void {
    if (this.backendType === 'flask' && this.fallbackAdapter) {
      console.warn('[StorageAdapter] Too many Flask failures detected, permanently switching to IndexedDB for this session')
      this.adapter = this.fallbackAdapter
      this.backendType = 'indexeddb'
      this.fallbackAdapter = null
      this.failureCount = 0
    }
  }

  private async executeWithFallback<T>(
    operation: () => Promise<T>,
    fallbackOperation?: () => Promise<T>
  ): Promise<T> {
    try {
      const result = await operation()
      if (this.backendType === 'flask') {
        this.failureCount = 0
      }
      return result
    } catch (error) {
      if (this.backendType === 'flask' && this.fallbackAdapter && fallbackOperation) {
        this.failureCount++
        
        if (!this.hasWarnedAboutFallback) {
          console.warn('[StorageAdapter] Flask backend operation failed, falling back to IndexedDB:', error)
          this.hasWarnedAboutFallback = true
        }
        
        if (this.failureCount >= this.MAX_FAILURES_BEFORE_SWITCH) {
          this.switchToFallback()
        }
        
        try {
          return await fallbackOperation()
        } catch (fallbackError) {
          console.error('[StorageAdapter] Fallback to IndexedDB also failed:', fallbackError)
          throw fallbackError
        }
      }
      throw error
    }
  }

  getBackendType(): 'flask' | 'indexeddb' | null {
    return this.backendType
  }

  async get<T>(key: string): Promise<T | undefined> {
    await this.initialize()
    return this.executeWithFallback(
      () => this.adapter!.get<T>(key),
      this.fallbackAdapter ? () => this.fallbackAdapter!.get<T>(key) : undefined
    )
  }

  async set<T>(key: string, value: T): Promise<void> {
    await this.initialize()
    return this.executeWithFallback(
      () => this.adapter!.set(key, value),
      this.fallbackAdapter ? () => this.fallbackAdapter!.set(key, value) : undefined
    )
  }

  async delete(key: string): Promise<void> {
    await this.initialize()
    return this.executeWithFallback(
      () => this.adapter!.delete(key),
      this.fallbackAdapter ? () => this.fallbackAdapter!.delete(key) : undefined
    )
  }

  async keys(): Promise<string[]> {
    await this.initialize()
    return this.executeWithFallback(
      () => this.adapter!.keys(),
      this.fallbackAdapter ? () => this.fallbackAdapter!.keys() : undefined
    )
  }

  async clear(): Promise<void> {
    await this.initialize()
    return this.executeWithFallback(
      () => this.adapter!.clear(),
      this.fallbackAdapter ? () => this.fallbackAdapter!.clear() : undefined
    )
  }

  async migrateToFlask(flaskUrl: string): Promise<number> {
    await this.initialize()
    
    if (this.backendType === 'flask') {
      throw new Error('Already using Flask backend')
    }

    const indexedDBAdapter = this.adapter as IndexedDBAdapter
    const flaskAdapter = new FlaskBackendAdapter(flaskUrl)

    const keys = await indexedDBAdapter.keys()
    let migrated = 0

    for (const key of keys) {
      try {
        const value = await indexedDBAdapter.get(key)
        if (value !== undefined) {
          await flaskAdapter.set(key, value)
          migrated++
        }
      } catch (error) {
        console.error(`[StorageAdapter] Failed to migrate key ${key}:`, error)
      }
    }

    console.log(`[StorageAdapter] Migrated ${migrated}/${keys.length} keys to Flask backend`)
    return migrated
  }

  async migrateToIndexedDB(): Promise<number> {
    await this.initialize()
    
    if (this.backendType === 'indexeddb') {
      throw new Error('Already using IndexedDB')
    }

    const flaskAdapter = this.adapter as FlaskBackendAdapter
    const indexedDBAdapter = new IndexedDBAdapter()

    const data = await flaskAdapter.export()
    const keys = Object.keys(data)
    let migrated = 0

    for (const key of keys) {
      try {
        await indexedDBAdapter.set(key, data[key])
        migrated++
      } catch (error) {
        console.error(`[StorageAdapter] Failed to migrate key ${key}:`, error)
      }
    }

    console.log(`[StorageAdapter] Migrated ${migrated}/${keys.length} keys to IndexedDB`)
    return migrated
  }
}

export const storageAdapter = new AutoStorageAdapter()

export { FlaskBackendAdapter, IndexedDBAdapter }
