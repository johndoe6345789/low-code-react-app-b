import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { 
  syncAllToFlask, 
  fetchAllFromFlask, 
  getFlaskStats, 
  clearFlaskStorage 
} from '@/store/middleware/flaskSync'
import { db } from '@/lib/db'

export type SyncStatus = 'idle' | 'syncing' | 'success' | 'error'

interface SyncState {
  status: SyncStatus
  lastSyncedAt: number | null
  flaskConnected: boolean
  flaskStats: {
    totalKeys: number
    totalSizeBytes: number
  } | null
  error: string | null
}

const initialState: SyncState = {
  status: 'idle',
  lastSyncedAt: null,
  flaskConnected: false,
  flaskStats: null,
  error: null,
}

export const syncToFlaskBulk = createAsyncThunk(
  'sync/syncToFlaskBulk',
  async (_, { rejectWithValue }) => {
    try {
      const data: Record<string, any> = {}
      
      const files = await db.getAll('files')
      const models = await db.getAll('models')
      const components = await db.getAll('components')
      const workflows = await db.getAll('workflows')
      
      files.forEach((file: any) => {
        data[`files:${file.id}`] = file
      })
      
      models.forEach((model: any) => {
        data[`models:${model.id}`] = model
      })
      
      components.forEach((component: any) => {
        data[`components:${component.id}`] = component
      })
      
      workflows.forEach((workflow: any) => {
        data[`workflows:${workflow.id}`] = workflow
      })
      
      await syncAllToFlask(data)
      return Date.now()
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

export const syncFromFlaskBulk = createAsyncThunk(
  'sync/syncFromFlaskBulk',
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchAllFromFlask()

      const validStoreNames = ['files', 'models', 'components', 'workflows'] as const
      const remoteIdsByStore = new Map<(typeof validStoreNames)[number], Set<string>>()

      for (const [key, value] of Object.entries(data)) {
        const keyParts = key.split(':')
        if (keyParts.length !== 2) continue

        const [storeName, id] = keyParts

        if (!validStoreNames.includes(storeName as (typeof validStoreNames)[number])) {
          continue
        }

        if (!id) continue

        await db.put(storeName as any, value)

        const ids = remoteIdsByStore.get(storeName as any) ?? new Set<string>()
        ids.add(id)
        remoteIdsByStore.set(storeName as any, ids)
      }

      for (const storeName of validStoreNames) {
        const localItems = await db.getAll(storeName)
        const remoteIds = remoteIdsByStore.get(storeName) ?? new Set<string>()

        for (const item of localItems) {
          if (!item?.id) continue
          if (!remoteIds.has(item.id)) {
            await db.delete(storeName, item.id)
          }
        }
      }
      
      return Date.now()
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

export const checkFlaskConnection = createAsyncThunk(
  'sync/checkConnection',
  async (_, { rejectWithValue }) => {
    try {
      const stats = await getFlaskStats()
      return {
        connected: true,
        stats: {
          totalKeys: stats.total_keys,
          totalSizeBytes: stats.total_size_bytes,
        },
      }
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

export const clearFlask = createAsyncThunk(
  'sync/clearFlask',
  async (_, { rejectWithValue }) => {
    try {
      await clearFlaskStorage()
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

const syncSlice = createSlice({
  name: 'sync',
  initialState,
  reducers: {
    resetSyncStatus: (state) => {
      state.status = 'idle'
      state.error = null
    },
    setFlaskConnected: (state, action: PayloadAction<boolean>) => {
      state.flaskConnected = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(syncToFlaskBulk.pending, (state) => {
        state.status = 'syncing'
        state.error = null
      })
      .addCase(syncToFlaskBulk.fulfilled, (state, action) => {
        state.status = 'success'
        state.lastSyncedAt = action.payload
      })
      .addCase(syncToFlaskBulk.rejected, (state, action) => {
        state.status = 'error'
        state.error = action.payload as string
      })
      .addCase(syncFromFlaskBulk.pending, (state) => {
        state.status = 'syncing'
        state.error = null
      })
      .addCase(syncFromFlaskBulk.fulfilled, (state, action) => {
        state.status = 'success'
        state.lastSyncedAt = action.payload
      })
      .addCase(syncFromFlaskBulk.rejected, (state, action) => {
        state.status = 'error'
        state.error = action.payload as string
      })
      .addCase(checkFlaskConnection.fulfilled, (state, action) => {
        state.flaskConnected = action.payload.connected
        state.flaskStats = action.payload.stats
      })
      .addCase(checkFlaskConnection.rejected, (state) => {
        state.flaskConnected = false
        state.flaskStats = null
      })
      .addCase(clearFlask.fulfilled, (state) => {
        state.flaskStats = {
          totalKeys: 0,
          totalSizeBytes: 0,
        }
      })
  },
})

export const { resetSyncStatus, setFlaskConnected } = syncSlice.actions
export default syncSlice.reducer
