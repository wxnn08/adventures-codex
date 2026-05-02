<template>
  <Frame>
    <SectionTitle>Attacks &amp; Spellcasting</SectionTitle>
    <div :style="headerGrid">
      <Label align="left" :style-overrides="{ margin: 0 }">Name</Label>
      <Label :style-overrides="{ margin: 0 }">Atk Bonus</Label>
      <Label align="left" :style-overrides="{ margin: 0 }">Damage / Type</Label>
    </div>
    <div v-for="(atk, i) in char.attacks" :key="i" :style="rowGrid">
      <AppInput :model-value="atk.name" @update:model-value="v => setAttack(i, { name: v })"
        :style-overrides="{ fontFamily: FONT_BODY, fontSize: '13px' }" />
      <AppInput align="center" :model-value="atk.bonus" @update:model-value="v => setAttack(i, { bonus: v })" display
        :style-overrides="{ fontWeight: 700 }" />
      <AppInput :model-value="atk.damage" @update:model-value="v => setAttack(i, { damage: v })"
        :style-overrides="{ fontFamily: FONT_BODY, fontSize: '13px' }" />
    </div>
    <button @click="addAttack" :style="addBtnStyle">+ Add Attack</button>
    <AppInput multiline :rows="3" :model-value="char.attackNotes" @update:model-value="v => update({ attackNotes: v })"
      placeholder="Spell attacks, ammunition, special properties…"
      :style-overrides="{ marginTop: '8px', fontSize: '13px', padding: '6px', border: `1px dotted ${C.ruleSoft}` }" />
  </Frame>
</template>

<script setup>
import AppInput from '../primitives/AppInput.vue'
import Frame from '../primitives/Frame.vue'
import Label from '../primitives/Label.vue'
import SectionTitle from '../primitives/SectionTitle.vue'
import { C, FONT_DISPLAY, FONT_BODY } from '../../tokens.js'

const props = defineProps({ char: Object, update: Function })

const setAttack = (i, patch) => {
  const a = [...props.char.attacks]
  a[i] = { ...a[i], ...patch }
  props.update({ attacks: a })
}
const addAttack = () => props.update({ attacks: [...props.char.attacks, { name: '', bonus: '', damage: '' }] })

const headerGrid = { display: 'grid', gridTemplateColumns: '2.5fr 1fr 2.5fr', gap: '10px', marginBottom: '6px' }
const rowGrid    = { display: 'grid', gridTemplateColumns: '2.5fr 1fr 2.5fr', gap: '10px', marginBottom: '5px' }

const addBtnStyle = {
  marginTop: '6px',
  background: 'transparent',
  border: `1px dashed ${C.rule}`,
  color: C.inkFaint,
  padding: '3px 10px',
  fontFamily: FONT_DISPLAY,
  fontSize: '9px',
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  cursor: 'pointer',
}
</script>
