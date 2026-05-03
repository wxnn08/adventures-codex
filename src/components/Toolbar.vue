<template>
  <div :style="wrapStyle">
    <div style="display: flex; align-items: center; gap: 12px;">
      <button :style="btnStyle" @mouseenter="hover($event, true)" @mouseleave="hover($event, false)"
        @click="onToggleDrawer">≡ Menu</button>
      <div :style="brandStyle">❦&nbsp;&nbsp;Dungeons &amp; Dragons 5e SRD&nbsp;&nbsp;❦</div>
    </div>
    <div style="display: flex; gap: 8px;">
      <button :style="btnStyle" @mouseenter="hover($event, true)" @mouseleave="hover($event, false)" @click="exportJSON">Export JSON</button>
      <button :style="btnStyle" @mouseenter="hover($event, true)" @mouseleave="hover($event, false)"
        @click="confirmReset">Reset</button>
    </div>
  </div>
</template>

<script setup>
import { C, FONT_DISPLAY } from '../tokens.js'

const props = defineProps({
  char: Object,
  reset: Function,
  onToggleDrawer: { type: Function, default: () => {} },
})

const exportJSON = () => {
  if (!props.char) return
  const blob = new Blob([JSON.stringify(props.char, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${(props.char.name || 'character').replace(/\s+/g, '-')}.json`
  a.click()
  URL.revokeObjectURL(url)
}

const confirmReset = () => {
  if (confirm('Reset character? This cannot be undone.')) props.reset()
}

const hover = (e, on) => {
  e.currentTarget.style.background = on ? C.rule       : 'transparent'
  e.currentTarget.style.color      = on ? C.paperHi    : C.inkFaint
}

const wrapStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '8px',
  padding: '0 4px',
}

const brandStyle = {
  fontFamily: FONT_DISPLAY,
  fontSize: '10px',
  letterSpacing: '0.45em',
  color: C.gold,
  textTransform: 'uppercase',
  fontWeight: 600,
  whiteSpace: 'nowrap',
}

const btnStyle = {
  background: 'transparent',
  border: `1px solid ${C.rule}`,
  color: C.inkFaint,
  padding: '4px 14px',
  fontFamily: FONT_DISPLAY,
  fontSize: '9.5px',
  letterSpacing: '0.22em',
  textTransform: 'uppercase',
  cursor: 'pointer',
  fontWeight: 600,
  transition: 'all 0.15s',
  whiteSpace: 'nowrap',
}
</script>
