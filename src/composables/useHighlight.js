import { ref } from 'vue'

let _shared = null

export function useHighlight() {
  if (!_shared) _shared = {
    active: ref(null),
    tab: ref(null),
  }
  return _shared
}
