<template>
  <aside :style="drawerStyle">
    <div :style="headerStyle">
      <div :style="titleStyle">⚔ Adventure</div>
      <button :style="closeBtnStyle" @click="close" title="Close">✕</button>
    </div>
    <div :style="scrollStyle">
      <DrawerSection title="Adventure" glyph="❦" :default-open="true">
        <AdventureIdentity />
      </DrawerSection>
      <DrawerSection title="Party" glyph="⚔">
        <PartyList />
      </DrawerSection>
      <DrawerSection title="Maps" glyph="✦">
        <MapGallery />
      </DrawerSection>
      <DrawerSection title="Adventure Log" glyph="✦">
        <AdventureLog />
      </DrawerSection>
    </div>
  </aside>
</template>

<script setup>
import DrawerSection from './DrawerSection.vue'
import AdventureIdentity from './AdventureIdentity.vue'
import PartyList from './PartyList.vue'
import MapGallery from './MapGallery.vue'
import AdventureLog from './AdventureLog.vue'
import { useAdventureDrawer } from '../../composables/useAdventureDrawer.js'
import { C, FONT_DISPLAY } from '../../tokens.js'

const { close } = useAdventureDrawer()

const drawerStyle = {
  width: '280px',
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
  borderRight: `1px solid ${C.rule}`,
  background: `linear-gradient(180deg, ${C.paperHi} 0%, ${C.paper} 100%)`,
  boxShadow: `inset -4px 0 12px rgba(139,90,43,0.06)`,
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
  padding: '8px 0 24px',
}
</script>
