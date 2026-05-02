<template>
  <Frame>
    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
      <div :style="badgeStyle">{{ level }}</div>
      <div :style="lblStyle">Spell Level</div>
      <div style="display: flex; align-items: center; gap: 4px;">
        <Label :style-overrides="{ margin: 0, fontSize: '8px' }">Total</Label>
        <AppInput
          :model-value="slots.total"
          @update:model-value="v => update({ spellSlots: { ...char.spellSlots, [level]: { ...slots, total: v } } })"
          align="center" display
          :style-overrides="{ width: '30px', fontWeight: 700, fontSize: '14px' }" />
      </div>
    </div>
    <div v-if="totalNum > 0" style="display: flex; gap: 5px; margin-bottom: 10px; flex-wrap: wrap;">
      <div v-for="(_, i) in totalNum" :key="i"
        @click="togglePip(i)"
        :title="i < slots.expended ? 'Expended (click to restore)' : 'Available (click to expend)'"
        :style="{
          width: '14px', height: '14px', borderRadius: '50%',
          border: `1.5px solid ${C.rule}`,
          background: i < slots.expended
            ? `radial-gradient(circle at 30% 30%, ${C.goldHi}, ${C.gold} 60%, ${C.rule})`
            : 'transparent',
          cursor: 'pointer',
          boxShadow: i < slots.expended ? 'inset 0 0 2px rgba(0,0,0,0.3)' : 'none',
        }" />
    </div>
    <div style="display: flex; flex-direction: column; gap: 3px;">
      <div v-for="(sp, i) in spells" :key="i" style="display: flex; align-items: center; gap: 6px;">
        <Pip :checked="!!sp.prepared" @click="togglePrepared(i)" />
        <AppInput :model-value="sp.name" @update:model-value="v => setName(i, v)"
          placeholder="—"
          :style-overrides="{ fontSize: '12.5px', fontFamily: FONT_BODY }" />
      </div>
    </div>
  </Frame>
</template>

<script setup>
import { computed } from 'vue'
import AppInput from './primitives/AppInput.vue'
import Frame from './primitives/Frame.vue'
import Label from './primitives/Label.vue'
import Pip from './primitives/Pip.vue'
import { C, FONT_DISPLAY, FONT_BODY } from '../tokens.js'

const props = defineProps({
  level: Number,
  count: Number,
  char: Object,
  update: Function,
})

const slots = computed(() => props.char.spellSlots[props.level] || { total: '', expended: 0 })
const totalNum = computed(() => Math.max(parseInt(slots.value.total) || 0, 0))
const spells = computed(() => (props.char.spells[props.level] || []).slice(0, props.count))

const togglePip = (i) => {
  const exp = slots.value.expended === i + 1 ? i : i + 1
  props.update({ spellSlots: { ...props.char.spellSlots, [props.level]: { ...slots.value, expended: exp } } })
}

const togglePrepared = (i) => {
  const arr = [...props.char.spells[props.level]]
  arr[i] = { ...arr[i], prepared: !arr[i].prepared }
  props.update({ spells: { ...props.char.spells, [props.level]: arr } })
}

const setName = (i, v) => {
  const arr = [...props.char.spells[props.level]]
  arr[i] = { ...arr[i], name: v }
  props.update({ spells: { ...props.char.spells, [props.level]: arr } })
}

const badgeStyle = {
  width: '30px', height: '30px', borderRadius: '50%',
  border: `1.5px solid ${C.rule}`,
  background: `linear-gradient(180deg, ${C.paperHi}, ${C.paperLo})`,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: '16px', color: C.ink,
  boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.5)',
}

const lblStyle = {
  flex: 1, fontFamily: FONT_DISPLAY, fontSize: '11px',
  letterSpacing: '0.22em', color: C.inkFaint, textTransform: 'uppercase', fontWeight: 600,
}
</script>
