<template>
  <div>
    <button v-if="!showEditor" :style="addBtnStyle" @click="showEditor = true; editingEntry = null">
      + Add Entry
    </button>

    <LogEntryEditor
      v-if="showEditor"
      :entry="editingEntry"
      @save="onSave"
      @cancel="showEditor = false; editingEntry = null"
    />

    <div v-if="!showEditor">
      <div v-if="!sortedLog.length" :style="emptyStyle">No log entries yet.</div>
      <div v-for="entry in sortedLog" :key="entry.id" :style="entryStyle">
        <div :style="entryHeaderStyle">
          <div>
            <span v-if="entry.sessionNumber" :style="sessionBadgeStyle">Session {{ entry.sessionNumber }}</span>
            <span v-if="entry.sessionDate" :style="dateBadgeStyle">{{ entry.sessionDate }}</span>
          </div>
          <div :style="entryActionsStyle">
            <button :style="iconBtnStyle" @click="startEdit(entry)" title="Edit">✎</button>
            <button :style="{ ...iconBtnStyle, color: C.red }" @click="del(entry.id)" title="Delete">✕</button>
          </div>
        </div>
        <div v-if="entry.title" :style="entryTitleStyle">{{ entry.title }}</div>
        <div :style="entryBodyStyle">{{ entry.body }}</div>
        <div :style="entryTimestampStyle">
          {{ formatDate(entry.createdAt) }}
          <span v-if="entry.updatedAt !== entry.createdAt"> · edited {{ formatDate(entry.updatedAt) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import LogEntryEditor from './LogEntryEditor.vue'
import { useCurrentAdventure } from '../../composables/useCurrentAdventure.js'
import { C, FONT_DISPLAY, FONT_BODY } from '../../tokens.js'

const { adventure, appendLogEntry, updateLogEntry, deleteLogEntry } = useCurrentAdventure()

const showEditor   = ref(false)
const editingEntry = ref(null)

const sortedLog = computed(() =>
  [...(adventure.value?.log || [])].sort((a, b) =>
    new Date(b.createdAt) - new Date(a.createdAt)
  )
)

const onSave = async (form) => {
  if (editingEntry.value) {
    await updateLogEntry(editingEntry.value.id, form)
  } else {
    await appendLogEntry(form)
  }
  showEditor.value = false
  editingEntry.value = null
}

const startEdit = (entry) => {
  editingEntry.value = entry
  showEditor.value = true
}

const del = async (id) => {
  if (confirm('Delete this log entry?')) await deleteLogEntry(id)
}

const formatDate = (iso) => {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

const addBtnStyle = {
  display: 'block', width: '100%', textAlign: 'center',
  background: 'transparent', border: `1px dashed ${C.rule}`,
  color: C.inkFaint, padding: '6px',
  fontFamily: FONT_DISPLAY, fontSize: '8.5px', letterSpacing: '0.2em',
  textTransform: 'uppercase', cursor: 'pointer', marginBottom: '10px',
}

const emptyStyle = { color: C.inkFaint, fontSize: '12px', fontStyle: 'italic' }

const entryStyle = {
  borderBottom: `1px solid ${C.ruleSoft}`,
  padding: '8px 0',
}

const entryHeaderStyle = {
  display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '4px',
}

const sessionBadgeStyle = {
  fontFamily: FONT_DISPLAY, fontSize: '8px', letterSpacing: '0.2em',
  textTransform: 'uppercase', color: C.gold, marginRight: '6px',
}

const dateBadgeStyle = {
  fontFamily: FONT_BODY, fontSize: '10px', color: C.inkFaint, fontStyle: 'italic',
}

const entryActionsStyle = { display: 'flex', gap: '4px' }

const iconBtnStyle = {
  background: 'transparent', border: 'none', cursor: 'pointer',
  color: C.inkFaint, fontSize: '12px', padding: '0 3px',
}

const entryTitleStyle = {
  fontFamily: FONT_DISPLAY, fontSize: '10px', fontWeight: 600,
  letterSpacing: '0.12em', color: C.ink, marginBottom: '4px',
}

const entryBodyStyle = {
  fontFamily: FONT_BODY, fontSize: '12px', color: C.inkSoft,
  lineHeight: 1.5, whiteSpace: 'pre-wrap', wordBreak: 'break-word',
}

const entryTimestampStyle = {
  fontSize: '10px', color: C.inkFaint, marginTop: '4px', fontStyle: 'italic',
}
</script>
