<template>
  <svg v-for="(c, i) in corners" :key="i" width="18" height="18" viewBox="0 0 24 24" :style="c.style">
    <path d="M2 2 Q 2 14, 14 14 M2 2 Q 14 2, 14 14 M14 14 L 18 18"
      :stroke="C.rule" stroke-width="0.9" fill="none" stroke-linecap="round" />
    <circle cx="14" cy="14" r="1.4" :fill="C.gold" />
  </svg>
</template>

<script setup>
import { C } from '../../tokens.js'

const corners = [
  { style: { position: 'absolute', top: '6px', left: '6px',     transform: 'rotate(0deg)',   opacity: 0.7 } },
  { style: { position: 'absolute', top: '6px', right: '6px',    transform: 'rotate(90deg)',  opacity: 0.7 } },
  { style: { position: 'absolute', bottom: '6px', left: '6px',  transform: 'rotate(270deg)', opacity: 0.7 } },
  { style: { position: 'absolute', bottom: '6px', right: '6px', transform: 'rotate(180deg)', opacity: 0.7 } },
]
</script>
