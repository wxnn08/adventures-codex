<template>
  <span
    v-if="tip"
    ref="anchor"
    :tabindex="0"
    :style="anchorStyle"
    @mouseenter="reveal"
    @mouseleave="hide"
    @focus="reveal"
    @blur="hide"
  >
    <slot />
  </span>
  <slot v-else />
  <Teleport to="body" v-if="tip">
    <div v-if="show" :style="tipStyle">
      <div :style="headerStyle">❦ {{ headerText }}</div>
      {{ tip }}
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue'
import { C, FONT_DISPLAY, FONT_BODY } from '../../tokens.js'

const props = defineProps({
  tip: { type: String, default: null },
  inline: { type: Boolean, default: false },
})

const anchor = ref(null)
const show = ref(false)
const pos = ref({ x: 0, y: 0, above: false })

const reveal = () => {
  if (!anchor.value) return
  const r = anchor.value.getBoundingClientRect()
  const above = r.top > 200
  pos.value = {
    x: r.left + r.width / 2,
    y: above ? r.top - 8 : r.bottom + 8,
    above,
  }
  show.value = true
}
const hide = () => { show.value = false }

const anchorStyle = computed(() => ({
  display: props.inline ? 'inline' : 'inline-block',
  cursor: 'help',
  borderBottom: props.inline ? `1px dotted ${C.gold}` : 'none',
  outline: 'none',
}))

const headerText = computed(() => {
  if (!props.tip) return ''
  return String(props.tip).split(' — ')[0].split('.')[0].slice(0, 40)
})

const tipStyle = computed(() => ({
  position: 'fixed',
  left: pos.value.x + 'px',
  top: pos.value.y + 'px',
  transform: `translate(-50%, ${pos.value.above ? '-100%' : '0'})`,
  zIndex: 1000,
  pointerEvents: 'none',
  maxWidth: '320px',
  background: `linear-gradient(180deg, ${C.paperHi} 0%, ${C.paperLo} 100%)`,
  border: `1.5px solid ${C.rule}`,
  boxShadow: `inset 0 0 0 3px ${C.paperHi}, inset 0 0 0 4px ${C.rule}, 0 6px 20px rgba(43,24,16,0.35)`,
  padding: '10px 14px',
  color: C.ink,
  fontFamily: FONT_BODY,
  fontSize: '13px',
  lineHeight: 1.5,
  textAlign: 'left',
  letterSpacing: 'normal',
  textTransform: 'none',
  fontWeight: 400,
  animation: 'tipFade 0.15s ease-out',
}))

const headerStyle = computed(() => ({
  fontFamily: FONT_DISPLAY,
  fontSize: '9.5px',
  letterSpacing: '0.28em',
  textTransform: 'uppercase',
  color: C.gold,
  fontWeight: 600,
  marginBottom: '4px',
}))
</script>
