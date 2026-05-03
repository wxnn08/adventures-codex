<template>
  <div :style="wrapStyle" class="tabs-wrap">
    <button v-for="t in tabs" :key="t.id" @click="$emit('update:tab', t.id)" :style="btnStyle(t)">
      <span :style="{ marginRight: '8px', color: tab === t.id ? C.goldHi : C.gold }">{{ t.glyph }}</span>
      {{ t.label }}
    </button>
  </div>
</template>

<script setup>
import { C, FONT_DISPLAY } from '../tokens.js'

const props = defineProps({ tab: String })
defineEmits(['update:tab'])

const tabs = [
  { id: 'stats',  label: 'Character', glyph: '⚔' },
  { id: 'bio',    label: 'Backstory', glyph: '✦' },
  { id: 'spells', label: 'Spellbook', glyph: '✦' },
]

const wrapStyle = {
  display: 'flex',
  gap: 0,
  marginBottom: '18px',
  borderBottom: `2px solid ${C.rule}`,
  justifyContent: 'center',
  flexWrap: 'wrap',
}

const btnStyle = (t) => {
  const active = props.tab === t.id
  return {
    background: active ? `linear-gradient(180deg, ${C.rule}, ${C.inkFaint})` : 'rgba(253,246,227,0.4)',
    color: active ? C.paperHi : C.inkFaint,
    border: `1px solid ${C.rule}`,
    borderBottom: 'none',
    borderRadius: '8px 8px 0 0',
    padding: '10px 28px',
    fontFamily: FONT_DISPLAY,
    fontSize: '12px',
    letterSpacing: '0.28em',
    textTransform: 'uppercase',
    fontWeight: 600,
    cursor: 'pointer',
    marginBottom: '-2px',
    marginRight: '4px',
    boxShadow: active ? `inset 0 -3px 0 ${C.goldHi}, 0 -2px 4px rgba(0,0,0,0.05)` : 'none',
    transition: 'all 0.15s',
  }
}
</script>

<style>
@media (max-width: 700px) {
  .tabs-wrap {
    justify-content: stretch;
    gap: 6px;
  }

  .tabs-wrap button {
    flex: 1 1 calc(50% - 6px);
    margin-right: 0 !important;
    padding: 10px 14px !important;
    letter-spacing: 0.18em !important;
  }
}

@media (max-width: 420px) {
  .tabs-wrap button {
    flex-basis: 100%;
  }
}
</style>
