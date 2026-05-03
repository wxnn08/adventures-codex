<template>
  <Frame ornate :style-overrides="{ marginBottom: '18px', padding: '20px 28px 18px' }">
    <div :style="heroRowStyle" class="hero-row">
      <div :style="nameBlockStyle">
        <div :style="kickerStyle">·&nbsp;&nbsp;Adventurer's Codex&nbsp;&nbsp;·</div>
        <input
          :value="char.name || ''"
          @input="e => update({ name: e.target.value })"
          placeholder="Character Name"
          :style="nameStyle"
        />
      </div>
      <div :style="levelBlockStyle">
        <Label :style-overrides="levelLabelStyle">Level</Label>
        <AppInput
          :model-value="char.level"
          @update:model-value="v => update({ level: v })"
          align="center"
          :style-overrides="levelInputStyle"
        />
      </div>
    </div>
    <div :style="metaGrid" class="hero-meta-grid">
      <div v-for="[k, lbl] in metaFields" :key="k">
        <AppInput
          :model-value="char[k]"
          @update:model-value="v => update({ [k]: v })"
          align="center"
          :style-overrides="{ fontSize: '14px', fontFamily: FONT_BODY, fontWeight: 500 }"
        />
        <Label>{{ lbl }}</Label>
      </div>
    </div>
  </Frame>
</template>

<script setup>
import AppInput from './primitives/AppInput.vue'
import Frame from './primitives/Frame.vue'
import Label from './primitives/Label.vue'
import { C, FONT_DISPLAY, FONT_BODY } from '../tokens.js'

defineProps({ char: Object, update: Function })

const metaFields = [
  ['class',       'Class'],
  ['race',        'Race'],
  ['background',  'Background'],
  ['alignment',   'Alignment'],
  ['xp',          'Experience'],
  ['playerName',  'Player'],
]

const heroRowStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 104px',
  alignItems: 'end',
  gap: '18px',
  marginBottom: '14px',
}

const nameBlockStyle = {
  minWidth: 0,
  textAlign: 'center',
  paddingLeft: '104px',
}

const kickerStyle = {
  fontFamily: FONT_DISPLAY,
  fontSize: '9px',
  letterSpacing: '0.5em',
  color: C.gold,
  textTransform: 'uppercase',
  marginBottom: '4px',
}

const nameStyle = {
  background: 'transparent',
  border: 'none',
  borderBottom: `1px solid ${C.rule}`,
  outline: 'none',
  width: '100%',
  fontFamily: FONT_DISPLAY,
  fontSize: '38px',
  fontWeight: 700,
  color: C.ink,
  textAlign: 'center',
  padding: '4px 0 6px',
  letterSpacing: '0.04em',
}

const levelBlockStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-end',
  minWidth: 0,
}

const levelInputStyle = {
  width: '100%',
  fontFamily: FONT_DISPLAY,
  fontSize: '34px',
  fontWeight: 700,
  lineHeight: 1.05,
  color: C.ink,
  padding: '0 0 5px',
  border: 'none',
  borderBottom: `1px solid ${C.rule}`,
  background: 'transparent',
  letterSpacing: '0.04em',
}

const levelLabelStyle = {
  fontSize: '9px',
  margin: '0 0 5px',
}

const metaGrid = { display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '14px' }
</script>

<style>
@media (max-width: 900px) {
  .hero-row {
    grid-template-columns: 1fr !important;
    gap: 12px !important;
    align-items: stretch !important;
  }

  .hero-row > div:first-child {
    padding-left: 0 !important;
  }

  .hero-row input {
    font-size: 30px !important;
  }

  .hero-meta-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
    gap: 12px !important;
  }
}

@media (max-width: 640px) {
  .hero-meta-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
  }
}

@media (max-width: 420px) {
  .hero-meta-grid {
    grid-template-columns: 1fr !important;
  }

  .hero-row input {
    font-size: 24px !important;
  }
}
</style>
