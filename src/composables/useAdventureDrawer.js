import { ref, watch } from 'vue'
import { getDefaultAdapter } from '../storage/index.js'

const UI_KEY = 'ui:adventureDrawerOpen'

export function useAdventureDrawer() {
  const adapter = getDefaultAdapter()
  const open = ref(false)

  // Load persisted state once
  adapter.get(UI_KEY).then(r => {
    if (r.ok) open.value = r.value
  })

  watch(open, (val) => adapter.set(UI_KEY, val))

  return {
    open,
    toggle: () => { open.value = !open.value },
    openIt: () => { open.value = true },
    close:  () => { open.value = false },
  }
}
