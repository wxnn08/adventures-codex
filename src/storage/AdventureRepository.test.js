import { describe, it, expect, beforeEach } from 'vitest'
import { MemoryAdapter } from './MemoryAdapter.js'
import { AdventureRepository } from './AdventureRepository.js'
import { CharacterRepository } from './CharacterRepository.js'

describe('AdventureRepository', () => {
  let adapter, repo, charRepo

  beforeEach(() => {
    adapter  = new MemoryAdapter()
    repo     = new AdventureRepository(adapter)
    charRepo = new CharacterRepository(adapter)
  })

  // ── Basic CRUD ──────────────────────────────────────────────────────

  it('creates an adventure with a generated id and blank defaults', async () => {
    const adv = await repo.create({ name: 'Lost Mines' })
    expect(adv.id).toBeTruthy()
    expect(adv.name).toBe('Lost Mines')
    expect(adv.party).toEqual([])
    expect(adv.log).toEqual([])
  })

  it('getCurrent returns null when no current is set', async () => {
    expect(await repo.getCurrent()).toBeNull()
  })

  it('setCurrent + getCurrent round-trip', async () => {
    const adv = await repo.create()
    await repo.setCurrent(adv.id)
    const got = await repo.getCurrent()
    expect(got.id).toBe(adv.id)
  })

  it('updateMeta patches fields on the current adventure', async () => {
    const adv = await repo.create()
    await repo.setCurrent(adv.id)
    const updated = await repo.updateMeta({ name: 'Dragon Heist', dmName: 'Bob' })
    expect(updated.name).toBe('Dragon Heist')
    expect(updated.dmName).toBe('Bob')
    expect(updated.id).toBe(adv.id)
  })

  it('updateMeta throws when no current adventure', async () => {
    await expect(repo.updateMeta({ name: 'x' })).rejects.toThrow('NoCurrentAdventure')
  })

  // ── Party ───────────────────────────────────────────────────────────

  it('addPartyMember adds a member', async () => {
    const adv = await repo.create()
    await repo.setCurrent(adv.id)
    const char = await charRepo.create({ name: 'Elara' })
    await repo.addPartyMember({ characterId: char.id })
    const current = await repo.getCurrent()
    expect(current.party).toHaveLength(1)
    expect(current.party[0].characterId).toBe(char.id)
  })

  it('addPartyMember is idempotent', async () => {
    const adv = await repo.create()
    await repo.setCurrent(adv.id)
    const char = await charRepo.create()
    await repo.addPartyMember({ characterId: char.id })
    await repo.addPartyMember({ characterId: char.id })
    expect((await repo.getCurrent()).party).toHaveLength(1)
  })

  it('removePartyMember removes the correct member', async () => {
    const adv = await repo.create()
    await repo.setCurrent(adv.id)
    const a = await charRepo.create()
    const b = await charRepo.create()
    await repo.addPartyMember({ characterId: a.id })
    await repo.addPartyMember({ characterId: b.id })
    await repo.removePartyMember(a.id)
    const party = (await repo.getCurrent()).party
    expect(party).toHaveLength(1)
    expect(party[0].characterId).toBe(b.id)
  })

  it('setOwner updates ownerCharacterId', async () => {
    const adv = await repo.create()
    await repo.setCurrent(adv.id)
    const char = await charRepo.create()
    await repo.setOwner(char.id)
    expect((await repo.getCurrent()).ownerCharacterId).toBe(char.id)
  })

  // ── Map gallery ─────────────────────────────────────────────────────

  it('addMapImage appends to gallery', async () => {
    const adv = await repo.create()
    await repo.setCurrent(adv.id)
    const entry = await repo.addMapImage({ label: 'World', dataUrl: 'data:x', mime: 'image/jpeg', bytes: 100 })
    expect(entry.id).toBeTruthy()
    expect(entry.label).toBe('World')
    const maps = (await repo.getCurrent()).mapGallery
    expect(maps).toHaveLength(1)
  })

  it('removeMapImage removes the correct entry', async () => {
    const adv = await repo.create()
    await repo.setCurrent(adv.id)
    const e1 = await repo.addMapImage({ label: 'A', dataUrl: 'x', mime: 'image/jpeg', bytes: 1 })
    const e2 = await repo.addMapImage({ label: 'B', dataUrl: 'y', mime: 'image/jpeg', bytes: 1 })
    await repo.removeMapImage(e1.id)
    const maps = (await repo.getCurrent()).mapGallery
    expect(maps).toHaveLength(1)
    expect(maps[0].id).toBe(e2.id)
  })

  it('renameMapImage changes only the label', async () => {
    const adv = await repo.create()
    await repo.setCurrent(adv.id)
    const e = await repo.addMapImage({ label: 'Old', dataUrl: 'x', mime: 'image/jpeg', bytes: 1 })
    await repo.renameMapImage(e.id, 'New')
    const map = (await repo.getCurrent()).mapGallery[0]
    expect(map.label).toBe('New')
    expect(map.dataUrl).toBe('x')
  })

  // ── Log ─────────────────────────────────────────────────────────────

  it('appendLogEntry creates an entry with timestamps', async () => {
    const adv = await repo.create()
    await repo.setCurrent(adv.id)
    const entry = await repo.appendLogEntry({ title: 'Session 1', body: 'We met.' })
    expect(entry.id).toBeTruthy()
    expect(entry.createdAt).toBeTruthy()
    expect(entry.updatedAt).toBe(entry.createdAt)
    expect((await repo.getCurrent()).log).toHaveLength(1)
  })

  it('updateLogEntry changes body and bumps updatedAt', async () => {
    const adv = await repo.create()
    await repo.setCurrent(adv.id)
    const entry = await repo.appendLogEntry({ body: 'original' })
    await new Promise(r => setTimeout(r, 5)) // ensure different timestamp
    await repo.updateLogEntry(entry.id, { body: 'edited' })
    const log = (await repo.getCurrent()).log
    expect(log[0].body).toBe('edited')
    expect(log[0].createdAt).toBe(entry.createdAt)
    expect(log[0].updatedAt > entry.updatedAt).toBe(true)
  })

  it('updateLogEntry cannot overwrite id or createdAt', async () => {
    const adv = await repo.create()
    await repo.setCurrent(adv.id)
    const entry = await repo.appendLogEntry({ body: 'x' })
    await repo.updateLogEntry(entry.id, { id: 'hack', createdAt: '1970' })
    const log = (await repo.getCurrent()).log
    expect(log[0].id).toBe(entry.id)
    expect(log[0].createdAt).toBe(entry.createdAt)
  })

  it('deleteLogEntry removes the entry', async () => {
    const adv = await repo.create()
    await repo.setCurrent(adv.id)
    const e = await repo.appendLogEntry({ body: 'gone' })
    await repo.deleteLogEntry(e.id)
    expect((await repo.getCurrent()).log).toHaveLength(0)
  })
})
