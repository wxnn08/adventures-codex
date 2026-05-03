<template>
  <div>
    <div v-if="members.length === 0" :style="emptyStyle">No party members yet.</div>
    <div v-for="m in members" :key="m.characterId" :style="cardStyle">
      <div :style="cardTopStyle">
        <div>
          <div :style="nameStyle">{{ m.char?.name || '(Unnamed)' }}</div>
          <div :style="metaStyle">{{ m.char?.class || '—' }} {{ m.char?.level ? `· Lv ${m.char.level}` : '' }}</div>
        </div>
        <div :style="{ color: C.gold, fontSize: '9px', fontFamily: FONT_DISPLAY, letterSpacing: '0.15em' }">
          {{ isOwner(m.characterId) ? 'YOU' : '' }}
        </div>
      </div>
      <div :style="actionsStyle">
        <button :style="smallBtnStyle" @click="view(m.characterId)">View</button>
        <button v-if="!isOwner(m.characterId)" :style="smallBtnStyle" @click="setMe(m.characterId)">Set as me</button>
        <button :style="{ ...smallBtnStyle, color: C.red }" @click="remove(m.characterId)">Remove</button>
      </div>
    </div>
    <button :style="addBtnStyle" @click="addMember">+ Add Party Member</button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCurrentAdventure } from '../../composables/useCurrentAdventure.js'
import { useCurrentCharacter } from '../../composables/useCurrentCharacter.js'
import { CharacterRepository } from '../../storage/CharacterRepository.js'
import { getDefaultAdapter } from '../../storage/index.js'
import { C, FONT_DISPLAY, FONT_BODY } from '../../tokens.js'
import { ref, onMounted, watch } from 'vue'

const { adventure, addPartyMember, removePartyMember, setOwner } = useCurrentAdventure()
const { switchTo } = useCurrentCharacter()

const charRepo = new CharacterRepository(getDefaultAdapter())
const charCache = ref({})

const loadChars = async () => {
  if (!adventure.value) return
  const entries = {}
  for (const p of adventure.value.party) {
    entries[p.characterId] = await charRepo.get(p.characterId)
  }
  charCache.value = entries
}

onMounted(loadChars)
watch(adventure, loadChars)

const members = computed(() =>
  (adventure.value?.party || []).map(p => ({
    characterId: p.characterId,
    role: p.role,
    char: charCache.value[p.characterId],
  }))
)

const isOwner = (id) => adventure.value?.ownerCharacterId === id

const view = (id) => switchTo(id)

const setMe = async (id) => {
  await setOwner(id)
}

const remove = async (id) => {
  if (confirm('Remove this party member? Their character sheet will not be deleted.')) {
    await removePartyMember(id)
    await loadChars()
  }
}

const addMember = async () => {
  const char = await charRepo.create({ name: '' })
  await addPartyMember({ characterId: char.id })
  await loadChars()
  switchTo(char.id)
}

const cardStyle = {
  background: 'rgba(253,246,227,0.5)',
  border: `1px solid ${C.ruleSoft}`,
  padding: '8px 10px',
  marginBottom: '8px',
}

const cardTopStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }
const nameStyle = { fontFamily: FONT_DISPLAY, fontSize: '11px', fontWeight: 600, color: C.ink, letterSpacing: '0.06em' }
const metaStyle = { fontFamily: FONT_BODY, fontSize: '11px', color: C.inkFaint, marginTop: '1px' }
const actionsStyle = { display: 'flex', gap: '6px' }

const smallBtnStyle = {
  background: 'transparent',
  border: `1px solid ${C.ruleSoft}`,
  color: C.inkFaint,
  padding: '2px 8px',
  fontFamily: FONT_DISPLAY,
  fontSize: '8px',
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  cursor: 'pointer',
}

const addBtnStyle = {
  ...smallBtnStyle,
  width: '100%',
  border: `1px dashed ${C.rule}`,
  padding: '6px',
  marginTop: '4px',
  textAlign: 'center',
}

const emptyStyle = { color: C.inkFaint, fontSize: '12px', fontStyle: 'italic', marginBottom: '8px' }
</script>
