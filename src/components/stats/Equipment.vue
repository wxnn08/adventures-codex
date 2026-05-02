<template>
  <Frame>
    <SectionTitle>Equipment</SectionTitle>
    <div :style="coinsGrid">
      <div v-for="[k, lbl] in coins" :key="k" :style="coinBoxStyle">
        <AppInput :model-value="char[k]" @update:model-value="v => update({ [k]: v })" align="center" display
          :style-overrides="{ fontWeight: 700, borderBottom: 'none', fontSize: '14px' }" />
        <Label :style-overrides="{ fontSize: '8px', marginTop: 0 }">{{ lbl }}</Label>
      </div>
    </div>
    <AppInput multiline :rows="11" :model-value="char.equipment" @update:model-value="v => update({ equipment: v })"
      placeholder="Backpack, rations, rope, lantern…"
      :style-overrides="{ fontSize: '13px', padding: '6px', border: `1px dotted ${C.ruleSoft}` }" />
  </Frame>
</template>

<script setup>
import AppInput from '../primitives/AppInput.vue'
import Frame from '../primitives/Frame.vue'
import Label from '../primitives/Label.vue'
import SectionTitle from '../primitives/SectionTitle.vue'
import { C } from '../../tokens.js'

defineProps({ char: Object, update: Function })

const coins = [['cp', 'CP'], ['sp', 'SP'], ['ep', 'EP'], ['gp', 'GP'], ['pp', 'PP']]

const coinsGrid = { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px', marginBottom: '10px' }

const coinBoxStyle = {
  border: `1px solid ${C.ruleSoft}`,
  background: 'rgba(253,246,227,0.4)',
  padding: '4px 2px 2px',
  textAlign: 'center',
  borderRadius: '2px',
}
</script>
