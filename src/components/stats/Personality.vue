<template>
  <div :style="grid">
    <Frame v-for="[k, lbl] in fields" :key="k">
      <SectionTitle>{{ lbl }}</SectionTitle>
      <AppInput multiline :rows="3" :model-value="char[k]" @update:model-value="v => update({ [k]: v })"
        :style-overrides="{ fontSize: '13px', padding: '6px', border: `1px dotted ${C.ruleSoft}` }" />
    </Frame>
  </div>
</template>

<script setup>
import AppInput from '../primitives/AppInput.vue'
import Frame from '../primitives/Frame.vue'
import SectionTitle from '../primitives/SectionTitle.vue'
import { C } from '../../tokens.js'

defineProps({ char: Object, update: Function })

const fields = [
  ['personality', 'Personality Traits'],
  ['ideals',      'Ideals'],
  ['bonds',       'Bonds'],
  ['flaws',       'Flaws'],
]

const grid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }
</script>
