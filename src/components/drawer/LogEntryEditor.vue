<template>
  <div :style="wrapStyle">
    <div :style="rowStyle">
      <div style="flex: 1;">
        <div :style="lbl">Title <span :style="optStyle">(optional)</span></div>
        <input v-model="form.title" :style="inputStyle" placeholder="Session title" />
      </div>
    </div>
    <div :style="rowStyle">
      <div style="flex: 1;">
        <div :style="lbl">Session #</div>
        <input v-model="form.sessionNumber" :style="inputStyle" placeholder="e.g. 5" type="number" />
      </div>
      <div style="flex: 1;">
        <div :style="lbl">In-game date</div>
        <input v-model="form.sessionDate" :style="inputStyle" placeholder="e.g. 14 Mirtul" />
      </div>
    </div>
    <div>
      <div :style="lbl">Log</div>
      <textarea v-model="form.body" :style="textareaStyle" placeholder="What happened this session…" rows="5" />
    </div>
    <div v-if="entry" :style="timestampStyle">
      Created {{ formatDate(entry.createdAt) }}
      <span v-if="entry.updatedAt !== entry.createdAt"> · Updated {{ formatDate(entry.updatedAt) }}</span>
    </div>
    <div :style="actionsStyle">
      <button :style="saveBtnStyle" @click="save">{{ entry ? 'Save changes' : 'Add entry' }}</button>
      <button :style="cancelBtnStyle" @click="$emit('cancel')">Cancel</button>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { C, FONT_DISPLAY, FONT_BODY } from '../../tokens.js'

const props = defineProps({
  entry: { type: Object, default: null }, // null = new entry
})
const emit = defineEmits(['save', 'cancel'])

const form = reactive({
  title:         props.entry?.title         ?? '',
  sessionNumber: props.entry?.sessionNumber ?? '',
  sessionDate:   props.entry?.sessionDate   ?? '',
  body:          props.entry?.body          ?? '',
})

const save = () => emit('save', { ...form, sessionNumber: form.sessionNumber || null })

const formatDate = (iso) => {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

const wrapStyle = { display: 'flex', flexDirection: 'column', gap: '8px' }
const rowStyle  = { display: 'flex', gap: '8px' }
const lbl       = { fontFamily: FONT_DISPLAY, fontSize: '8px', letterSpacing: '0.2em', textTransform: 'uppercase', color: C.inkFaint, marginBottom: '2px' }
const optStyle  = { fontStyle: 'italic', textTransform: 'none', letterSpacing: 0 }

const inputStyle = {
  width: '100%', background: 'rgba(253,246,227,0.7)',
  border: `1px solid ${C.ruleSoft}`, outline: 'none',
  fontFamily: FONT_BODY, fontSize: '12px', color: C.ink, padding: '4px 6px',
  boxSizing: 'border-box',
}

const textareaStyle = {
  ...inputStyle, resize: 'vertical', lineHeight: 1.5,
}

const timestampStyle = { fontSize: '10px', color: C.inkFaint, fontStyle: 'italic' }

const actionsStyle  = { display: 'flex', gap: '8px' }

const saveBtnStyle = {
  background: C.rule, border: `1px solid ${C.rule}`,
  color: C.paperHi, padding: '5px 14px',
  fontFamily: FONT_DISPLAY, fontSize: '8.5px', letterSpacing: '0.2em',
  textTransform: 'uppercase', cursor: 'pointer', fontWeight: 600,
}

const cancelBtnStyle = {
  background: 'transparent', border: `1px solid ${C.ruleSoft}`,
  color: C.inkFaint, padding: '5px 14px',
  fontFamily: FONT_DISPLAY, fontSize: '8.5px', letterSpacing: '0.2em',
  textTransform: 'uppercase', cursor: 'pointer',
}
</script>
