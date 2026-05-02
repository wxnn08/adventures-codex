<template>
  <div :style="pipStyle" @click="$emit('click')" />
</template>

<script setup>
import { computed } from 'vue'
import { C } from '../../tokens.js'

const props = defineProps({
  checked: { type: Boolean, default: false },
})
defineEmits(['click'])

const pipStyle = computed(() => ({
  width: '13px',
  height: '13px',
  borderRadius: '50%',
  border: `1.5px solid ${C.rule}`,
  background: props.checked ? `radial-gradient(circle at 35% 30%, ${C.goldHi}, ${C.gold} 50%, ${C.rule})` : 'transparent',
  cursor: 'pointer',
  boxShadow: props.checked ? 'inset 0 0 2px rgba(0,0,0,0.3)' : 'none',
  flexShrink: 0,
}))
</script>
