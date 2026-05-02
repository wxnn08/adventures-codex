<template>
  <Frame :style-overrides="{ textAlign: 'center', padding: '10px 12px' }">
    <div :style="numStyle">{{ passivePerception(char) }}</div>
    <Label>Passive Wisdom (Perception)</Label>
  </Frame>
</template>

<script setup>
import Frame from '../primitives/Frame.vue'
import Label from '../primitives/Label.vue'
import { C, FONT_DISPLAY, passivePerception } from '../../tokens.js'

defineProps({ char: Object })

const numStyle = { fontFamily: FONT_DISPLAY, fontSize: '28px', fontWeight: 700, color: C.ink, lineHeight: 1.1 }
</script>
