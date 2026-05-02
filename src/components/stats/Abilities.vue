<template>
  <div :style="grid">
    <div v-for="a in ABILITIES" :key="a.key" :style="stoneStyle">
      <Tooltip :tip="lookupTip(a.label)">
        <div :style="labelStyle">{{ a.label }}</div>
      </Tooltip>
      <div :style="modStyle">{{ fmtMod(abilityMod(char.abilities[a.key])) }}</div>
      <div :style="circleStyle">
        <input
          :value="char.abilities[a.key] || ''"
          @input="e => update({ abilities: { ...char.abilities, [a.key]: e.target.value } })"
          :style="scoreInputStyle"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import Tooltip from '../primitives/Tooltip.vue'
import { C, FONT_DISPLAY, ABILITIES, abilityMod, fmtMod } from '../../tokens.js'
import { lookupTip } from '../../tooltips.js'

defineProps({ char: Object, update: Function })

const grid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }

const stoneStyle = {
  background: `linear-gradient(180deg, ${C.paperHi} 0%, ${C.paperLo} 100%)`,
  border: `1.5px solid ${C.rule}`,
  boxShadow: 'inset 0 0 10px rgba(139,90,43,0.18), 0 1px 2px rgba(0,0,0,0.08)',
  padding: '10px 6px 8px',
  textAlign: 'center',
  position: 'relative',
  borderRadius: '3px',
}

const labelStyle = {
  fontFamily: FONT_DISPLAY,
  fontSize: '9px',
  letterSpacing: '0.22em',
  textTransform: 'uppercase',
  color: C.inkFaint,
  fontWeight: 600,
  cursor: 'help',
}

const modStyle = {
  fontFamily: FONT_DISPLAY,
  fontSize: '34px',
  lineHeight: 1,
  color: C.ink,
  fontWeight: 700,
  margin: '6px 0 4px',
}

const circleStyle = {
  display: 'inline-block',
  background: C.paperHi,
  border: `1.5px solid ${C.rule}`,
  borderRadius: '50%',
  width: '40px',
  height: '40px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.18), inset 0 1px 2px rgba(255,255,255,0.5)',
}

const scoreInputStyle = {
  width: '100%',
  height: '100%',
  background: 'transparent',
  border: 'none',
  outline: 'none',
  textAlign: 'center',
  fontFamily: FONT_DISPLAY,
  fontSize: '18px',
  fontWeight: 700,
  color: C.ink,
}
</script>
