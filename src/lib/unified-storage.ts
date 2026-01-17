export type StorageBackend = 'flask' | 'indexeddb' | 'sqlite' | 'sparkkv'

export interface StorageAdapter {
  get<T>(key: string): Promise<T | undefined>
  set<T>(key: string, value: T): Promise<void>
  delete(key: string): Promise<void>
  keys(): Promise<string[]>
  clear(): Promise<void>
  close?(): Promise<void>
}

class FlaskBackendAdapter implements StorageAdapter {
  private baseUrl: string

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || localStorage.getItem('codeforge-flask-url') || import.meta.env.VITE_FLASK_BACKEND_URL || 'http://localhost:5001'
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: response.statusText }))
      throw new Error(error.error || `HTTP ${response.status}`)
    }

    return response.json()
  }

  async get<T>(key: string): Promise<T | undefined> {
    try {
      const result = await this.request<{ value: T }>(`/api/storage/${encodeURIComponent(key)}`)
      return result.value
    } catch (error: any) {
      if (error.message?.includes('404') || error.message?.includes('not found')) {
        return undefined
      }
      throw error
    }
  }

  async set<T>(key: string, value: T): Promise<void> {
    await this.request(`/api/storage/${encodeURIComponent(key)}`, {
      method: 'PUT',
      body: JSON.stringify({ value }),
    })
  }

  async delete(key: string): Promise<void> {
    await this.request(`/api/storage/${encodeURIComponent(key)}`, {
      method: 'DELETE',
    })
  }

  async keys(): Promise<string[]> {
    const result = await this.request<{ keys: string[] }>('/api/storage/keys')
    return result.keys
  }

  async clear(): Promise<void> {
    await this.request('/api/storage/clear', {
      method: 'POST',
    })
  }
}

class IndexedDBAdapter implements StorageAdapter {
  private db: IDBDatabase | null = null
  private readonly dbName = 'CodeForgeDB'
  private readonly storeName = 'keyvalue'
  private readonly version = 2

  private async init(): Promise<void> {
    if (this.db) return

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'key' })
        }
      }
    })
  }

  async get<T>(key: string): Promise<T | undefined> {
    await this.init()
    if (!this.db) throw new Error('Database not initialized')

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(this.storeName, 'readonly')
      const store = transaction.objectStore(this.storeName)
      const request = store.get(key)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        const result = request.result
        resolve(result ? result.value : undefined)
      }
    })
  }

  async set<T>(key: string, value: T): Promise<void> {
    await this.init()
    if (!this.db) throw new Error('Database not initialized')

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(this.storeName, 'readwrite')
      const store = transaction.objectStore(this.storeName)
      const request = store.put({ key, value })

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  async delete(key: string): Promise<void> {
    await this.init()
    if (!this.db) throw new Error('Database not initialized')

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(this.storeName, 'readwrite')
      const store = transaction.objectStore(this.storeName)
      const request = store.delete(key)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  async keys(): Promise<string[]> {
    await this.init()
    if (!this.db) throw new Error('Database not initialized')

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(this.storeName, 'readonly')
      const store = transaction.objectStore(this.storeName)
      const request = store.getAllKeys()

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result as string[])
    })
  }

  async clear(): Promise<void> {
    await this.init()
    if (!this.db) throw new Error('Database not initialized')

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(this.storeName, 'readwrite')
      const store = transaction.objectStore(this.storeName)
      const request = store.clear()

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  async close(): Promise<void> {
    if (this.db) {
      this.db.close()
      this.db = null
    }
  }
}

class SparkKVAdapter implements StorageAdapter {
  async get<T>(key: string): Promise<T | undefined> {
    if (!window.spark?.kv) throw new Error('Spark KV not available')
    return await window.spark.kv.get<T>(key)
  }

  async set<T>(key: string, value: T): Promise<void> {
    if (!window.spark?.kv) throw new Error('Spark KV not available')
    await window.spark.kv.set(key, value)
  }

  async delete(key: string): Promise<void> {
    if (!window.spark?.kv) throw new Error('Spark KV not available')
    await window.spark.kv.delete(key)
  }

  async keys(): Promise<string[]> {
    if (!window.spark?.kv) throw new Error('Spark KV not available')
    return await window.spark.kv.keys()
  }

  async clear(): Promise<void> {
    if (!window.spark?.kv) throw new Error('Spark KV not available')
    const allKeys = await window.spark.kv.keys()
    await Promise.all(allKeys.map(key => window.spark.kv.delete(key)))
  }
}

