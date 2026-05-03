import { reactive, watch } from 'vue'
import { getDefaultAdapter } from '../storage/index.js'

const PROGRESS_KEY = 'ui:guideProgress'

let _shared = null

function create() {
  const adapter = getDefaultAdapter()

  const state = reactive({
    setupDone: false,
    level: 1,
    generationMethod: null,
    current: 0,
    checks: {},
    done: false,
  })

  adapter.get(PROGRESS_KEY).then(r => {
    if (r.ok && r.value && typeof r.value === 'object') {
      if (typeof r.value.setupDone === 'boolean') state.setupDone = r.value.setupDone
      if (typeof r.value.level === 'number') state.level = r.value.level
      if (r.value.generationMethod) state.generationMethod = r.value.generationMethod
      if (typeof r.value.current === 'number') state.current = r.value.current
      if (r.value.checks && typeof r.value.checks === 'object') state.checks = r.value.checks
      if (typeof r.value.done === 'boolean') state.done = r.value.done
    }
  })

  watch(state, val => {
    adapter.set(PROGRESS_KEY, {
      setupDone: val.setupDone,
      level: val.level,
      generationMethod: val.generationMethod,
      current: val.current,
      checks: val.checks,
      done: val.done,
    })
  }, { deep: true })

  function completeSetup(level, method) {
    state.level = level
    state.generationMethod = method
    state.setupDone = true
  }

  function toggle(si, ii) {
    const cur = state.checks[si] ?? []
    const idx = cur.indexOf(ii)
    state.checks[si] = idx === -1 ? [...cur, ii] : cur.filter(x => x !== ii)
  }

  function isChecked(si, ii) {
    return (state.checks[si] ?? []).includes(ii)
  }

  function allChecked(si, count) {
    return (state.checks[si] ?? []).length === count
  }

  function goTo(si)  { state.current = si }
  function finish()  { state.done = true }
  function review()  { state.done = false; state.current = 0 }
  function reset() {
    state.checks = {}
    state.done = false
    state.current = 0
    state.setupDone = false
    state.level = 1
    state.generationMethod = null
  }

  return { state, completeSetup, toggle, isChecked, allChecked, goTo, finish, review, reset }
}

export function useGuideProgress() {
  if (!_shared) _shared = create()
  return _shared
}

export function _resetGuideProgressCache() { _shared = null }
