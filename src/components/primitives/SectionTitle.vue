<template>
  <div :style="wrapStyle">
    <div :style="ruleLeftStyle" />
    <Tooltip v-if="tip" :tip="tip">
      <div :style="innerStyle">❦&nbsp;&nbsp;<slot />&nbsp;&nbsp;❦</div>
    </Tooltip>
    <div v-else :style="innerStyle">❦&nbsp;&nbsp;<slot />&nbsp;&nbsp;❦</div>
    <div :style="ruleRightStyle" />
  </div>
</template>

<script setup>
import { computed, useSlots } from 'vue'
import Tooltip from './Tooltip.vue'
import { C, FONT_DISPLAY } from '../../tokens.js'
import { lookupTip } from '../../tooltips.js'

const props = defineProps({
  styleOverrides: { type: Object, default: () => ({}) },
})

const slots = useSlots()
const slotText = () => {
  if (!slots.default) return ''
  const out = []
  const walk = (nodes) => {
    for (const n of nodes) {
      if (typeof n.children === 'string') out.push(n.children)
      else if (Array.isArray(n.children)) walk(n.children)
    }
  }
  walk(slots.default())
  return out.join('')
}

const tip = computed(() => lookupTip(slotText()))

const wrapStyle = computed(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  margin: '4px 0 12px',
  ...props.styleOverrides,
}))

const innerStyle = {
  fontFamily: FONT_DISPLAY,
  fontSize: '10px',
  letterSpacing: '0.32em',
  color: C.inkFaint,
  fontWeight: 600,
  whiteSpace: 'nowrap',
}

const ruleLeftStyle = { flex: 1, height: '1px', background: `linear-gradient(to right, transparent, ${C.rule} 40%, ${C.rule})` }
const ruleRightStyle = { flex: 1, height: '1px', background: `linear-gradient(to left, transparent, ${C.rule} 40%, ${C.rule})` }
</script>
