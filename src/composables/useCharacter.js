import { ref, watch } from 'vue'
import { blankCharacter } from '../tokens.js'

export function useCharacter(storageKey) {
  const load = () => {
    try {
      const raw = localStorage.getItem(storageKey)
      if (raw) return { ...blankCharacter(), ...JSON.parse(raw) }
    } catch (e) {}
    return blankCharacter()
  }

  const char = ref(load())

  let timer = null
  watch(char, (val) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      try { localStorage.setItem(storageKey, JSON.stringify(val)) } catch (e) {}
    }, 250)
  }, { deep: true })

  const update = (patch) => {
    if (typeof patch === 'function') {
      const next = patch(char.value)
      char.value = next
    } else {
      char.value = { ...char.value, ...patch }
    }
  }

  const reset = () => { char.value = blankCharacter() }

  return { char, update, reset }
}
