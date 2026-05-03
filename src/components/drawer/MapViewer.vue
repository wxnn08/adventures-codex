<template>
  <Teleport to="body">
    <div :style="overlayStyle" @click.self="$emit('close')">
      <div :style="panelStyle">
        <div :style="headerStyle">
          <span :style="titleStyle">{{ map.label }}</span>
          <button :style="closeBtnStyle" @click="$emit('close')">✕</button>
        </div>
        <img :src="map.dataUrl" :alt="map.label" :style="imgStyle" />
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { C, FONT_DISPLAY } from '../../tokens.js'

defineProps({ map: Object })
defineEmits(['close'])

const overlayStyle = {
  position: 'fixed', inset: 0,
  background: 'rgba(43,24,16,0.75)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  zIndex: 2000,
}

const panelStyle = {
  background: C.paperHi,
  border: `2px solid ${C.rule}`,
  boxShadow: `0 12px 40px rgba(43,24,16,0.5)`,
  maxWidth: '90vw',
  maxHeight: '90vh',
  display: 'flex',
  flexDirection: 'column',
}

const headerStyle = {
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  padding: '10px 16px',
  borderBottom: `1px solid ${C.ruleSoft}`,
}

const titleStyle = {
  fontFamily: FONT_DISPLAY,
  fontSize: '11px',
  letterSpacing: '0.25em',
  textTransform: 'uppercase',
  color: C.inkFaint,
}

const closeBtnStyle = {
  background: 'transparent', border: 'none', cursor: 'pointer',
  color: C.inkFaint, fontSize: '14px',
}

const imgStyle = {
  maxWidth: '88vw', maxHeight: 'calc(90vh - 60px)',
  objectFit: 'contain', display: 'block',
}
</script>
