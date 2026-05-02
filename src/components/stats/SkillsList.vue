<template>
  <Frame>
    <SectionTitle>Skills</SectionTitle>
    <div style="display: flex; flex-direction: column; gap: 4px;">
      <div v-for="s in SKILLS" :key="s.key" :style="rowStyle">
        <Pip :checked="!!char.skillProf[s.key]"
             @click="update({ skillProf: { ...char.skillProf, [s.key]: !char.skillProf[s.key] } })" />
        <div :style="modCellStyle">{{ fmtMod(skillBonus(char, s.key)) }}</div>
        <Tooltip :tip="lookupTip(s.label)">
          <div :style="labelCellStyle">{{ s.label }}</div>
        </Tooltip>
        <div style="flex: 1" />
        <div :style="abilityTagStyle">{{ s.ability }}</div>
      </div>
    </div>
  </Frame>
</template>

<script setup>
import Frame from '../primitives/Frame.vue'
import SectionTitle from '../primitives/SectionTitle.vue'
import Pip from '../primitives/Pip.vue'
import Tooltip from '../primitives/Tooltip.vue'
import { C, FONT_DISPLAY, FONT_BODY, SKILLS, fmtMod, skillBonus } from '../../tokens.js'
import { lookupTip } from '../../tooltips.js'

defineProps({ char: Object, update: Function })

const rowStyle = { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', fontFamily: FONT_BODY }
const modCellStyle = { fontFamily: FONT_DISPLAY, fontWeight: 700, width: '28px', textAlign: 'center', color: C.ink, fontSize: '13px' }
const labelCellStyle = { color: C.inkSoft, cursor: 'help' }
const abilityTagStyle = { color: C.gold, fontSize: '8.5px', textTransform: 'uppercase', letterSpacing: '0.12em', fontFamily: FONT_DISPLAY, fontWeight: 600 }
</script>
