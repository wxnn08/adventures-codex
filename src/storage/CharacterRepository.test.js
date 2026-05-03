import { describe, it, expect, beforeEach } from 'vitest'
import { MemoryAdapter } from './MemoryAdapter.js'
import { CharacterRepository } from './CharacterRepository.js'

describe('CharacterRepository', () => {
  let repo

  beforeEach(() => {
    repo = new CharacterRepository(new MemoryAdapter())
  })

  it('creates a character with a generated id', async () => {
    const char = await repo.create({ name: 'Aric' })
    expect(char.id).toBeTruthy()
    expect(char.name).toBe('Aric')
  })

  it('get returns the created character', async () => {
    const char = await repo.create({ name: 'Bree' })
    const got = await repo.get(char.id)
    expect(got).toEqual(char)
  })

  it('get returns null for missing id', async () => {
    const got = await repo.get('nope')
    expect(got).toBeNull()
  })

  it('update patches the character and preserves id', async () => {
    const char = await repo.create({ name: 'Cael' })
    const updated = await repo.update(char.id, { name: 'Caelion', level: '3' })
    expect(updated.id).toBe(char.id)
    expect(updated.name).toBe('Caelion')
    expect(updated.level).toBe('3')
  })

  it('update throws for missing id', async () => {
    await expect(repo.update('ghost', { name: 'x' })).rejects.toThrow()
  })

  it('remove deletes the character', async () => {
    const char = await repo.create()
    await repo.remove(char.id)
    expect(await repo.get(char.id)).toBeNull()
  })

  it('list returns all created characters', async () => {
    const a = await repo.create({ name: 'A' })
    const b = await repo.create({ name: 'B' })
    const list = await repo.list()
    const ids = list.map(c => c.id)
    expect(ids).toContain(a.id)
    expect(ids).toContain(b.id)
  })

  it('list returns empty array when no characters exist', async () => {
    expect(await repo.list()).toEqual([])
  })

  it('stored copies are immutable — mutating the returned object does not affect storage', async () => {
    const char = await repo.create({ name: 'Dana' })
    char.name = 'MUTATED'
    const got = await repo.get(char.id)
    expect(got.name).toBe('Dana')
  })
})
