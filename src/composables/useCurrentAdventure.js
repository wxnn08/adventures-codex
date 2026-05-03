import { ref, readonly } from 'vue'
import { getDefaultAdapter } from '../storage/index.js'
import { AdventureRepository } from '../storage/AdventureRepository.js'

let _shared = null

function create() {
  const adapter = getDefaultAdapter()
  const repo    = new AdventureRepository(adapter)
  const adventure = ref(null)

  const refresh = async () => {
    adventure.value = await repo.getCurrent()
  }

  refresh()

  const updateMeta     = async (patch)              => { await repo.updateMeta(patch);                 await refresh() }
  const addPartyMember = async (entry)              => { await repo.addPartyMember(entry);              await refresh() }
  const removePartyMember = async (characterId)     => { await repo.removePartyMember(characterId);    await refresh() }
  const setOwner       = async (characterId)        => { await repo.setOwner(characterId);             await refresh() }
  const addMapImage    = async (imgData)            => { const e = await repo.addMapImage(imgData);    await refresh(); return e }
  const removeMapImage = async (mapId)              => { await repo.removeMapImage(mapId);             await refresh() }
  const renameMapImage = async (mapId, label)       => { await repo.renameMapImage(mapId, label);      await refresh() }
  const appendLogEntry = async (entry)              => { const e = await repo.appendLogEntry(entry);   await refresh(); return e }
  const updateLogEntry = async (id, patch)          => { await repo.updateLogEntry(id, patch);         await refresh() }
  const deleteLogEntry = async (id)                 => { await repo.deleteLogEntry(id);                await refresh() }

  return {
    adventure: readonly(adventure),
    refresh,
    updateMeta, addPartyMember, removePartyMember, setOwner,
    addMapImage, removeMapImage, renameMapImage,
    appendLogEntry, updateLogEntry, deleteLogEntry,
  }
}

export function useCurrentAdventure() {
  if (!_shared) _shared = create()
  return _shared
}

/** Reset the singleton (used in tests / when adapter is swapped). */
export function _resetCurrentAdventureCache() { _shared = null }
