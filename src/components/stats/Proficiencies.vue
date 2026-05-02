<template>
  <Frame>
    <SectionTitle>Other Proficiencies &amp; Languages</SectionTitle>
    <AppInput multiline :rows="16" :model-value="char.proficiencies" @update:model-value="v => update({ proficiencies: v })"
      placeholder="Armor, weapons, tools, languages…"
      :style-overrides="{ fontSize: '13px', padding: '6px', border: `1px dotted ${C.ruleSoft}` }" />
  </Frame>
</template>

<script setup>
import AppInput from '../primitives/AppInput.vue'
import Frame from '../primitives/Frame.vue'
import SectionTitle from '../primitives/SectionTitle.vue'
import { C } from '../../tokens.js'

defineProps({ char: Object, update: Function })
</script>
