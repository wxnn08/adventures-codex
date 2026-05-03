import { CharacterRepository } from './CharacterRepository.js'
import { AdventureRepository } from './AdventureRepository.js'

const LEGACY_KEY = 'dnd5e-parchment-final'

/**
 * One-time migration from the legacy single-blob storage to the new
 * character/<id> + adventure/<id> keyspace.
 * Idempotent: if adventure:index is already populated, does nothing.
 *
 * @param {import('./StorageAdapter.js').StorageAdapter} adapter
 */
export async function runLegacyMigration(adapter) {
  const indexResult = await adapter.get('adventure:index')
  if (indexResult.ok && indexResult.value.length > 0) return // already migrated

  const legacyResult = await adapter.get(LEGACY_KEY)
  if (!legacyResult.ok) return // nothing to migrate

  const legacyBlob = legacyResult.value

  const charRepo = new CharacterRepository(adapter)
  const advRepo  = new AdventureRepository(adapter)

  const character = await charRepo.create(legacyBlob)
  const adventure = await advRepo.create({ ownerCharacterId: character.id })
  await advRepo.setCurrent(adventure.id)
  await advRepo.addPartyMember({ characterId: character.id })
  await adapter.remove(LEGACY_KEY)
}

/**
 * Ensure a brand-new install has something to render.
 *
 * Fresh browsers have neither the legacy single-blob key nor the newer
 * adventure/character records. Without a current adventure and owner character,
 * the app stays on the loading state indefinitely.
 *
 * @param {import('./StorageAdapter.js').StorageAdapter} adapter
 */
export async function ensureInitialAdventure(adapter) {
  const advRepo = new AdventureRepository(adapter)
  const current = await advRepo.getCurrent()
  if (current?.ownerCharacterId) return current

  const charRepo = new CharacterRepository(adapter)
  const character = await charRepo.create()
  const adventure = await advRepo.create({ ownerCharacterId: character.id })
  await advRepo.setCurrent(adventure.id)
  await advRepo.addPartyMember({ characterId: character.id, role: 'Player Character' })

  return advRepo.getCurrent()
}
