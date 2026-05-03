import { ref, readonly, watch } from 'vue'
import { getDefaultAdapter } from '../storage/index.js'
import { CharacterRepository } from '../storage/CharacterRepository.js'
import { useCurrentAdventure } from './useCurrentAdventure.js'

const VIEWING_KEY = 'ui:viewingCharacterId'

let _shared = null

function create() {
  const adapter  = getDefaultAdapter()
  const charRepo = new CharacterRepository(adapter)
  const { adventure } = useCurrentAdventure()

  const viewingId = ref(null)
  const char      = ref(null)

  const loadChar = async (id) => {
    if (!id) { char.value = null; return }
    char.value = await charRepo.get(id)
  }

  // Resolve initial viewingId: persisted → ownerCharacterId
  adapter.get(VIEWING_KEY).then(async r => {
    if (r.ok && r.value) {
      viewingId.value = r.value
    } else if (adventure.value?.ownerCharacterId) {
      viewingId.value = adventure.value.ownerCharacterId
    }
    await loadChar(viewingId.value)
  })

  // When adventure loads and we have no viewingId yet, set to owner
  watch(adventure, async (adv) => {
    if (!viewingId.value && adv?.ownerCharacterId) {
      viewingId.value = adv.ownerCharacterId
      await loadChar(viewingId.value)
    }
  })

  // When viewingId changes, load the character and persist
  watch(viewingId, async (id) => {
    await adapter.set(VIEWING_KEY, id)
    await loadChar(id)
  })

  const update = async (patch) => {
    if (!viewingId.value) return
    char.value = await charRepo.update(viewingId.value, patch)
  }

  const switchTo = async (id) => {
    viewingId.value = id
  }

  const backToOwner = async () => {
    const ownerId = adventure.value?.ownerCharacterId
    if (ownerId) viewingId.value = ownerId
  }

  const isViewingOwner = () => {
    return viewingId.value === adventure.value?.ownerCharacterId
  }

  return {
    char: readonly(char),
    viewingId: readonly(viewingId),
    update,
    switchTo,
    backToOwner,
    isViewingOwner,
    reload: () => loadChar(viewingId.value),
  }
}

export function useCurrentCharacter() {
  if (!_shared) _shared = create()
  return _shared
}

export function _resetCurrentCharacterCache() { _shared = null }
