<template>
  <div :style="grid">
    <div @click="update({ inspiration: !char.inspiration })" :style="inspirationStyle">
      <div :style="iconStyle">{{ char.inspiration ? '✦' : '○' }}</div>
      <Label :style-overrides="{ color: 'inherit', marginTop: '4px' }">Inspiration</Label>
    </div>
    <div :style="profBoxStyle">
      <AppInput
        :model-value="char.profBonus"
        @update:model-value="v => update({ profBonus: v })"
        align="center"
        display
        :style-overrides="{ fontSize: '22px', borderBottom: 'none', fontWeight: 700, color: C.ink }"
      />
      <Label>Proficiency Bonus</Label>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import AppInput from '../primitives/AppInput.vue'
import Label from '../primitives/Label.vue'
import { C } from '../../tokens.js'

const props = defineProps({ char: Object, update: Function })

const grid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }

const inspirationStyle = computed(() => ({
  cursor: 'pointer',
  background: props.char.inspiration
    ? `radial-gradient(circle at 30% 30%, ${C.goldHi}, ${C.gold} 60%, ${C.rule})`
    : 'rgba(253,246,227,0.5)',
  border: `1.5px solid ${props.char.inspiration ? C.goldHi : C.rule}`,
  borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
  padding: '10px 8px 8px',
  textAlign: 'center',
  color: props.char.inspiration ? C.paperHi : C.inkFaint,
  transition: 'all 0.2s',
  boxShadow: props.char.inspiration ? '0 0 12px rgba(212,160,23,0.4)' : 'none',
}))

const iconStyle = computed(() => ({
  fontSize: '24px',
  lineHeight: 1,
  textShadow: props.char.inspiration ? '0 0 8px rgba(255,250,200,0.6)' : 'none',
}))

const profBoxStyle = {
  background: 'rgba(253,246,227,0.5)',
  border: `1.5px solid ${C.rule}`,
  borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
  padding: '6px 8px 8px',
  textAlign: 'center',
}
</script>
