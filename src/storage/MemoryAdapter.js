import { ok, err } from './StorageAdapter.js'

export class MemoryAdapter {
  constructor() {
    this._store = new Map()
  }

  async get(key) {
    if (!this._store.has(key)) return err('NotFound')
    return ok(JSON.parse(JSON.stringify(this._store.get(key))))
  }

  async set(key, value) {
    if (this._quotaKeys && this._store.size >= this._quotaKeys && !this._store.has(key)) {
      return err('QuotaExceeded')
    }
    this._store.set(key, JSON.parse(JSON.stringify(value)))
    return ok(undefined)
  }

  async remove(key) {
    this._store.delete(key)
    return ok(undefined)
  }

  async list(prefix) {
    const keys = [...this._store.keys()].filter(k => k.startsWith(prefix))
    return ok(keys)
  }

  /** Simulate quota: throw QuotaExceeded after N total keys (for tests). */
  simulateQuotaAfter(n) { this._quotaKeys = n }

  /** Seed raw data (bypasses quota check). Used by migration tests. */
  seed(key, value) { this._store.set(key, value) }
}
