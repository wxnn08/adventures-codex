<template>
  <div>
    <div v-if="error" :style="errorStyle">{{ error }}</div>

    <div v-if="!maps.length" :style="emptyStyle">No maps uploaded yet.</div>

    <div v-for="m in maps" :key="m.id" :style="mapRowStyle">
      <img :src="m.dataUrl" :alt="m.label" :style="thumbStyle" @click="viewMap(m)" />
      <div style="flex: 1; min-width: 0;">
        <input
          :value="m.label"
          @change="e => renameMapImage(m.id, e.target.value)"
          :style="labelInputStyle"
        />
        <div :style="metaStyle">{{ formatBytes(m.bytes) }}</div>
      </div>
      <button :style="deleteBtnStyle" @click="removeMapImage(m.id)" title="Delete">✕</button>
    </div>

    <label :style="uploadBtnStyle">
      <input type="file" accept="image/*" style="display: none" @change="onUpload" :disabled="uploading" />
      {{ uploading ? 'Uploading…' : '+ Upload Map' }}
    </label>

    <MapViewer v-if="viewing" :map="viewing" @close="viewing = null" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import MapViewer from './MapViewer.vue'
import { useCurrentAdventure } from '../../composables/useCurrentAdventure.js'
import { downscaleImage } from '../../utils/imageDownscale.js'
import { C, FONT_DISPLAY, FONT_BODY } from '../../tokens.js'

const { adventure, addMapImage, removeMapImage, renameMapImage } = useCurrentAdventure()
const maps = computed(() => adventure.value?.mapGallery || [])

const uploading = ref(false)
const error     = ref(null)
const viewing   = ref(null)

const onUpload = async (e) => {
  const file = e.target.files?.[0]
  if (!file) return
  e.target.value = ''
  error.value = null
  uploading.value = true
  try {
    const img = await downscaleImage(file)
    const result = await addMapImage({ label: file.name.replace(/\.[^.]+$/, ''), ...img })
    if (result && result.error) error.value = result.error
  } catch (err) {
    error.value = err?.error || 'Upload failed.'
  } finally {
    uploading.value = false
  }
}

const viewMap = (m) => { viewing.value = m }
const formatBytes = (b) => b ? `${(b / 1024).toFixed(0)} KB` : ''

const mapRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '6px 0',
  borderBottom: `1px solid ${C.ruleSoft}`,
}

const thumbStyle = {
  width: '48px',
  height: '36px',
  objectFit: 'cover',
  border: `1px solid ${C.ruleSoft}`,
  cursor: 'pointer',
  flexShrink: 0,
}

const labelInputStyle = {
  width: '100%',
  background: 'transparent',
  border: 'none',
  borderBottom: `1px dotted ${C.ruleSoft}`,
  outline: 'none',
  fontFamily: FONT_BODY,
  fontSize: '12px',
  color: C.ink,
  padding: '1px 0',
}

const metaStyle = { fontSize: '10px', color: C.inkFaint, marginTop: '2px' }

const deleteBtnStyle = {
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  color: C.inkFaint,
  fontSize: '11px',
  padding: '2px 4px',
  flexShrink: 0,
}

const uploadBtnStyle = {
  display: 'block',
  marginTop: '10px',
  textAlign: 'center',
  background: 'transparent',
  border: `1px dashed ${C.rule}`,
  color: C.inkFaint,
  padding: '6px',
  fontFamily: FONT_DISPLAY,
  fontSize: '8.5px',
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  cursor: 'pointer',
}

const emptyStyle = { color: C.inkFaint, fontSize: '12px', fontStyle: 'italic', marginBottom: '8px' }
const errorStyle = {
  color: C.red,
  fontSize: '11px',
  fontFamily: FONT_BODY,
  marginBottom: '8px',
  padding: '6px 8px',
  border: `1px solid ${C.red}`,
  background: 'rgba(139,26,26,0.06)',
}
</script>
