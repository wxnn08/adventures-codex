<template>
  <div :style="frameStyle">
    <CornerOrnaments v-if="ornate" />
    <slot />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import CornerOrnaments from './CornerOrnaments.vue'
import { C } from '../../tokens.js'

const props = defineProps({
  padding: { type: [Number, String], default: 12 },
  ornate: { type: Boolean, default: false },
  styleOverrides: { type: Object, default: () => ({}) },
})

const frameStyle = computed(() => ({
  border: `1px solid ${C.rule}`,
  boxShadow: `inset 0 0 0 3px ${C.paperHi}, inset 0 0 0 4px ${C.rule}, inset 0 0 30px rgba(139,90,43,0.05)`,
  background: 'rgba(253,246,227,0.55)',
  padding: typeof props.padding === 'number' ? props.padding + 'px' : props.padding,
  position: 'relative',
  ...props.styleOverrides,
}))
</script>
