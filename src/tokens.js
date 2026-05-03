// Palette + typography tokens for the Illuminated Parchment theme.

export const C = {
  ink:      '#2b1810',
  inkSoft:  '#4a2a16',
  inkFaint: '#6b4423',
  rule:     '#8b5a2b',
  ruleSoft: 'rgba(139,90,43,0.35)',
  paper:    '#f3e5c7',
  paperHi:  '#fdf6e3',
  paperLo:  '#e8d4a8',
  gold:     '#b8862b',
  goldHi:   '#d4a017',
  red:      '#8b1a1a',
  green:    '#3d7a3d',
}

export const FONT_DISPLAY = '"Cinzel", Georgia, serif'
export const FONT_BODY    = '"EB Garamond", "Cormorant Garamond", Georgia, serif'

export const ABILITIES = [
  { key: 'str', label: 'Strength' },
  { key: 'dex', label: 'Dexterity' },
  { key: 'con', label: 'Constitution' },
  { key: 'int', label: 'Intelligence' },
  { key: 'wis', label: 'Wisdom' },
  { key: 'cha', label: 'Charisma' },
]

export const SKILLS = [
  { key: 'acrobatics',     label: 'Acrobatics',      ability: 'dex' },
  { key: 'animalHandling', label: 'Animal Handling', ability: 'wis' },
  { key: 'arcana',         label: 'Arcana',          ability: 'int' },
  { key: 'athletics',      label: 'Athletics',       ability: 'str' },
  { key: 'deception',      label: 'Deception',       ability: 'cha' },
  { key: 'history',        label: 'History',         ability: 'int' },
  { key: 'insight',        label: 'Insight',         ability: 'wis' },
  { key: 'intimidation',   label: 'Intimidation',    ability: 'cha' },
  { key: 'investigation',  label: 'Investigation',   ability: 'int' },
  { key: 'medicine',       label: 'Medicine',        ability: 'wis' },
  { key: 'nature',         label: 'Nature',          ability: 'int' },
  { key: 'perception',     label: 'Perception',      ability: 'wis' },
  { key: 'performance',    label: 'Performance',     ability: 'cha' },
  { key: 'persuasion',     label: 'Persuasion',      ability: 'cha' },
  { key: 'religion',       label: 'Religion',        ability: 'int' },
  { key: 'sleightOfHand',  label: 'Sleight of Hand', ability: 'dex' },
  { key: 'stealth',        label: 'Stealth',         ability: 'dex' },
  { key: 'survival',       label: 'Survival',        ability: 'wis' },
]

export const SPELL_LEVELS = [1, 2, 3, 4, 5, 6, 7, 8, 9]

export function blankCharacter() {
  return {
    id: '',
    name: '', class: '', level: '', background: '', race: '',
    alignment: '', xp: '', playerName: '',

    inspiration: false,
    profBonus: '+2',
    ac: '', initiative: '', speed: '',
    hpMax: '', hpCurrent: '', hpTemp: '',
    hitDiceTotal: '', hitDice: '',
    deathSaves: { successes: [false, false, false], failures: [false, false, false] },

    abilities: Object.fromEntries(ABILITIES.map(a => [a.key, ''])),
    saveProf:  Object.fromEntries(ABILITIES.map(a => [a.key, false])),
    skillProf: Object.fromEntries(SKILLS.map(s => [s.key, false])),

    attacks: [
      { name: '', bonus: '', damage: '' },
      { name: '', bonus: '', damage: '' },
      { name: '', bonus: '', damage: '' },
    ],
    attackNotes: '',

    cp: '', sp: '', ep: '', gp: '', pp: '',
    equipment: '',

    personality: '', ideals: '', bonds: '', flaws: '',
    features: '', proficiencies: '',

    age: '', height: '', weight: '', eyes: '', skin: '', hair: '',
    appearance: '', backstory: '', allies: '', additionalFeatures: '',
    treasure: '', factionName: '',

    spellcastingClass: '', spellAbility: '',
    spellSaveDC: '', spellAttackBonus: '',
    cantrips: ['', '', '', '', '', '', '', ''],
    spellSlots: Object.fromEntries(SPELL_LEVELS.map(l => [l, { total: '', expended: 0 }])),
    spells: Object.fromEntries(SPELL_LEVELS.map(l =>
      [l, Array(13).fill(null).map(() => ({ name: '', prepared: false }))])),
  }
}

export const abilityMod = (s) => {
  const n = parseInt(s, 10)
  if (isNaN(n)) return null
  return Math.floor((n - 10) / 2)
}

export const fmtMod = (m) => m === null || m === undefined ? '—' : (m >= 0 ? `+${m}` : `${m}`)

export const profInt = (pb) => {
  const n = parseInt(String(pb).replace('+', ''), 10)
  return isNaN(n) ? 0 : n
}

export const saveBonus = (c, k) => {
  const m = abilityMod(c.abilities[k])
  if (m === null) return null
  return m + (c.saveProf[k] ? profInt(c.profBonus) : 0)
}

export const skillBonus = (c, k) => {
  const sk = SKILLS.find(s => s.key === k)
  const m = abilityMod(c.abilities[sk.ability])
  if (m === null) return null
  return m + (c.skillProf[k] ? profInt(c.profBonus) : 0)
}

export const passivePerception = (c) => {
  const b = skillBonus(c, 'perception')
  return b === null ? '—' : 10 + b
}
