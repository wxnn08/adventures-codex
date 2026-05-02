<template>
  <div style="display: flex; flex-direction: column; gap: 14px;">
    <Frame>
      <SectionTitle>Spellcasting</SectionTitle>
      <div :style="topGrid">
        <div>
          <AppInput :model-value="char.spellcastingClass" @update:model-value="v => update({ spellcastingClass: v })" align="center" display
            :style-overrides="{ fontSize: '18px', fontWeight: 700 }" />
          <Label>Spellcasting Class</Label>
        </div>
        <div>
          <AppInput :model-value="char.spellAbility" @update:model-value="v => update({ spellAbility: v })" align="center" display
            :style-overrides="{ fontSize: '18px', fontWeight: 700 }" />
          <Label>Spellcasting Ability</Label>
        </div>
        <div>
          <AppInput :model-value="char.spellSaveDC" @update:model-value="v => update({ spellSaveDC: v })" align="center" display
            :style-overrides="{ fontSize: '22px', fontWeight: 700 }" />
          <Label>Spell Save DC</Label>
        </div>
        <div>
          <AppInput :model-value="char.spellAttackBonus" @update:model-value="v => update({ spellAttackBonus: v })" align="center" display
            :style-overrides="{ fontSize: '22px', fontWeight: 700 }" />
          <Label>Spell Attack Bonus</Label>
        </div>
      </div>
    </Frame>

    <div :style="row2">
      <Frame>
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
          <div :style="badgeStyle">0</div>
          <div :style="cantripsLabelStyle">Cantrips</div>
        </div>
        <AppInput v-for="(c, i) in char.cantrips" :key="i"
          :model-value="c"
          @update:model-value="v => setCantrip(i, v)"
          placeholder="—"
          :style-overrides="{ marginBottom: '3px', fontSize: '13px', fontFamily: FONT_BODY }" />
      </Frame>
      <SpellLevel :level="1" :count="13" :char="char" :update="update" />
    </div>
    <div :style="row2">
      <SpellLevel :level="2" :count="13" :char="char" :update="update" />
      <SpellLevel :level="3" :count="13" :char="char" :update="update" />
    </div>
    <div :style="row2">
      <SpellLevel :level="4" :count="13" :char="char" :update="update" />
      <SpellLevel :level="5" :count="11" :char="char" :update="update" />
    </div>
    <div :style="row3">
      <SpellLevel :level="6" :count="9" :char="char" :update="update" />
      <SpellLevel :level="7" :count="9" :char="char" :update="update" />
      <SpellLevel :level="8" :count="7" :char="char" :update="update" />
    </div>
    <div :style="row2">
      <SpellLevel :level="9" :count="7" :char="char" :update="update" />
      <div />
    </div>
  </div>
</template>

<script setup>
import AppInput from './primitives/AppInput.vue'
import Frame from './primitives/Frame.vue'
import Label from './primitives/Label.vue'
import SectionTitle from './primitives/SectionTitle.vue'
import SpellLevel from './SpellLevel.vue'
import { C, FONT_DISPLAY, FONT_BODY } from '../tokens.js'

const props = defineProps({ char: Object, update: Function })

const setCantrip = (i, v) => {
  const arr = [...props.char.cantrips]
  arr[i] = v
  props.update({ cantrips: arr })
}

const topGrid = { display: 'grid', gridTemplateColumns: '2fr 1.2fr 1fr 1fr', gap: '16px' }
const row2 = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }
const row3 = { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }

const badgeStyle = {
  width: '30px', height: '30px', borderRadius: '50%',
  border: `1.5px solid ${C.rule}`,
  background: `linear-gradient(180deg, ${C.paperHi}, ${C.paperLo})`,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: '14px', color: C.ink,
}

const cantripsLabelStyle = {
  flex: 1, fontFamily: FONT_DISPLAY, fontSize: '11px',
  letterSpacing: '0.22em', color: C.inkFaint, textTransform: 'uppercase', fontWeight: 600,
}
</script>
