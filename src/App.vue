<template>
  <div :style="shellStyle">
    <!-- Sheet container -->
    <div :style="sheetContainerStyle" style="flex: 1; min-width: 0;">
      <div style="max-width: 1280px; margin: 0 auto;">
        <Toolbar :char="char" :reset="resetChar" />

        <!-- Back-to-owner banner -->
        <div v-if="char && !isViewingOwner()" :style="bannerStyle">
          Viewing <strong>{{ char.name || 'Party Member' }}</strong>
          <button @click="backToOwner" :style="bannerBtnStyle">← Back to my character</button>
        </div>

        <div v-if="char" data-guide-section="header" :style="hlStyle('header')"><HeroHeader :char="char" :update="updateChar" /></div>
        <Tabs v-if="char" :tab="tab" @update:tab="v => tab = v" />
        <div v-if="char && tab === 'stats'"><StatsPage :char="char" :update="updateChar" /></div>
        <div v-else-if="char && tab === 'bio'" data-guide-section="bio" :style="hlStyle('bio')"><BioPage :char="char" :update="updateChar" /></div>
        <div v-else-if="char && tab === 'spells'" data-guide-section="spells" :style="hlStyle('spells')"><SpellsPage :char="char" :update="updateChar" /></div>
        <div v-else-if="!char" :style="loadingStyle">Loading…</div>
        <div :style="footerStyle">✦&nbsp;&nbsp;·&nbsp;&nbsp;✦&nbsp;&nbsp;·&nbsp;&nbsp;✦</div>
      </div>
    </div>

    <!-- Right guide drawer -->
    <GuideDrawer v-if="guideOpen" />
  </div>
</template>

<script setup>
import { nextTick, ref, watch } from 'vue'
import Toolbar from './components/Toolbar.vue'
import HeroHeader from './components/HeroHeader.vue'
import Tabs from './components/Tabs.vue'
import StatsPage from './components/StatsPage.vue'
import BioPage from './components/BioPage.vue'
import SpellsPage from './components/SpellsPage.vue'
import GuideDrawer from './components/drawer/GuideDrawer.vue'
import { useCurrentCharacter } from './composables/useCurrentCharacter.js'
import { useGuideDrawer } from './composables/useGuideDrawer.js'
import { useHighlight } from './composables/useHighlight.js'
import { blankCharacter } from './tokens.js'
import { C, FONT_BODY, FONT_DISPLAY } from './tokens.js'

const { char, update: updateChar, backToOwner, isViewingOwner } = useCurrentCharacter()
const { open: guideOpen } = useGuideDrawer()
const highlight = useHighlight()
const tab = ref('stats')

watch(
  () => [highlight.active.value, highlight.tab.value],
  async ([active, guideTab]) => {
    if (!active) return
    if (guideTab && tab.value !== guideTab) tab.value = guideTab

    await nextTick()

    const target = Array.from(document.querySelectorAll('[data-guide-section]'))
      .find(el => (el.dataset.guideSection || '').split(/\s+/).includes(active))

    target?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' })
  },
  { immediate: true },
)

function hlStyle(id) {
  const isActive = highlight.active.value === id
  return {
    borderRadius: '3px',
    background: isActive ? 'rgba(184,134,43,0.08)' : 'transparent',
    boxShadow: isActive
      ? `0 0 0 3px ${C.gold}, 0 0 0 7px rgba(184,134,43,0.18), 0 10px 28px rgba(84,52,24,0.2)`
      : 'none',
    animation: isActive ? 'guideFocusPulse 1.05s ease-in-out' : 'none',
    transition: 'box-shadow 0.2s',
  }
}

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

<style>
@keyframes guideFocusPulse {
  0%, 100% {
    filter: none;
    transform: scale(1);
  }

  50% {
    filter: brightness(1.08) saturate(1.08);
    transform: scale(1.01);
  }
}
</style>
