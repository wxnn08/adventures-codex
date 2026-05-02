<template>
  <Tooltip v-if="tip" :tip="tip">
    <div :style="boxStyle">
      <div :style="labelStyle"><slot /></div>
    </div>
  </Tooltip>
  <div v-else :style="labelStyle"><slot /></div>
</template>

<script setup>
import { computed, useSlots } from 'vue'
import Tooltip from './Tooltip.vue'
import { C, FONT_DISPLAY } from '../../tokens.js'
import { lookupTip } from '../../tooltips.js'

const props = defineProps({
  align: { type: String, default: 'center' },
  noTip: { type: Boolean, default: false },
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

const tip = computed(() => props.noTip ? null : lookupTip(slotText()))

const labelStyle = computed(() => ({
  fontFamily: FONT_DISPLAY,
  fontSize: '9px',
  letterSpacing: '0.22em',
  textTransform: 'uppercase',
  color: C.inkFaint,
  textAlign: props.align,
  marginTop: '4px',
  fontWeight: 500,
  ...props.styleOverrides,
}))

const boxStyle = { display: 'block' }
</script>
