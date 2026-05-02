<template>
  <Frame ornate :style-overrides="{ marginBottom: '18px', padding: '20px 28px 18px' }">
    <div style="text-align: center; margin-bottom: 14px;">
      <div :style="kickerStyle">·&nbsp;&nbsp;Adventurer's Codex&nbsp;&nbsp;·</div>
      <input
        :value="char.name || ''"
        @input="e => update({ name: e.target.value })"
        placeholder="Character Name"
        :style="nameStyle"
      />
    </div>
    <div :style="metaGrid">
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
  ['level',       'Level'],
  ['race',        'Race'],
  ['background',  'Background'],
  ['alignment',   'Alignment'],
  ['xp',          'Experience'],
  ['playerName',  'Player'],
]

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

const metaGrid = { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '14px' }
</script>
