<template>
  <div :style="rootStyle">
    <div style="max-width: 1280px; margin: 0 auto;">
      <Toolbar :char="char" :reset="reset" />
      <HeroHeader :char="char" :update="update" />
      <Tabs :tab="tab" @update:tab="v => tab = v" />
      <StatsPage  v-if="tab === 'stats'"  :char="char" :update="update" />
      <BioPage    v-else-if="tab === 'bio'"    :char="char" :update="update" />
      <SpellsPage v-else-if="tab === 'spells'" :char="char" :update="update" />
      <div :style="footerStyle">✦&nbsp;&nbsp;·&nbsp;&nbsp;✦&nbsp;&nbsp;·&nbsp;&nbsp;✦</div>
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
import { useCharacter } from './composables/useCharacter.js'
import { C, FONT_BODY, FONT_DISPLAY } from './tokens.js'

const { char, update, reset } = useCharacter('dnd5e-parchment-final')
const tab = ref('stats')

const rootStyle = {
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
  padding: '24px 32px 40px',
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
