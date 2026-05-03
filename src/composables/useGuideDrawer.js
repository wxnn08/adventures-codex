import { ref } from 'vue'
import { useHighlight } from './useHighlight.js'

const open = ref(false)

function clearGuideFocus() {
  const highlight = useHighlight()
  highlight.active.value = null
  highlight.tab.value = null
}

export function useGuideDrawer() {
  return {
    open,
    toggle: () => {
      open.value = !open.value
      if (!open.value) clearGuideFocus()
    },
    close:  () => {
      open.value = false
      clearGuideFocus()
    },
  }
}
