<template>
  <Frame>
    <div :style="grid">
      <!-- HP column -->
      <div>
        <div style="display: flex; align-items: baseline; gap: 6px; margin-bottom: 6px;">
          <Label align="left" :style-overrides="{ margin: 0 }">Hit Point Maximum</Label>
          <AppInput :model-value="char.hpMax" @update:model-value="v => update({ hpMax: v })" align="right" display
            :style-overrides="{ width: '60px', fontWeight: 700 }" />
        </div>
        <div :style="hpBoxStyle">
          <div :style="{
            position: 'absolute', inset: 0,
            background: `linear-gradient(90deg, rgba(139,26,26,0.18) ${pct}%, transparent ${pct}%)`
          }" />
          <div style="position: relative;">
            <AppInput :model-value="char.hpCurrent" @update:model-value="v => update({ hpCurrent: v })" align="center" display
              :style-overrides="{ fontSize: '28px', fontWeight: 700, borderBottom: 'none' }" />
            <Label>Current Hit Points</Label>
          </div>
        </div>
        <div :style="tempBoxStyle">
          <AppInput :model-value="char.hpTemp" @update:model-value="v => update({ hpTemp: v })" align="center" display
            :style-overrides="{ fontSize: '16px', fontWeight: 700, borderBottom: 'none' }" />
          <Label>Temporary Hit Points</Label>
        </div>
      </div>
      <!-- Hit dice + death saves column -->
      <div>
        <div :style="hdBoxStyle">
          <div style="display: flex; justify-content: space-between; align-items: baseline;">
            <Label align="left" :style-overrides="{ margin: 0 }">Total</Label>
            <AppInput :model-value="char.hitDiceTotal" @update:model-value="v => update({ hitDiceTotal: v })" align="right" display
              :style-overrides="{ width: '80px', fontWeight: 700 }" />
          </div>
          <AppInput :model-value="char.hitDice" @update:model-value="v => update({ hitDice: v })" align="center" display
            placeholder="e.g. 3d8"
            :style-overrides="{ fontSize: '18px', fontWeight: 700, borderBottom: 'none', marginTop: '4px' }" />
          <Label>Hit Dice</Label>
        </div>
        <div :style="dsBoxStyle">
          <Label :style-overrides="{ margin: '0 0 8px' }">Death Saves</Label>
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
            <div :style="successLblStyle">Successes</div>
            <div style="display: flex; gap: 5px;">
              <div v-for="(v, i) in char.deathSaves.successes" :key="'s'+i"
                @click="toggle('successes', i)"
                :style="{
                  width: '14px', height: '14px', borderRadius: '50%',
                  border: `1.5px solid ${C.green}`,
                  background: v ? C.green : 'transparent',
                  cursor: 'pointer',
                  boxShadow: v ? 'inset 0 0 2px rgba(0,0,0,0.3)' : 'none',
                }" />
            </div>
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div :style="failLblStyle">Failures</div>
            <div style="display: flex; gap: 5px;">
              <div v-for="(v, i) in char.deathSaves.failures" :key="'f'+i"
                @click="toggle('failures', i)"
                :style="{
                  width: '14px', height: '14px', borderRadius: '50%',
                  border: `1.5px solid ${C.red}`,
                  background: v ? C.red : 'transparent',
                  cursor: 'pointer',
                  boxShadow: v ? 'inset 0 0 2px rgba(0,0,0,0.3)' : 'none',
                }" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </Frame>
</template>

<script setup>
import { computed } from 'vue'
import AppInput from '../primitives/AppInput.vue'
import Frame from '../primitives/Frame.vue'
import Label from '../primitives/Label.vue'
import { C, FONT_DISPLAY } from '../../tokens.js'

const props = defineProps({ char: Object, update: Function })

const toggle = (kind, idx) => {
  const arr = [...props.char.deathSaves[kind]]
  arr[idx] = !arr[idx]
  props.update({ deathSaves: { ...props.char.deathSaves, [kind]: arr } })
}

const pct = computed(() => {
  const max = parseInt(props.char.hpMax) || 0
  const cur = parseInt(props.char.hpCurrent) || 0
  if (max <= 0) return 0
  return Math.min(100, Math.max(0, (cur / max) * 100))
})

const grid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }

const hpBoxStyle = {
  border: `1px solid ${C.rule}`,
  background: 'rgba(253,246,227,0.6)',
  padding: '10px 10px 8px',
  textAlign: 'center',
  marginBottom: '8px',
  position: 'relative',
  overflow: 'hidden',
}

const tempBoxStyle = {
  border: `1px dashed ${C.rule}`,
  background: 'rgba(253,246,227,0.3)',
  padding: '6px 10px',
  textAlign: 'center',
}

const hdBoxStyle = {
  border: `1px solid ${C.rule}`,
  padding: '8px 10px',
  background: 'rgba(253,246,227,0.6)',
  marginBottom: '8px',
}

const dsBoxStyle = {
  border: `1px solid ${C.rule}`,
  padding: '8px 10px',
  background: 'rgba(253,246,227,0.6)',
}

const successLblStyle = { fontSize: '9.5px', color: C.green, fontFamily: FONT_DISPLAY, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 600 }
const failLblStyle    = { fontSize: '9.5px', color: C.red,   fontFamily: FONT_DISPLAY, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 600 }
</script>
