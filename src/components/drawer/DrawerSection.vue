<template>
  <div :style="wrapStyle">
    <button :style="headerStyle" @click="expanded = !expanded">
      <span :style="glyphStyle">{{ glyph }}</span>
      <span :style="labelStyle">{{ title }}</span>
      <span :style="chevronStyle">{{ expanded ? '▾' : '▸' }}</span>
    </button>
    <div v-if="expanded" :style="bodyStyle">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { C, FONT_DISPLAY } from '../../tokens.js'

const props = defineProps({
  title: String,
  glyph: { type: String, default: '❦' },
  defaultOpen: { type: Boolean, default: false },
})

const expanded = ref(props.defaultOpen)

const wrapStyle = {
  borderBottom: `1px solid ${C.ruleSoft}`,
}

const headerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  width: '100%',
  background: 'transparent',
  border: 'none',
  padding: '10px 14px',
  cursor: 'pointer',
  textAlign: 'left',
}

const glyphStyle = {
  color: C.gold,
  fontSize: '10px',
  flexShrink: 0,
}

const labelStyle = {
  flex: 1,
  fontFamily: FONT_DISPLAY,
  fontSize: '9.5px',
  letterSpacing: '0.28em',
  textTransform: 'uppercase',
  color: C.inkFaint,
  fontWeight: 600,
}

const chevronStyle = {
  color: C.inkFaint,
  fontSize: '10px',
}

const bodyStyle = {
  padding: '4px 14px 14px',
}
</script>