class SQLiteAdapter implements StorageAdapter {
  private db: any = null
  private SQL: any = null
  private initPromise: Promise<void> | null = null

  private async loadSQLiteWASM(): Promise<any> {
    const moduleName = 'sql.js'
    try {
      return await import(moduleName)
    } catch {
      throw new Error(`${moduleName} not installed. Run: npm install ${moduleName}`)
    }
  }

  private async init(): Promise<void> {
    if (this.db) return
    if (this.initPromise) return this.initPromise

    this.initPromise = (async () => {
      try {
        const sqlJsModule = await this.loadSQLiteWASM()
        const initSqlJs = sqlJsModule.default

        this.SQL = await initSqlJs({
          locateFile: (file: string) => `https://sql.js.org/dist/${file}`
        })

        const data = localStorage.getItem('codeforge-sqlite-db')
        if (data) {
          const buffer = new Uint8Array(JSON.parse(data))
          this.db = new this.SQL.Database(buffer)
        } else {
          this.db = new this.SQL.Database()
        }

        this.db.run(`
          CREATE TABLE IF NOT EXISTS keyvalue (
            key TEXT PRIMARY KEY,
            value TEXT NOT NULL
          )
        `)
      } catch (error) {
        console.error('SQLite initialization failed:', error)
        throw error
      }
    })()

    return this.initPromise
  }

  private persist(): void {
    if (!this.db) return
    try {
      const data = this.db.export()
      const buffer = Array.from(data)
      localStorage.setItem('codeforge-sqlite-db', JSON.stringify(buffer))
    } catch (error) {
      console.error('Failed to persist SQLite database:', error)
    }
  }

  async get<T>(key: string): Promise<T | undefined> {
    await this.init()
    const stmt = this.db.prepare('SELECT value FROM keyvalue WHERE key = ?')
    stmt.bind([key])
    
    if (stmt.step()) {
      const row = stmt.getAsObject()
      stmt.free()
      return JSON.parse(row.value as string) as T
    }
    
    stmt.free()
    return undefined
  }

  async set<T>(key: string, value: T): Promise<void> {
    await this.init()
    this.db.run(
      'INSERT OR REPLACE INTO keyvalue (key, value) VALUES (?, ?)',
      [key, JSON.stringify(value)]
    )
    this.persist()
  }

  async delete(key: string): Promise<void> {
    await this.init()
    this.db.run('DELETE FROM keyvalue WHERE key = ?', [key])
    this.persist()
  }

  async keys(): Promise<string[]> {
    await this.init()
    const stmt = this.db.prepare('SELECT key FROM keyvalue')
    const keys: string[] = []
    
    while (stmt.step()) {
      const row = stmt.getAsObject()
      keys.push(row.key as string)
    }
    
    stmt.free()
    return keys
  }

  async clear(): Promise<void> {
    await this.init()
    this.db.run('DELETE FROM keyvalue')
    this.persist()
  }

  async close(): Promise<void> {
    if (this.db) {
      this.persist()
      this.db.close()
      this.db = null
      this.SQL = null
      this.initPromise = null
    }
  }
}

class UnifiedStorage {
  private adapter: StorageAdapter | null = null
  private backend: StorageBackend | null = null
  private initPromise: Promise<void> | null = null

  private async detectAndInitialize(): Promise<void> {
    if (this.adapter) return
    if (this.initPromise) return this.initPromise

    this.initPromise = (async () => {
      const preferFlask = localStorage.getItem('codeforge-prefer-flask') === 'true'
      const flaskEnvUrl = import.meta.env.VITE_FLASK_BACKEND_URL
      const preferSQLite = localStorage.getItem('codeforge-prefer-sqlite') === 'true'

      if (preferFlask || flaskEnvUrl) {
        try {
          console.log('[Storage] Flask backend explicitly configured, attempting to initialize...')
          const flaskAdapter = new FlaskBackendAdapter(flaskEnvUrl)
          await flaskAdapter.get('_health_check')
          this.adapter = flaskAdapter
          this.backend = 'flask'
          console.log('[Storage] ✓ Using Flask backend')
          return
        } catch (error) {
          console.warn('[Storage] Flask backend not available, falling back to IndexedDB:', error)
        }
      }

      if (typeof indexedDB !== 'undefined') {
        try {
          console.log('[Storage] Initializing default IndexedDB backend...')
          const idbAdapter = new IndexedDBAdapter()
          await idbAdapter.get('_health_check')
          this.adapter = idbAdapter
          this.backend = 'indexeddb'
          console.log('[Storage] ✓ Using IndexedDB (default)')
          return
        } catch (error) {
          console.warn('[Storage] IndexedDB not available:', error)
        }
      }

      if (preferSQLite) {
        try {
          console.log('[Storage] SQLite fallback, attempting to initialize...')
          const sqliteAdapter = new SQLiteAdapter()
          await sqliteAdapter.get('_health_check')
          this.adapter = sqliteAdapter
          this.backend = 'sqlite'
          console.log('[Storage] ✓ Using SQLite')
          return
        } catch (error) {
          console.warn('[Storage] SQLite not available:', error)
        }
      }

      if (window.spark?.kv) {
        try {
          console.log('[Storage] Spark KV fallback, attempting to initialize...')
          const sparkAdapter = new SparkKVAdapter()
          await sparkAdapter.get('_health_check')
          this.adapter = sparkAdapter
          this.backend = 'sparkkv'
          console.log('[Storage] ✓ Using Spark KV')
          return
        } catch (error) {
          console.warn('[Storage] Spark KV not available:', error)
        }
      }

      throw new Error('No storage backend available')
    })()

    return this.initPromise
  }

