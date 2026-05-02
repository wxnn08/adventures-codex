<template>
  <Frame>
    <SectionTitle>Saving Throws</SectionTitle>
    <div style="display: flex; flex-direction: column; gap: 5px;">
      <div v-for="a in ABILITIES" :key="a.key" :style="rowStyle">
        <Pip :checked="!!char.saveProf[a.key]"
             @click="update({ saveProf: { ...char.saveProf, [a.key]: !char.saveProf[a.key] } })" />
        <div :style="modCellStyle">{{ fmtMod(saveBonus(char, a.key)) }}</div>
        <Tooltip :tip="lookupTip(a.label)">
          <div :style="labelCellStyle">{{ a.label }}</div>
        </Tooltip>
      </div>
    </div>
  </Frame>
</template>

<script setup>
import Frame from '../primitives/Frame.vue'
import SectionTitle from '../primitives/SectionTitle.vue'
import Pip from '../primitives/Pip.vue'
import Tooltip from '../primitives/Tooltip.vue'
import { C, FONT_DISPLAY, FONT_BODY, ABILITIES, fmtMod, saveBonus } from '../../tokens.js'
import { lookupTip } from '../../tooltips.js'

defineProps({ char: Object, update: Function })

const rowStyle = { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontFamily: FONT_BODY }
const modCellStyle = { fontFamily: FONT_DISPLAY, fontWeight: 700, width: '30px', textAlign: 'center', color: C.ink, fontSize: '14px' }
const labelCellStyle = { color: C.inkSoft, cursor: 'help' }
</script>
