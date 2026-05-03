import { newId } from './ids.js'
import { blankCharacter } from '../tokens.js'

const PREFIX = 'character:'

export class CharacterRepository {
  /** @param {import('./StorageAdapter.js').StorageAdapter} adapter */
  constructor(adapter) { this._a = adapter }

  async create(initial = {}) {
    const id = newId()
    const char = { ...blankCharacter(), ...initial, id }
    const r = await this._a.set(`${PREFIX}${id}`, char)
    if (!r.ok) throw new Error(r.error)
    return char
  }

  async get(id) {
    const r = await this._a.get(`${PREFIX}${id}`)
    return r.ok ? r.value : null
  }

  async update(id, patch) {
    const existing = await this.get(id)
    if (!existing) throw new Error('NotFound')
    const updated = { ...existing, ...patch, id }
    const r = await this._a.set(`${PREFIX}${id}`, updated)
    if (!r.ok) throw new Error(r.error)
    return updated
  }

  async remove(id) {
    await this._a.remove(`${PREFIX}${id}`)
  }

  async list() {
    const r = await this._a.list(PREFIX)
    if (!r.ok) return []
    const results = await Promise.all(r.value.map(k => this._a.get(k)))
    return results.filter(r => r.ok).map(r => r.value)
  }
}