  async get<T>(key: string): Promise<T | undefined> {
    await this.detectAndInitialize()
    return this.adapter!.get<T>(key)
  }

  async set<T>(key: string, value: T): Promise<void> {
    await this.detectAndInitialize()
    await this.adapter!.set(key, value)
  }

  async delete(key: string): Promise<void> {
    await this.detectAndInitialize()
    await this.adapter!.delete(key)
  }

  async keys(): Promise<string[]> {
    await this.detectAndInitialize()
    return this.adapter!.keys()
  }

  async clear(): Promise<void> {
    await this.detectAndInitialize()
    await this.adapter!.clear()
  }

  async getBackend(): Promise<StorageBackend | null> {
    await this.detectAndInitialize()
    return this.backend
  }

  async switchToSQLite(): Promise<void> {
    if (this.backend === 'sqlite') return

    console.log('[Storage] Switching to SQLite...')
    const oldKeys = await this.keys()
    const data: Record<string, any> = {}

    for (const key of oldKeys) {
      data[key] = await this.get(key)
    }

    if (this.adapter?.close) {
      await this.adapter.close()
    }

    this.adapter = null
    this.backend = null
    this.initPromise = null

    localStorage.setItem('codeforge-prefer-sqlite', 'true')

    await this.detectAndInitialize()

    for (const [key, value] of Object.entries(data)) {
      await this.set(key, value)
    }

    console.log('[Storage] ✓ Migrated to SQLite')
  }

  async switchToIndexedDB(): Promise<void> {
    if (this.backend === 'indexeddb') return

    console.log('[Storage] Switching to IndexedDB...')
    const oldKeys = await this.keys()
    const data: Record<string, any> = {}

    for (const key of oldKeys) {
      data[key] = await this.get(key)
    }

    if (this.adapter?.close) {
      await this.adapter.close()
    }

    this.adapter = null
    this.backend = null
    this.initPromise = null

    localStorage.removeItem('codeforge-prefer-sqlite')
    localStorage.removeItem('codeforge-prefer-flask')

    await this.detectAndInitialize()

    for (const [key, value] of Object.entries(data)) {
      await this.set(key, value)
    }

    console.log('[Storage] ✓ Migrated to IndexedDB')
  }

  async switchToFlask(backendUrl?: string): Promise<void> {
    if (this.backend === 'flask') return

    console.log('[Storage] Switching to Flask backend...')
    const oldKeys = await this.keys()
    const data: Record<string, any> = {}

    for (const key of oldKeys) {
      data[key] = await this.get(key)
    }

    if (this.adapter?.close) {
      await this.adapter.close()
    }

    this.adapter = null
    this.backend = null
    this.initPromise = null

    localStorage.setItem('codeforge-prefer-flask', 'true')
    if (backendUrl) {
      localStorage.setItem('codeforge-flask-url', backendUrl)
    }

    await this.detectAndInitialize()

    for (const [key, value] of Object.entries(data)) {
      await this.set(key, value)
    }

    console.log('[Storage] ✓ Migrated to Flask backend')
  }

  async exportData(): Promise<Record<string, any>> {
    const allKeys = await this.keys()
    const data: Record<string, any> = {}

    for (const key of allKeys) {
      data[key] = await this.get(key)
    }

    return data
  }

  async importData(data: Record<string, any>): Promise<void> {
    for (const [key, value] of Object.entries(data)) {
      await this.set(key, value)
    }
  }
}

export const unifiedStorage = new UnifiedStorage()
