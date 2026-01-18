import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AutoSyncManager } from '../autoSyncMiddleware'
import { syncToFlaskBulk } from '../../slices/syncSlice'

vi.mock('../../slices/syncSlice', () => ({
  syncToFlaskBulk: vi.fn(() => ({ type: 'sync/syncToFlaskBulk' })),
  checkFlaskConnection: vi.fn(() => ({ type: 'sync/checkConnection' })),
}))

type Deferred<T> = {
  promise: Promise<T>
  resolve: (value: T) => void
  reject: (error?: unknown) => void
}

const createDeferred = <T,>(): Deferred<T> => {
  let resolve!: (value: T) => void
  let reject!: (error?: unknown) => void
  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })

  return { promise, resolve, reject }
}

describe('AutoSyncManager', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('serializes syncs and runs one pending sync after completion', async () => {
    const manager = new AutoSyncManager()
    const deferreds = [createDeferred<void>(), createDeferred<void>()]
    const dispatch = vi
      .fn()
      .mockImplementation(() => deferreds.shift()?.promise ?? Promise.resolve())

    manager.setDispatch(dispatch)

    const firstSync = manager.syncNow()
    const secondSync = manager.syncNow()

    expect(dispatch).toHaveBeenCalledTimes(1)

    deferreds[0].resolve()
    await Promise.resolve()

    expect(dispatch).toHaveBeenCalledTimes(2)

    deferreds[1].resolve()

    await firstSync
    await secondSync
  })

  it('resets changeCounter after a successful sync', async () => {
    const manager = new AutoSyncManager()
    const dispatch = vi.fn().mockResolvedValue(undefined)

    manager.setDispatch(dispatch)
    manager.trackChange()
    manager.trackChange()

    expect(manager.getStatus().changeCounter).toBe(2)

    await manager.syncNow()

    expect(manager.getStatus().changeCounter).toBe(0)
    expect(dispatch).toHaveBeenCalledTimes(1)
  })

  it('coalesces multiple pending sync requests into one run', async () => {
    const manager = new AutoSyncManager()
    const deferreds = [createDeferred<void>(), createDeferred<void>()]
    const dispatch = vi
      .fn()
      .mockImplementation(() => deferreds.shift()?.promise ?? Promise.resolve())

    manager.setDispatch(dispatch)

    const firstSync = manager.syncNow()
    const secondSync = manager.syncNow()
    const thirdSync = manager.syncNow()

    expect(dispatch).toHaveBeenCalledTimes(1)

    deferreds[0].resolve()
    await Promise.resolve()

    expect(dispatch).toHaveBeenCalledTimes(2)

    deferreds[1].resolve()

    await firstSync
    await secondSync
    await thirdSync

    expect(dispatch).toHaveBeenCalledTimes(2)
  })

  it('dispatches the sync thunk when performing a sync', async () => {
    const manager = new AutoSyncManager()
    const dispatch = vi.fn().mockResolvedValue(undefined)

    manager.setDispatch(dispatch)

    await manager.syncNow()

    expect(dispatch).toHaveBeenCalledWith(syncToFlaskBulk())
  })
})
