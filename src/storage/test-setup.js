import { vi, beforeEach } from 'vitest'

// Provide a full localStorage mock compatible with jsdom in Vitest 3.x
const createStorage = () => {
  let store = {}
  return {
    getItem:    (key) => (key in store ? store[key] : null),
    setItem:    (key, val) => { store[key] = String(val) },
    removeItem: (key) => { delete store[key] },
    clear:      () => { store = {} },
    get length() { return Object.keys(store).length },
    key:        (i) => Object.keys(store)[i] ?? null,
    _reset:     () => { store = {} },
  }
}

const mockLocalStorage = createStorage()
vi.stubGlobal('localStorage', mockLocalStorage)

beforeEach(() => { mockLocalStorage.clear() })
