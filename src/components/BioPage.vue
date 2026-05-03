<template>
  <div :style="pageGrid" class="bio-page-grid">
    <div class="bio-col">
      <Frame>
        <SectionTitle>Character Appearance</SectionTitle>
        <div :style="appearanceGrid" class="appearance-grid">
          <div v-for="[k, lbl] in appearanceFields" :key="k">
            <AppInput :model-value="char[k]" @update:model-value="v => update({ [k]: v })" align="center" display
              :style-overrides="{ fontWeight: 600, fontSize: '14px' }" />
            <Label :style-overrides="{ fontSize: '8.5px' }">{{ lbl }}</Label>
          </div>
        </div>
        <AppInput multiline :rows="7" :model-value="char.appearance" @update:model-value="v => update({ appearance: v })"
          placeholder="Distinguishing features, scars, mannerisms…"
          :style-overrides="{ fontSize: '13px', padding: '6px', border: `1px dotted ${C.ruleSoft}` }" />
      </Frame>
      <Frame>
        <SectionTitle>Allies &amp; Organizations</SectionTitle>
        <div style="display: flex; align-items: baseline; gap: 8px; margin-bottom: 6px;">
          <Label align="left" :style-overrides="{ margin: 0 }">Faction</Label>
          <AppInput :model-value="char.factionName" @update:model-value="v => update({ factionName: v })"
            display :style-overrides="{ fontWeight: 700, fontSize: '14px' }" />
        </div>
        <AppInput multiline :rows="6" :model-value="char.allies" @update:model-value="v => update({ allies: v })"
          :style-overrides="{ fontSize: '13px', padding: '6px', border: `1px dotted ${C.ruleSoft}` }" />
      </Frame>
      <Frame>
        <SectionTitle>Additional Features &amp; Traits</SectionTitle>
        <AppInput multiline :rows="6" :model-value="char.additionalFeatures" @update:model-value="v => update({ additionalFeatures: v })"
          :style-overrides="{ fontSize: '13px', padding: '6px', border: `1px dotted ${C.ruleSoft}` }" />
      </Frame>
    </div>
    <div class="bio-col">
      <Frame :style-overrides="{ flex: 1, minHeight: '420px' }" class="backstory-frame">
        <SectionTitle>Character Backstory</SectionTitle>
        <AppInput multiline :rows="22" :model-value="char.backstory" @update:model-value="v => update({ backstory: v })"
          placeholder="The tale of how you came to adventure…"
          :style-overrides="{ fontSize: '14px', padding: '8px', border: `1px dotted ${C.ruleSoft}`, lineHeight: 1.6 }" />
      </Frame>
      <Frame>
        <SectionTitle>Treasure</SectionTitle>
        <AppInput multiline :rows="6" :model-value="char.treasure" @update:model-value="v => update({ treasure: v })"
          placeholder="Gems, art, magic items…"
          :style-overrides="{ fontSize: '13px', padding: '6px', border: `1px dotted ${C.ruleSoft}` }" />
      </Frame>
    </div>
  </div>
</template>

<script setup>
import AppInput from './primitives/AppInput.vue'
import Frame from './primitives/Frame.vue'
import Label from './primitives/Label.vue'
import SectionTitle from './primitives/SectionTitle.vue'
import { C } from '../tokens.js'

defineProps({ char: Object, update: Function })

const appearanceFields = [
  ['age', 'Age'], ['height', 'Height'], ['weight', 'Weight'],
  ['eyes', 'Eyes'], ['skin', 'Skin'], ['hair', 'Hair'],
]

const pageGrid = { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '16px' }
const appearanceGrid = { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '12px' }
</script>

<style>
.bio-col {
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-width: 0;
}

@media (max-width: 900px) {
  .bio-page-grid {
    grid-template-columns: 1fr !important;
  }

  .appearance-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
  }

  .backstory-frame {
    min-height: 320px !important;
  }
}

@media (max-width: 560px) {
  .appearance-grid {
    grid-template-columns: 1fr !important;
  }
}
</style>
