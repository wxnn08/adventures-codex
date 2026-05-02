<template>
  <Frame>
    <SectionTitle>Features &amp; Traits</SectionTitle>
    <AppInput multiline :rows="7" :model-value="char.features" @update:model-value="v => update({ features: v })"
      placeholder="Class features, racial traits, feats…"
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
