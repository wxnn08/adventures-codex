<template>
  <div :style="grid">
    <div :style="shieldStyle">
      <AppInput :model-value="char.ac" @update:model-value="v => update({ ac: v })" align="center" display
        :style-overrides="{ fontSize: '28px', fontWeight: 700, borderBottom: 'none' }" />
      <Label>Armor Class</Label>
    </div>
    <Frame :style-overrides="{ textAlign: 'center', padding: '12px 8px' }">
      <div :style="bigNumStyle">
        <template v-if="initMod === null">
          <AppInput :model-value="char.initiative" @update:model-value="v => update({ initiative: v })" align="center" display
            :style-overrides="{ fontSize: '28px', fontWeight: 700, borderBottom: 'none' }" />
        </template>
        <template v-else>{{ fmtMod(initMod) }}</template>
      </div>
      <Label>Initiative</Label>
    </Frame>
    <Frame :style-overrides="{ textAlign: 'center', padding: '12px 8px' }">
      <AppInput :model-value="char.speed" @update:model-value="v => update({ speed: v })" align="center" display
        :style-overrides="{ fontSize: '28px', fontWeight: 700, borderBottom: 'none' }" />
      <Label>Speed</Label>
    </Frame>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import AppInput from '../primitives/AppInput.vue'
import Frame from '../primitives/Frame.vue'
import Label from '../primitives/Label.vue'
import { C, FONT_DISPLAY, abilityMod, fmtMod } from '../../tokens.js'

const props = defineProps({ char: Object, update: Function })

const grid = { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }

const initMod = computed(() => abilityMod(props.char.abilities.dex))

const shieldStyle = {
  background: `linear-gradient(180deg, ${C.paperHi} 0%, ${C.paperLo} 100%)`,
  border: `2px solid ${C.rule}`,
  clipPath: 'polygon(50% 0%, 100% 18%, 100% 70%, 50% 100%, 0% 70%, 0% 18%)',
  padding: '10px 8px 22px',
  textAlign: 'center',
  minHeight: '86px',
}

const bigNumStyle = { fontSize: '28px', fontFamily: FONT_DISPLAY, fontWeight: 700, color: C.ink, lineHeight: 1.1 }
</script>
