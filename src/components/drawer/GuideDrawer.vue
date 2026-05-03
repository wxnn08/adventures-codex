<template>
  <aside :style="drawerStyle">
    <div :style="headerStyle">
      <div :style="titleStyle">❦&nbsp;&nbsp;Player's Guide</div>
      <button :style="closeBtnStyle" @click="close" title="Close guide">✕</button>
    </div>
    <div :style="scrollStyle">
      <GuidePage />
    </div>
  </aside>
</template>

<script setup>
import GuidePage from '../GuidePage.vue'
import { useGuideDrawer } from '../../composables/useGuideDrawer.js'
import { C, FONT_DISPLAY } from '../../tokens.js'

const { close } = useGuideDrawer()

const drawerStyle = {
  width: '400px',
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
  position: 'sticky',
  top: 0,
  height: '100vh',
  borderLeft: `1px solid ${C.rule}`,
  background: `linear-gradient(180deg, ${C.paperHi} 0%, ${C.paper} 100%)`,
  boxShadow: `inset 4px 0 12px rgba(139,90,43,0.06)`,
}

const headerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '18px 14px 12px',
  borderBottom: `1px solid ${C.ruleSoft}`,
  flexShrink: 0,
}

const titleStyle = {
  fontFamily: FONT_DISPLAY,
  fontSize: '11px',
  letterSpacing: '0.35em',
  textTransform: 'uppercase',
  color: C.gold,
  fontWeight: 600,
}

const closeBtnStyle = {
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  color: C.inkFaint,
  fontSize: '14px',
  padding: '2px 6px',
  fontFamily: 'inherit',
}

const scrollStyle = {
  flex: 1,
  overflowY: 'auto',
  padding: '24px 20px 32px',
}
</script>
