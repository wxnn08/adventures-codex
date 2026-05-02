<template>
  <component
    :is="multiline ? 'textarea' : 'input'"
    :value="modelValue || ''"
    :placeholder="placeholder || ''"
    :rows="multiline ? rows : undefined"
    :style="computedStyle"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>

<script setup>
import { computed } from 'vue'
import { C, FONT_DISPLAY, FONT_BODY } from '../../tokens.js'

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  placeholder: { type: String, default: '' },
  multiline: { type: Boolean, default: false },
  rows: { type: Number, default: 1 },
  align: { type: String, default: 'left' },
  display: { type: Boolean, default: false },
  styleOverrides: { type: Object, default: () => ({}) },
})

defineEmits(['update:modelValue'])

const computedStyle = computed(() => ({
  background: 'transparent',
  border: 'none',
  borderBottom: props.multiline ? 'none' : `1px dotted ${C.ruleSoft}`,
  outline: 'none',
  font: 'inherit',
  color: C.ink,
  width: '100%',
  padding: '2px 4px',
  textAlign: props.align,
  resize: props.multiline ? 'vertical' : 'none',
  fontFamily: props.display ? FONT_DISPLAY : (props.multiline ? FONT_BODY : 'inherit'),
  lineHeight: props.multiline ? 1.5 : 1.3,
  ...props.styleOverrides,
}))
</script>
