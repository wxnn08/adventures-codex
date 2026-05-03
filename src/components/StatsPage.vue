<template>
  <div :style="grid">
    <div style="display: flex; flex-direction: column; gap: 14px;">
      <div data-guide-section="inspiration proficiency" :style="hl('inspiration', 'proficiency')"><InspirationProf :char="char" :update="update" /></div>
      <div data-guide-section="abilities" :style="hl('abilities')"><Abilities :char="char" :update="update" /></div>
      <div data-guide-section="saving-throws" :style="hl('saving-throws')"><SavingThrows :char="char" :update="update" /></div>
      <div data-guide-section="skills" :style="hl('skills')"><SkillsList :char="char" :update="update" /></div>
      <PassivePerception :char="char" />
    </div>
    <div style="display: flex; flex-direction: column; gap: 14px;">
      <div data-guide-section="combat" :style="hl('combat')"><CombatRow :char="char" :update="update" /></div>
      <div data-guide-section="hp" :style="hl('hp')"><HPDeath :char="char" :update="update" /></div>
      <div data-guide-section="attacks" :style="hl('attacks')"><Attacks :char="char" :update="update" /></div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
        <div data-guide-section="equipment" :style="hl('equipment')"><Equipment :char="char" :update="update" /></div>
        <div data-guide-section="proficiencies-block" :style="hl('proficiencies-block')"><Proficiencies :char="char" :update="update" /></div>
      </div>
      <div data-guide-section="features" :style="hl('features')"><Features :char="char" :update="update" /></div>
      <div data-guide-section="personality" :style="hl('personality')"><Personality :char="char" :update="update" /></div>
    </div>
  </div>
</template>

<script setup>
import InspirationProf from './stats/InspirationProf.vue'
import Abilities from './stats/Abilities.vue'
import SavingThrows from './stats/SavingThrows.vue'
import SkillsList from './stats/SkillsList.vue'
import PassivePerception from './stats/PassivePerception.vue'
import CombatRow from './stats/CombatRow.vue'
import HPDeath from './stats/HPDeath.vue'
import Attacks from './stats/Attacks.vue'
import Equipment from './stats/Equipment.vue'
import Proficiencies from './stats/Proficiencies.vue'
import Features from './stats/Features.vue'
import Personality from './stats/Personality.vue'
import { useHighlight } from '../composables/useHighlight.js'
import { C } from '../tokens.js'

defineProps({ char: Object, update: Function })

const highlight = useHighlight()

const grid = { display: 'grid', gridTemplateColumns: '280px 1fr', gap: '18px' }

function hl(...ids) {
  const isActive = ids.some(id => highlight.active.value === id)
  return {
    borderRadius: '3px',
    background: isActive ? 'rgba(184,134,43,0.08)' : 'transparent',
    boxShadow: isActive
      ? `0 0 0 3px ${C.gold}, 0 0 0 7px rgba(184,134,43,0.18), 0 10px 28px rgba(84,52,24,0.2)`
      : 'none',
    animation: isActive ? 'guideFocusPulse 1.05s ease-in-out' : 'none',
    transition: 'background 0.2s, box-shadow 0.2s',
  }
}
</script>
