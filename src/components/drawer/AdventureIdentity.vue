<template>
  <div v-if="adventure" style="display: flex; flex-direction: column; gap: 10px;">
    <div v-for="[k, lbl] in fields" :key="k">
      <div :style="labelStyle">{{ lbl }}</div>
      <input
        :value="adventure[k] || ''"
        @change="e => updateMeta({ [k]: e.target.value })"
        :style="inputStyle"
        :placeholder="lbl"
      />
    </div>
    <div>
      <div :style="labelStyle">Notes</div>
      <textarea
        :value="adventure.notes || ''"
        @change="e => updateMeta({ notes: e.target.value })"
        :style="{ ...inputStyle, resize: 'vertical', height: '72px' }"
        placeholder="House rules, lore, reminders…"
      />
    </div>
  </div>
  <div v-else :style="emptyStyle">Loading…</div>
</template>

<script setup>
import { useCurrentAdventure } from '../../composables/useCurrentAdventure.js'
import { C, FONT_DISPLAY, FONT_BODY } from '../../tokens.js'

const { adventure, updateMeta } = useCurrentAdventure()

const fields = [
  ['name',      'Adventure Name'],
  ['dmName',    'Dungeon Master'],
  ['setting',   'Setting'],
  ['startDate', 'Start Date'],
]

const labelStyle = {
  fontFamily: FONT_DISPLAY,
  fontSize: '8px',
  letterSpacing: '0.22em',
  textTransform: 'uppercase',
  color: C.inkFaint,
  marginBottom: '2px',
}

const inputStyle = {
  width: '100%',
  background: 'rgba(253,246,227,0.6)',
  border: `1px solid ${C.ruleSoft}`,
  outline: 'none',
  fontFamily: FONT_BODY,
  fontSize: '13px',
  color: C.ink,
  padding: '4px 6px',
  boxSizing: 'border-box',
}

const emptyStyle = { color: C.inkFaint, fontSize: '12px', fontStyle: 'italic' }
</script>
