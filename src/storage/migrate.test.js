import { describe, it, expect, beforeEach } from 'vitest'
import { MemoryAdapter } from './MemoryAdapter.js'
import { ensureInitialAdventure, runLegacyMigration } from './migrate.js'
import { AdventureRepository } from './AdventureRepository.js'
import { CharacterRepository } from './CharacterRepository.js'

describe('runLegacyMigration', () => {
  let adapter

  beforeEach(() => { adapter = new MemoryAdapter() })

  it('is a no-op on a fresh database', async () => {
    await runLegacyMigration(adapter)
    const r = await adapter.get('adventure:index')
    expect(r.ok).toBe(false) // still NotFound — nothing created
  })

  it('lifts the legacy blob into new keyspace', async () => {
    adapter.seed('dnd5e-parchment-final', { name: 'Kira', class: 'Rogue', level: '5' })
    await runLegacyMigration(adapter)

    const advRepo  = new AdventureRepository(adapter)
    const charRepo = new CharacterRepository(adapter)

    const adventure = await advRepo.getCurrent()
    expect(adventure).not.toBeNull()
    expect(adventure.ownerCharacterId).toBeTruthy()

    const char = await charRepo.get(adventure.ownerCharacterId)
    expect(char).not.toBeNull()
    expect(char.name).toBe('Kira')
    expect(char.class).toBe('Rogue')
    expect(char.id).toBe(adventure.ownerCharacterId)

    expect(adventure.party).toHaveLength(1)
    expect(adventure.party[0].characterId).toBe(char.id)
  })

  it('removes the legacy key after migration', async () => {
    adapter.seed('dnd5e-parchment-final', { name: 'Zara' })
    await runLegacyMigration(adapter)
    const r = await adapter.get('dnd5e-parchment-final')
    expect(r.ok).toBe(false)
  })

  it('is idempotent — running twice does not duplicate data', async () => {
    adapter.seed('dnd5e-parchment-final', { name: 'Dex' })
    await runLegacyMigration(adapter)
    await runLegacyMigration(adapter) // second run

    const advRepo = new AdventureRepository(adapter)
    const adventure = await advRepo.getCurrent()
    expect(adventure.party).toHaveLength(1)

    const charRepo = new CharacterRepository(adapter)
    const chars = await charRepo.list()
    expect(chars).toHaveLength(1)
  })

  it('creates a starter adventure and character on fresh storage', async () => {
    await ensureInitialAdventure(adapter)

    const advRepo = new AdventureRepository(adapter)
    const charRepo = new CharacterRepository(adapter)

    const adventure = await advRepo.getCurrent()
    expect(adventure).not.toBeNull()
    expect(adventure.ownerCharacterId).toBeTruthy()
    expect(adventure.party).toEqual([
      { characterId: adventure.ownerCharacterId, role: 'Player Character' },
    ])

    const char = await charRepo.get(adventure.ownerCharacterId)
    expect(char).not.toBeNull()
    expect(char.id).toBe(adventure.ownerCharacterId)
  })

  it('does not create duplicates when starter data already exists', async () => {
    await ensureInitialAdventure(adapter)
    await ensureInitialAdventure(adapter)

    const advRepo = new AdventureRepository(adapter)
    const charRepo = new CharacterRepository(adapter)

    const adventure = await advRepo.getCurrent()
    const chars = await charRepo.list()

    expect(adventure.party).toHaveLength(1)
    expect(chars).toHaveLength(1)
  })
})
