<template>
  <div :style="shellStyle">
    <!-- Left drawer -->
    <AdventureDrawer v-if="drawerOpen" />

    <!-- Sheet container -->
    <div :style="sheetContainerStyle">
      <div style="max-width: 1280px; margin: 0 auto;">
        <Toolbar :char="char" :reset="resetChar" :on-toggle-drawer="toggleDrawer" />

        <!-- Back-to-owner banner -->
        <div v-if="char && !isViewingOwner()" :style="bannerStyle">
          Viewing <strong>{{ char.name || 'Party Member' }}</strong>
          <button @click="backToOwner" :style="bannerBtnStyle">← Back to my character</button>
        </div>

        <HeroHeader v-if="char" :char="char" :update="updateChar" />
        <Tabs v-if="char" :tab="tab" @update:tab="v => tab = v" />
        <StatsPage  v-if="char && tab === 'stats'"  :char="char" :update="updateChar" />
        <BioPage    v-else-if="char && tab === 'bio'"    :char="char" :update="updateChar" />
        <SpellsPage v-else-if="char && tab === 'spells'" :char="char" :update="updateChar" />
        <div v-else-if="!char" :style="loadingStyle">Loading…</div>
        <div :style="footerStyle">✦&nbsp;&nbsp;·&nbsp;&nbsp;✦&nbsp;&nbsp;·&nbsp;&nbsp;✦</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Toolbar from './components/Toolbar.vue'
import HeroHeader from './components/HeroHeader.vue'
import Tabs from './components/Tabs.vue'
import StatsPage from './components/StatsPage.vue'
import BioPage from './components/BioPage.vue'
import SpellsPage from './components/SpellsPage.vue'
import AdventureDrawer from './components/drawer/AdventureDrawer.vue'
import { useCurrentCharacter } from './composables/useCurrentCharacter.js'
import { useAdventureDrawer } from './composables/useAdventureDrawer.js'
import { blankCharacter } from './tokens.js'
import { C, FONT_BODY, FONT_DISPLAY } from './tokens.js'

const { char, update: updateChar, backToOwner, isViewingOwner } = useCurrentCharacter()
const { open: drawerOpen, toggle: toggleDrawer } = useAdventureDrawer()
const tab = ref('stats')

const resetChar = () => {
  if (confirm('Reset this character? This cannot be undone.')) {
    updateChar(blankCharacter())
  }
}

const shellStyle = {
  display: 'flex',
  minHeight: '100vh',
  background: `
    radial-gradient(ellipse at 20% 0%, rgba(245,230,200,0.9) 0%, transparent 55%),
    radial-gradient(ellipse at 80% 100%, rgba(212,184,140,0.6) 0%, transparent 60%),
    radial-gradient(ellipse at 50% 50%, transparent 0%, rgba(139,90,43,0.08) 100%),
    repeating-linear-gradient(0deg, rgba(139,90,43,0.025) 0 2px, transparent 2px 4px),
    repeating-linear-gradient(90deg, rgba(139,90,43,0.015) 0 3px, transparent 3px 6px),
    #ede0c4
  `,
  backgroundColor: '#ede0c4',
  color: C.ink,
  fontFamily: FONT_BODY,
}

const sheetContainerStyle = {
  flex: 1,
  padding: '24px 32px 40px',
  minWidth: 0,
}

const bannerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  background: `rgba(139,90,43,0.1)`,
  border: `1px solid ${C.ruleSoft}`,
  padding: '8px 16px',
  marginBottom: '12px',
  fontFamily: FONT_DISPLAY,
  fontSize: '11px',
  letterSpacing: '0.12em',
  color: C.inkFaint,
}

const bannerBtnStyle = {
  background: 'transparent',
  border: `1px solid ${C.rule}`,
  color: C.inkFaint,
  padding: '3px 10px',
  fontFamily: FONT_DISPLAY,
  fontSize: '9px',
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  cursor: 'pointer',
}

const loadingStyle = {
  textAlign: 'center',
  padding: '60px',
  fontFamily: FONT_DISPLAY,
  color: C.gold,
  letterSpacing: '0.3em',
}

const footerStyle = {
  marginTop: '28px',
  textAlign: 'center',
  fontFamily: FONT_DISPLAY,
  fontSize: '9px',
  letterSpacing: '0.4em',
  color: C.gold,
  textTransform: 'uppercase',
}
</script>
