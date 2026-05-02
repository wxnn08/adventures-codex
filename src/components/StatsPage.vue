<template>
  <div :style="grid">
    <div style="display: flex; flex-direction: column; gap: 14px;">
      <InspirationProf :char="char" :update="update" />
      <Abilities :char="char" :update="update" />
      <SavingThrows :char="char" :update="update" />
      <SkillsList :char="char" :update="update" />
      <PassivePerception :char="char" />
    </div>
    <div style="display: flex; flex-direction: column; gap: 14px;">
      <CombatRow :char="char" :update="update" />
      <HPDeath :char="char" :update="update" />
      <Attacks :char="char" :update="update" />
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
        <Equipment :char="char" :update="update" />
        <Proficiencies :char="char" :update="update" />
      </div>
      <Features :char="char" :update="update" />
      <Personality :char="char" :update="update" />
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

defineProps({ char: Object, update: Function })

const grid = { display: 'grid', gridTemplateColumns: '280px 1fr', gap: '18px' }
</script>
