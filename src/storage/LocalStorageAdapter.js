import { ok, err } from './StorageAdapter.js'

export class LocalStorageAdapter {
  async get(key) {
    try {
      const raw = localStorage.getItem(key)
      if (raw === null) return err('NotFound')
      return ok(JSON.parse(raw))
    } catch {
      return err('Invalid')
    }
  }

  async set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return ok(undefined)
    } catch (e) {
      if (e instanceof DOMException && (
        e.name === 'QuotaExceededError' ||
        e.name === 'NS_ERROR_DOM_QUOTA_REACHED'
      )) {
        return err('QuotaExceeded')
      }
      return err('Invalid')
    }
  }

  async remove(key) {
    localStorage.removeItem(key)
    return ok(undefined)
  }

  async list(prefix) {
    const keys = []
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)
      if (k && k.startsWith(prefix)) keys.push(k)
    }
    return ok(keys)
  }
}
