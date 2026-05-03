import { newId } from './ids.js'

const KEYS = {
  index:   'adventure:index',
  current: 'adventure:current',
  record:  (id) => `adventure:${id}`,
}

function blankAdventure(meta = {}) {
  return {
    id: '',
    name: '',
    dmName: '',
    setting: '',
    startDate: '',
    notes: '',
    ownerCharacterId: '',
    party: [],
    mapGallery: [],
    log: [],
    ...meta,
  }
}

export class AdventureRepository {
  /** @param {import('./StorageAdapter.js').StorageAdapter} adapter */
  constructor(adapter) { this._a = adapter }

  async _getIndex() {
    const r = await this._a.get(KEYS.index)
    return r.ok ? r.value : []
  }

  async _saveIndex(ids) {
    await this._a.set(KEYS.index, ids)
  }

  async _getRecord(id) {
    const r = await this._a.get(KEYS.record(id))
    return r.ok ? r.value : null
  }

  async _saveRecord(adventure) {
    const r = await this._a.set(KEYS.record(adventure.id), adventure)
    if (!r.ok) throw new Error(r.error)
    return adventure
  }

  // ── Current pointer ──────────────────────────────────────────────────

  async getCurrentId() {
    const r = await this._a.get(KEYS.current)
    return r.ok ? r.value : null
  }

  async setCurrent(id) {
    await this._a.set(KEYS.current, id)
  }

  async getCurrent() {
    const id = await this.getCurrentId()
    if (!id) return null
    return this._getRecord(id)
  }

  // ── CRUD ──────────────────────────────────────────────────────────────

  async create(meta = {}) {
    const id = newId()
    const adventure = blankAdventure({ ...meta, id })
    await this._saveRecord(adventure)
    const index = await this._getIndex()
    await this._saveIndex([...index, id])
    return adventure
  }

  async updateMeta(patch) {
    const current = await this.getCurrent()
    if (!current) throw new Error('NoCurrentAdventure')
    const updated = { ...current, ...patch, id: current.id }
    return this._saveRecord(updated)
  }

  // ── Party ─────────────────────────────────────────────────────────────

  async addPartyMember({ characterId, role = '' }) {
    const current = await this.getCurrent()
    if (!current) throw new Error('NoCurrentAdventure')
    if (current.party.some(p => p.characterId === characterId)) return current
    const updated = { ...current, party: [...current.party, { characterId, role }] }
    return this._saveRecord(updated)
  }

  async removePartyMember(characterId) {
    const current = await this.getCurrent()
    if (!current) throw new Error('NoCurrentAdventure')
    const updated = { ...current, party: current.party.filter(p => p.characterId !== characterId) }
    return this._saveRecord(updated)
  }

  async setOwner(characterId) {
    const current = await this.getCurrent()
    if (!current) throw new Error('NoCurrentAdventure')
    return this._saveRecord({ ...current, ownerCharacterId: characterId })
  }

  // ── Map gallery ───────────────────────────────────────────────────────

  async addMapImage({ label, dataUrl, mime, bytes }) {
    const current = await this.getCurrent()
    if (!current) throw new Error('NoCurrentAdventure')
    const entry = { id: newId(), label: label || 'Map', dataUrl, mime, bytes, addedAt: new Date().toISOString() }
    const r = await this._a.set(KEYS.record(current.id), {
      ...current,
      mapGallery: [...current.mapGallery, entry],
    })
    if (!r.ok) throw new Error(r.error)
    return entry
  }

  async removeMapImage(mapId) {
    const current = await this.getCurrent()
    if (!current) throw new Error('NoCurrentAdventure')
    const updated = { ...current, mapGallery: current.mapGallery.filter(m => m.id !== mapId) }
    return this._saveRecord(updated)
  }

  async renameMapImage(mapId, label) {
    const current = await this.getCurrent()
    if (!current) throw new Error('NoCurrentAdventure')
    const updated = {
      ...current,
      mapGallery: current.mapGallery.map(m => m.id === mapId ? { ...m, label } : m),
    }
    return this._saveRecord(updated)
  }

  // ── Adventure log ─────────────────────────────────────────────────────

  async appendLogEntry({ title = '', body = '', sessionNumber = null, sessionDate = '' }) {
    const current = await this.getCurrent()
    if (!current) throw new Error('NoCurrentAdventure')
    const now = new Date().toISOString()
    const entry = { id: newId(), title, body, sessionNumber, sessionDate, createdAt: now, updatedAt: now }
    const updated = { ...current, log: [...current.log, entry] }
    await this._saveRecord(updated)
    return entry
  }

  async updateLogEntry(entryId, patch) {
    const current = await this.getCurrent()
    if (!current) throw new Error('NoCurrentAdventure')
    const now = new Date().toISOString()
    const updated = {
      ...current,
      log: current.log.map(e =>
        e.id === entryId ? { ...e, ...patch, id: e.id, createdAt: e.createdAt, updatedAt: now } : e
      ),
    }
    return this._saveRecord(updated)
  }

  async deleteLogEntry(entryId) {
    const current = await this.getCurrent()
    if (!current) throw new Error('NoCurrentAdventure')
    const updated = { ...current, log: current.log.filter(e => e.id !== entryId) }
    return this._saveRecord(updated)
  }
}
