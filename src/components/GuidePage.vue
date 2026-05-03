<template>
  <div :style="pageStyle">

    <!-- ── Setup phase ───────────────────────────────────────────────── -->
    <div v-if="!state.setupDone" :style="setupStyle">
      <div :style="setupGlyphStyle">❦</div>
      <h2 :style="setupTitleStyle">Before You Begin</h2>
      <p :style="setupLeadStyle">Tell us about your adventure so the guide can tailor every step to your character.</p>

      <!-- Level picker -->
      <div :style="setupFieldStyle">
        <div :style="setupLabelStyle">Starting Level</div>
        <div :style="levelRowStyle">
          <button :style="levelBtnStyle" @click="setupLevel = Math.max(1, setupLevel - 1)">−</button>
          <div :style="levelDisplayStyle">{{ setupLevel }}</div>
          <button :style="levelBtnStyle" @click="setupLevel = Math.min(20, setupLevel + 1)">+</button>
        </div>
        <div :style="setupHintStyle">{{ profBonusForLevel(setupLevel) }} proficiency bonus · {{ levelTierLabel(setupLevel) }}</div>
      </div>

      <!-- Generation method -->
      <div :style="setupFieldStyle">
        <div :style="setupLabelStyle">Ability Score Method</div>
        <div :style="methodGridStyle">
          <button
            v-for="m in METHODS"
            :key="m.key"
            :style="methodBtnStyle(setupMethod === m.key)"
            @click="setupMethod = m.key"
          >
            <div :style="methodNameStyle">{{ m.label }}</div>
            <div :style="methodDescStyle">{{ m.desc }}</div>
          </button>
        </div>
      </div>

      <button
        :style="beginBtnStyle(!!setupMethod)"
        :disabled="!setupMethod"
        @click="setupMethod && completeSetup()"
      >Begin Guide →</button>
    </div>

    <!-- ── Done screen ─────────────────────────────────────────────── -->
    <div v-else-if="state.done" :style="doneStyle">
      <div :style="doneGlyphStyle">❦</div>
      <h2 :style="doneTitleStyle">Your Character is Ready!</h2>
      <p :style="doneBodyStyle">
        You've filled in every part of your character sheet. Your legend begins now — go find some trouble.
      </p>
      <button :style="startBtnStyle" @click="close">✦&nbsp;&nbsp;Start Your Adventure&nbsp;&nbsp;✦</button>
      <button :style="reviewBtnStyle" @click="review">Review Guide</button>
      <button :style="resetLinkStyle" @click="reset">reset guide</button>
    </div>

    <!-- ── Wizard ──────────────────────────────────────────────────── -->
    <template v-else>

      <!-- Progress counter -->
      <div :style="progressStyle">Step {{ state.current + 1 }} of {{ sections.length }}</div>

      <!-- Section heading -->
      <div :style="sectionHeadStyle">
        <span :style="sectionNumStyle">{{ section.number }}</span>
        <div>
          <span :style="sectionTitleStyle">{{ section.title }}</span>
          <a
            v-if="section.srdLink"
            :href="section.srdLink"
            target="_blank"
            rel="noopener"
            :style="srdLinkStyle"
          >↗ SRD</a>
        </div>
      </div>

      <!-- Intro -->
      <p :style="leadStyle">{{ section.intro }}</p>

      <!-- Optional tip -->
      <GuideTip v-if="section.tip">
        <span style="white-space: pre-line">{{ section.tip }}</span>
      </GuideTip>

      <!-- Optional reference table -->
      <div v-if="section.table" :style="tableWrapStyle">
        <div :style="tableTitleStyle">{{ section.table.title }}</div>
        <table :style="tableStyle">
          <thead>
            <tr>
              <th
                v-for="heading in section.table.headings"
                :key="heading"
                :style="thStyle"
              >{{ heading }}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(row, ri) in section.table.rows"
              :key="row.key ?? ri"
              :style="trStyle(row.active)"
            >
              <td
                v-for="(cell, ci) in row.cells"
                :key="ci"
                :style="tdStyle(row.active)"
              >{{ cell }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Checklist -->
      <div
        :style="checklistStyle"
        @mouseleave="clearHighlight"
      >
        <div
          v-for="(item, ii) in section.items"
          :key="ii"
          :style="checkRowStyle(isChecked(state.current, ii), hoveredRow === ii)"
          @click="toggle(state.current, ii)"
          @mouseenter="onItemHover(ii, item)"
          @mouseleave="hoveredRow = null"
        >
          <div :style="checkBoxStyle(isChecked(state.current, ii))">
            <span v-if="isChecked(state.current, ii)" :style="checkMarkStyle">✓</span>
          </div>
          <div style="flex: 1; min-width: 0;">
            <span :style="checkLabelStyle">{{ typeof item === 'string' ? item : item.text }}</span>
            <div v-if="typeof item === 'object' && item.location" :style="locationRowStyle">
              <span :style="locationStyle">📖 {{ item.location }}</span>
              <a
                v-if="item.link"
                :href="item.link"
                target="_blank"
                rel="noopener"
                :style="itemLinkStyle"
                @click.stop
              >↗</a>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <div :style="navRowStyle">
        <div style="display: flex; flex-direction: column; align-items: flex-start; gap: 6px;">
          <button
            v-if="state.current > 0"
            :style="backBtnStyle"
            @click="goTo(state.current - 1)"
          >← Back</button>
          <div v-else />
          <button :style="resetLinkStyle" @click="reset">reset guide</button>
        </div>
        <div :style="navRightStyle">
          <button
            v-if="section.skippable"
            :style="skipBtnStyle"
            @click="handleAdvance(true)"
          >Skip →</button>
          <button
            :style="continueBtnStyle(canContinue)"
            :disabled="!canContinue"
            @click="canContinue && handleAdvance(false)"
          >Continue →</button>
        </div>
      </div>

    </template>
  </div>
</template>

<script setup>
import { ref, computed, defineComponent, h, watch } from 'vue'
import { C, FONT_BODY, FONT_DISPLAY } from '../tokens.js'
import { useGuideProgress } from '../composables/useGuideProgress.js'
import { useGuideDrawer }   from '../composables/useGuideDrawer.js'
import { useHighlight }     from '../composables/useHighlight.js'

const { state, completeSetup: _completeSetup, toggle, isChecked, allChecked, goTo, finish, review, reset } = useGuideProgress()
const { close } = useGuideDrawer()
const highlight = useHighlight()

// ── Setup phase state ─────────────────────────────────────────────────────────

const setupLevel  = ref(state.level || 1)
const setupMethod = ref(state.generationMethod || null)

function completeSetup() {
  _completeSetup(setupLevel.value, setupMethod.value)
}

const METHODS = [
  { key: 'standard', label: 'Standard Array', desc: 'Assign 15, 14, 13, 12, 10, 8' },
  { key: 'pointbuy', label: 'Point Buy',      desc: 'Spend 27 points, start at 8' },
  { key: 'rolling',  label: 'Rolling',        desc: 'Roll 4d6 drop lowest, ×6' },
]

const ADVANCEMENT_TABLE = {
  title: 'Character Advancement',
  headings: ['Experience Points', 'Level', 'Proficiency Bonus'],
  rows: [
    { key: 1, cells: ['0', '1', '+2'] },
    { key: 2, cells: ['300', '2', '+2'] },
    { key: 3, cells: ['900', '3', '+2'] },
    { key: 4, cells: ['2,700', '4', '+2'] },
    { key: 5, cells: ['6,500', '5', '+3'] },
    { key: 6, cells: ['14,000', '6', '+3'] },
    { key: 7, cells: ['23,000', '7', '+3'] },
    { key: 8, cells: ['34,000', '8', '+3'] },
    { key: 9, cells: ['48,000', '9', '+4'] },
    { key: 10, cells: ['64,000', '10', '+4'] },
    { key: 11, cells: ['85,000', '11', '+4'] },
    { key: 12, cells: ['100,000', '12', '+4'] },
    { key: 13, cells: ['120,000', '13', '+5'] },
    { key: 14, cells: ['140,000', '14', '+5'] },
    { key: 15, cells: ['165,000', '15', '+5'] },
    { key: 16, cells: ['195,000', '16', '+5'] },
    { key: 17, cells: ['225,000', '17', '+6'] },
    { key: 18, cells: ['265,000', '18', '+6'] },
    { key: 19, cells: ['305,000', '19', '+6'] },
    { key: 20, cells: ['355,000', '20', '+6'] },
  ],
}

const POINT_BUY_TABLE = {
  title: 'Point Buy Costs',
  headings: ['Score', 'Cost'],
  rows: [
    { key: 8, cells: ['8', '0'] },
    { key: 9, cells: ['9', '1'] },
    { key: 10, cells: ['10', '2'] },
    { key: 11, cells: ['11', '3'] },
    { key: 12, cells: ['12', '4'] },
    { key: 13, cells: ['13', '5'] },
    { key: 14, cells: ['14', '7'] },
    { key: 15, cells: ['15', '9'] },
  ],
}

const SAVING_THROW_TABLE = {
  title: 'Class Saving Throws',
  headings: ['Class', 'Proficient Saves'],
  rows: [
    { key: 'barbarian', cells: ['Barbarian', 'STR, CON'] },
    { key: 'bard', cells: ['Bard', 'DEX, CHA'] },
    { key: 'cleric', cells: ['Cleric', 'WIS, CHA'] },
    { key: 'druid', cells: ['Druid', 'INT, WIS'] },
    { key: 'fighter', cells: ['Fighter', 'STR, CON'] },
    { key: 'monk', cells: ['Monk', 'STR, DEX'] },
    { key: 'paladin', cells: ['Paladin', 'WIS, CHA'] },
    { key: 'ranger', cells: ['Ranger', 'STR, DEX'] },
    { key: 'rogue', cells: ['Rogue', 'DEX, INT'] },
    { key: 'sorcerer', cells: ['Sorcerer', 'CON, CHA'] },
    { key: 'warlock', cells: ['Warlock', 'WIS, CHA'] },
    { key: 'wizard', cells: ['Wizard', 'INT, WIS'] },
  ],
}

const HIT_DICE_TABLE = {
  title: 'Hit Dice By Class',
  headings: ['Hit Die', 'Classes'],
  rows: [
    { key: 'd12', cells: ['d12', 'Barbarian'] },
    { key: 'd10', cells: ['d10', 'Fighter, Paladin, Ranger'] },
    { key: 'd8', cells: ['d8', 'Bard, Cleric, Druid, Monk, Rogue, Warlock'] },
    { key: 'd6', cells: ['d6', 'Sorcerer, Wizard'] },
  ],
}

const COMBAT_STATS_TABLE = {
  title: 'Combat Stat Formulas',
  headings: ['Field', 'Formula'],
  rows: [
    { key: 'ac-unarmored', cells: ['AC without armor', '10 + Dex modifier'] },
    { key: 'ac-light', cells: ['Light armor', 'Armor value + Dex modifier'] },
    { key: 'ac-medium', cells: ['Medium armor', 'Armor value + Dex modifier, max +2'] },
    { key: 'ac-heavy', cells: ['Heavy armor', 'Armor value only'] },
    { key: 'shield', cells: ['Shield', '+2 AC'] },
    { key: 'initiative', cells: ['Initiative', 'Dex modifier'] },
    { key: 'speed', cells: ['Speed', 'Race base speed, usually 30 ft.'] },
  ],
}

const ATTACK_FORMULA_TABLE = {
  title: 'Attack Formulas',
  headings: ['Attack Type', 'Attack Bonus'],
  rows: [
    { key: 'melee', cells: ['Melee weapon', 'Str mod + Prof Bonus if proficient'] },
    { key: 'finesse', cells: ['Finesse weapon', 'Str or Dex mod + Prof Bonus if proficient'] },
    { key: 'ranged', cells: ['Ranged weapon', 'Dex mod + Prof Bonus if proficient'] },
  ],
}

const CURRENCY_TABLE = {
  title: 'Currency Conversion',
  headings: ['Coin', 'Value'],
  rows: [
    { key: 'cp', cells: ['1 CP', 'Base copper coin'] },
    { key: 'sp', cells: ['1 SP', '10 CP'] },
    { key: 'ep', cells: ['1 EP', '5 SP'] },
    { key: 'gp', cells: ['1 GP', '10 SP'] },
    { key: 'pp', cells: ['1 PP', '10 GP'] },
  ],
}

const SPELLCASTING_TABLE = {
  title: 'Spellcasting Reference',
  headings: ['Field', 'Formula / Classes'],
  rows: [
    { key: 'dc', cells: ['Spell Save DC', '8 + Prof Bonus + casting ability modifier'] },
    { key: 'attack', cells: ['Spell Attack Bonus', 'Prof Bonus + casting ability modifier'] },
    { key: 'int', cells: ['Intelligence', 'Wizard'] },
    { key: 'wis', cells: ['Wisdom', 'Cleric, Druid, Ranger'] },
    { key: 'cha', cells: ['Charisma', 'Bard, Paladin, Sorcerer, Warlock'] },
  ],
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function profBonusForLevel(lvl) {
  if (lvl <= 4)  return '+2'
  if (lvl <= 8)  return '+3'
  if (lvl <= 12) return '+4'
  if (lvl <= 16) return '+5'
  return '+6'
}

function levelTierLabel(lvl) {
  if (lvl <= 4)  return 'Tier 1 (local hero)'
  if (lvl <= 10) return 'Tier 2 (hero of the realm)'
  if (lvl <= 16) return 'Tier 3 (master)'
  return 'Tier 4 (epic hero)'
}

function tableWithActiveLevel(table, lvl) {
  return {
    ...table,
    rows: table.rows.map(row => ({ ...row, active: row.key === lvl })),
  }
}

function abilityTable(method) {
  return method === 'pointbuy' ? POINT_BUY_TABLE : null
}

function hpTip(lvl) {
  const base = 'Level 1 HP = max hit die + Con modifier'
  if (lvl === 1) return base + '\nHit Dice: spend during short rests (roll die + Con mod per die)'
  return base + `\nLevels 2–${lvl}: add your hit die roll (or average) + Con modifier per level`
}

function abilityTip(method) {
  if (method === 'standard') return 'Scores available: 15, 14, 13, 12, 10, 8 — each used exactly once\nApply racial bonuses after assigning'
  if (method === 'pointbuy') return 'Every ability starts at 8. Spend 27 points. Max 15 before racial bonuses.\nApply racial bonuses after spending points'
  if (method === 'rolling')  return 'Roll 4d6, drop the lowest die — that total is one ability score\nRepeat six times. Assign results to abilities as you wish.\nApply racial bonuses after assigning'
  return 'Standard Array: assign 15, 14, 13, 12, 10, 8\nPoint Buy: start each at 8, spend 27 points\nRolling: roll 4d6 drop lowest, six times'
}

function abilityItems(method) {
  const racial = {
    text: 'Apply racial bonuses to the appropriate ability scores',
    location: 'Your race description lists its ability score increases',
    link: 'https://www.5esrd.com/races/',
  }
  if (method === 'standard') return [
    {
      text: 'Assign the six standard array scores (15, 14, 13, 12, 10, 8) to your abilities',
      location: 'The Standard Array is the quickest option — one score per ability, each used once',
      link: 'https://www.5esrd.com/character-creation-outline/',
    },
    racial,
  ]
  if (method === 'pointbuy') return [
    {
      text: 'Open the Point Buy table and spend your 27 points (each ability starts at 8, max 15)',
      location: 'The full cost table is in the PHB or at the link below',
      link: 'https://www.5esrd.com/character-creation-outline/',
    },
    racial,
  ]
  if (method === 'rolling') return [
    {
      text: 'Roll 4d6 and drop the lowest die — repeat six times and record each total',
      location: 'Each result is one ability score; assign them freely to your six abilities',
      link: 'https://www.5esrd.com/character-creation-outline/',
    },
    {
      text: 'Assign your six rolled scores to Strength, Dexterity, Constitution, Intelligence, Wisdom, Charisma',
    },
    racial,
  ]
  // fallback (no method yet)
  return [
    'Choose your generation method (standard array, point buy, or rolling)',
    'Assign your six ability scores',
    racial,
  ]
}

function hpItems(lvl) {
  const base = [
    'Calculate and enter your Hit Point Maximum',
    `Set Current Hit Points equal to your maximum`,
    `Enter your Hit Dice total (${lvl} at level ${lvl}) and die type (e.g. d10)`,
    'Leave Death Saves blank — only fill when you drop to 0 HP',
  ]
  if (lvl > 1) {
    base.splice(0, 1, {
      text: `Calculate and enter your Hit Point Maximum (max hit die + Con mod at level 1, then add rolled or average hit die + Con mod for each level up to ${lvl})`,
      location: 'Your class lists your Hit Die; Constitution modifier is (CON score − 10) ÷ 2 rounded down',
      link: 'https://www.5esrd.com/character-creation-outline/',
    })
  }
  return base
}

function featuresItems(lvl) {
  if (lvl === 1) return [
    { text: 'Record your level 1 class features (e.g. Rage, Sneak Attack, Divine Smite)', location: 'Your class description lists features gained at each level', link: 'https://www.5esrd.com/classes/' },
    { text: 'Record your racial traits (e.g. Darkvision, Fey Ancestry, Breath Weapon)', location: 'Your race description lists all racial traits', link: 'https://www.5esrd.com/races/' },
    { text: 'Record your background feature (e.g. Shelter of the Faithful, Criminal Contact)', location: 'Your background description lists its special feature', link: 'https://www.5esrd.com/backgrounds/' },
  ]
  return [
    { text: `Record all class features gained from level 1 through level ${lvl}`, location: 'Your class table lists which features unlock at each level — check every row up to your starting level', link: 'https://www.5esrd.com/classes/' },
    { text: 'Record your racial traits (e.g. Darkvision, Fey Ancestry, Breath Weapon)', location: 'Your race description lists all racial traits', link: 'https://www.5esrd.com/races/' },
    { text: 'Record your background feature (e.g. Shelter of the Faithful, Criminal Contact)', location: 'Your background description lists its special feature', link: 'https://www.5esrd.com/backgrounds/' },
  ]
}

// ── Sections (dynamic) ────────────────────────────────────────────────────────

const sections = computed(() => {
  const lvl    = state.level || 1
  const method = state.generationMethod
  const pb     = profBonusForLevel(lvl)

  return [
    {
      number: 'I',
      title: 'Character Identity',
      highlight: 'header',
      srdLink: 'https://www.5esrd.com/character-creation-outline/',
      intro: 'The header of your sheet names who you are. Fill these fields first — they set the stage for every other decision.',
      tip: null,
      table: tableWithActiveLevel(ADVANCEMENT_TABLE, lvl),
      skippable: false,
      items: [
        "Fill in your character's name in the header",
        {
          text: `Choose your class and enter Level ${lvl}`,
          location: 'Browse all 5e classes to find your fit',
          link: 'https://www.5esrd.com/classes/',
        },
        {
          text: 'Choose your race',
          location: 'Your race grants ability bonuses, traits, and sometimes languages',
          link: 'https://www.5esrd.com/races/',
        },
        {
          text: 'Choose your background',
          location: 'Your background gives two skill proficiencies, a tool or language, and a special feature',
          link: 'https://www.5esrd.com/backgrounds/',
        },
        {
          text: 'Set your alignment',
          location: 'Alignment describes your character\'s moral and ethical outlook',
          link: 'https://www.5esrd.com/alignment/',
        },
        lvl === 1
          ? 'Set Experience Points to 0'
          : `Set Experience Points to the minimum for level ${lvl} (see XP table)`,
        'Enter your player name',
      ],
    },
    {
      number: 'II',
      title: 'Backstory & Appearance',
      highlight: 'bio',
      tab: 'bio',
      srdLink: null,
      intro: 'Switch to the Backstory tab for these fields. They don\'t affect mechanics, but they make your character memorable.',
      tip: null,
      skippable: false,
      items: [
        'Fill in your appearance (age, height, weight, eyes, skin, hair)',
        'Write a brief character backstory',
        'Note allies or organizations (optional)',
      ],
    },
    {
      number: 'III',
      title: 'Ability Scores & Modifiers',
      highlight: 'abilities',
      srdLink: 'https://www.5esrd.com/using-ability-scores/',
      intro: method === 'standard'
        ? 'Assign the standard array scores across your six abilities, then add racial bonuses.'
        : method === 'pointbuy'
          ? 'Spend your 27 points across the six abilities (each starts at 8), then add racial bonuses.'
          : method === 'rolling'
            ? 'You\'ve rolled your six scores — now assign and add racial bonuses.'
            : 'Six scores define your character\'s natural strengths. Assign them now — everything else follows.',
      tip: abilityTip(method),
      table: abilityTable(method),
      skippable: false,
      items: abilityItems(method),
    },
    {
      number: 'IV',
      title: 'Proficiency Bonus',
      highlight: 'proficiency',
      srdLink: 'https://www.5esrd.com/classes/',
      intro: `One number added to every roll you're trained in. At level ${lvl} it's always ${pb} — it rises automatically as you gain levels.`,
      tip: `Your current level (${lvl}) → ${pb}`,
      table: tableWithActiveLevel(ADVANCEMENT_TABLE, lvl),
      skippable: false,
      items: [
        `Enter ${pb} as your Proficiency Bonus`,
      ],
    },
    {
      number: 'V',
      title: 'Saving Throws',
      highlight: 'saving-throws',
      srdLink: 'https://www.5esrd.com/using-ability-scores/',
      intro: 'Your class grants proficiency in two saving throws. Mark those circles on the sheet — the bonus next to each is already calculated.',
      tip: null,
      table: SAVING_THROW_TABLE,
      skippable: false,
      items: [
        {
          text: 'Check the proficiency circle for your first class saving throw',
          location: 'Your class description names both proficient saving throws — see the table above or your class page on the SRD',
          link: 'https://www.5esrd.com/classes/',
        },
        {
          text: 'Check the proficiency circle for your second class saving throw',
          location: 'Same class description — each class is proficient in exactly two saving throws',
          link: 'https://www.5esrd.com/classes/',
        },
      ],
    },
    {
      number: 'VI',
      title: 'Skills',
      highlight: 'skills',
      srdLink: 'https://www.5esrd.com/using-ability-scores/',
      intro: `Mark every skill you're proficient in. Your class gives 2–4 chosen from a class list; your background gives 2 more fixed skills.`,
      tip: null,
      skippable: false,
      items: [
        {
          text: "Mark your class skill proficiencies (choose from your class's list)",
          location: 'Your class description lists the skills you may choose from and how many you get',
          link: 'https://www.5esrd.com/classes/',
        },
        {
          text: 'Mark your two background skill proficiencies',
          location: 'Your background description lists exactly which two skills it grants — no choice needed',
          link: 'https://www.5esrd.com/backgrounds/',
        },
      ],
    },
    {
      number: 'VII',
      title: 'Inspiration',
      highlight: 'inspiration',
      srdLink: null,
      intro: 'Inspiration is awarded by the DM during play as a reward for great roleplay. You don\'t start with it — leave it off for now.',
      tip: 'When you have Inspiration, you can spend it before any d20 roll to gain advantage (roll two d20s, take the higher).',
      skippable: false,
      items: [
        'Leave the Inspiration toggle off — your DM awards it during play',
      ],
    },
    {
      number: 'VIII',
      title: 'Combat Statistics',
      highlight: 'combat',
      srdLink: 'https://www.5esrd.com/gamemastering/combat/',
      intro: 'Three numbers referenced constantly in combat. Calculate each from your scores and equipment.',
      tip: null,
      table: COMBAT_STATS_TABLE,
      skippable: false,
      items: [
        {
          text: 'Calculate and enter your Armor Class (AC)',
          location: 'Your class/background determines your starting armor; see the Equipment section of the SRD',
          link: 'https://www.5esrd.com/equipment/armor/',
        },
        'Enter your Initiative modifier (your Dexterity modifier)',
        {
          text: 'Enter your Speed in feet',
          location: 'Your race description lists your base walking speed (usually 30 ft.)',
          link: 'https://www.5esrd.com/races/',
        },
      ],
    },
    {
      number: 'IX',
      title: 'Hit Points, Hit Dice & Death',
      highlight: 'hp',
      srdLink: 'https://www.5esrd.com/character-creation-outline/',
      intro: `HP is how much punishment your character can take.${lvl > 1 ? ` At level ${lvl} you'll calculate HP for each level.` : ' Set it up carefully — it recalculates every time you level up.'}`,
      tip: hpTip(lvl),
      table: HIT_DICE_TABLE,
      skippable: false,
      items: hpItems(lvl),
    },
    {
      number: 'X',
      title: 'Attacks',
      highlight: 'attacks',
      srdLink: 'https://www.5esrd.com/gamemastering/combat/',
      intro: 'List the weapons you\'ll use in combat. You have three attack slots — start with your main weapon.',
      tip: `Current Proficiency Bonus: ${pb}`,
      table: ATTACK_FORMULA_TABLE,
      skippable: false,
      items: [
        {
          text: 'Add your primary weapon: name, attack bonus, and damage',
          location: 'Your class/background equipment lists your starting weapons; see the Weapons table in the SRD',
          link: 'https://www.5esrd.com/equipment/weapons/',
        },
        'Add a secondary weapon or offensive cantrip (optional)',
      ],
    },
    {
      number: 'XI',
      title: 'Equipment & Currency',
      highlight: 'equipment',
      srdLink: 'https://www.5esrd.com/equipment/',
      intro: 'Record everything your character carries. Your class and background each provide a starting gear package.',
      tip: 'A laborer earns about 1-2 sp/day. A night\'s lodging ranges from about 5 sp to 2 gp.',
      table: CURRENCY_TABLE,
      skippable: false,
      items: [
        {
          text: 'List your starting equipment from your class and background',
          location: 'Both your class and background descriptions list starting equipment options',
          link: 'https://www.5esrd.com/equipment/',
        },
        'Enter your starting gold',
      ],
    },
    {
      number: 'XII',
      title: 'Proficiencies & Languages',
      highlight: 'proficiencies-block',
      srdLink: null,
      intro: 'Document your training and the languages you speak. These come from your class, background, and race.',
      tip: null,
      skippable: false,
      items: [
        {
          text: 'List armor and weapon proficiencies from your class',
          location: 'Your class description lists armor/weapon proficiencies in its opening section',
          link: 'https://www.5esrd.com/classes/',
        },
        {
          text: 'List tool proficiencies (from class, background, or race)',
          location: 'Check your class, background, and race descriptions — all three may grant tool proficiencies',
        },
        {
          text: 'List all languages you know',
          location: 'Common is universal. Your race grants one or more extra languages; your background may add another',
          link: 'https://www.5esrd.com/languages/',
        },
      ],
    },
    {
      number: 'XIII',
      title: 'Features & Traits',
      highlight: 'features',
      srdLink: 'https://www.5esrd.com/classes/',
      intro: `This block is your mechanical toolbox.${lvl > 1 ? ` At level ${lvl} you'll have features from multiple levels to record.` : ' Check your class, race, and background entries carefully.'}`,
      tip: null,
      skippable: false,
      items: featuresItems(lvl),
    },
    {
      number: 'XIV',
      title: 'Personality & Bonds',
      highlight: 'personality',
      srdLink: null,
      intro: 'These four traits breathe life into your character and give the DM story hooks. Your background suggests options, but you can write your own.',
      tip: null,
      skippable: false,
      items: [
        {
          text: 'Write two personality traits (how you behave day-to-day)',
          location: 'Your background lists suggested personality traits — use them or write your own',
          link: 'https://www.5esrd.com/backgrounds/',
        },
        {
          text: 'Write an ideal (the principle you live by)',
          location: 'Your background lists suggested ideals',
        },
        {
          text: 'Write a bond (a person, place, or cause you care about deeply)',
          location: 'Your background lists suggested bonds',
        },
        {
          text: 'Write a flaw (a weakness or vice that could be exploited)',
          location: 'Your background lists suggested flaws',
        },
      ],
    },
    {
      number: 'XV',
      title: 'Spellcasting',
      highlight: 'spells',
      tab: 'spells',
      srdLink: 'https://www.5esrd.com/spellcasting/',
      intro: 'Switch to the Spellbook tab. Only fill this section if your class casts spells (Bard, Cleric, Druid, Paladin, Ranger, Sorcerer, Warlock, Wizard).',
      tip: `Current Proficiency Bonus: ${pb}`,
      table: SPELLCASTING_TABLE,
      skippable: true,
      items: [
        { text: 'Enter your spellcasting class and ability', location: 'Your class description names its spellcasting ability', link: 'https://www.5esrd.com/classes/' },
        'Calculate and enter your Spell Save DC',
        'Calculate and enter your Spell Attack Bonus',
        {
          text: 'List your cantrips (if any)',
          location: 'Your class lists how many cantrips you know at your level; choose from your class spell list',
          link: 'https://www.5esrd.com/spellcasting/spell-lists/',
        },
        {
          text: `Fill in your spell slots for each level you have access to at level ${lvl}`,
          location: 'Your class table shows spell slots per level — find your starting level\'s row',
          link: 'https://www.5esrd.com/classes/',
        },
        { text: 'List your starting spells and mark which are prepared', location: 'Your class description explains how many spells you know or can prepare', link: 'https://www.5esrd.com/spellcasting/' },
      ],
    },
  ]
})

// ── State & computed ──────────────────────────────────────────────────────────

const hoveredRow = ref(null)
const section    = computed(() => sections.value[state.current])
const canContinue = computed(() => allChecked(state.current, section.value.items.length))

watch(
  () => [state.setupDone, state.done, state.current, section.value?.highlight, section.value?.tab],
  () => {
    if (!state.setupDone || state.done || !section.value) {
      highlight.active.value = null
      highlight.tab.value = null
      return
    }

    highlight.active.value = section.value.highlight ?? null
    highlight.tab.value = section.value.tab ?? 'stats'
  },
  { immediate: true },
)

function handleAdvance() {
  const next = state.current + 1
  if (next >= sections.value.length) finish()
  else goTo(next)
}

function onItemHover(ii, item) {
  hoveredRow.value = ii
  highlight.active.value = section.value.highlight ?? null
}

function clearHighlight() {
  hoveredRow.value = null
}

// ── Inline child components ───────────────────────────────────────────────────

const GuideTip = defineComponent({
  setup(_, { slots }) {
    return () => h('div', {
      style: {
        background: 'rgba(184,134,43,0.08)',
        border: `1px solid rgba(184,134,43,0.3)`,
        borderLeft: `3px solid ${C.gold}`,
        padding: '8px 12px',
        margin: '0 0 14px',
        fontFamily: FONT_BODY,
        fontSize: '12.5px',
        lineHeight: '1.6',
        color: C.ink,
      },
    }, slots.default?.())
  },
})

// ── Styles ────────────────────────────────────────────────────────────────────

const pageStyle = { display: 'flex', flexDirection: 'column', minHeight: '100%' }

// Setup
const setupStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  padding: '20px 4px 24px',
  gap: '20px',
}
const setupGlyphStyle = { fontFamily: FONT_DISPLAY, fontSize: '32px', color: C.gold, lineHeight: 1 }
const setupTitleStyle = { fontFamily: FONT_DISPLAY, fontSize: '15px', letterSpacing: '0.18em', textTransform: 'uppercase', color: C.ink, margin: 0, fontWeight: 600 }
const setupLeadStyle  = { fontFamily: FONT_BODY, fontSize: '13px', lineHeight: '1.6', color: C.inkSoft, margin: 0, maxWidth: '280px' }
const setupFieldStyle = { width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }
const setupLabelStyle = { fontFamily: FONT_DISPLAY, fontSize: '9.5px', letterSpacing: '0.25em', textTransform: 'uppercase', color: C.gold }
const setupHintStyle  = { fontFamily: FONT_BODY, fontSize: '11.5px', color: C.inkFaint }

const levelRowStyle   = { display: 'flex', alignItems: 'center', gap: '12px' }
const levelBtnStyle   = {
  fontFamily: FONT_DISPLAY, fontSize: '18px', lineHeight: 1,
  width: '32px', height: '32px',
  border: `1px solid ${C.rule}`, background: 'transparent', color: C.inkFaint,
  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
}
const levelDisplayStyle = {
  fontFamily: FONT_DISPLAY, fontSize: '28px', fontWeight: 700, color: C.ink,
  minWidth: '40px', textAlign: 'center',
}

const methodGridStyle = { display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }
const methodBtnStyle = (active) => ({
  display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
  padding: '8px 12px',
  border: `1px solid ${active ? C.gold : C.ruleSoft}`,
  background: active ? 'rgba(184,134,43,0.1)' : 'transparent',
  cursor: 'pointer', textAlign: 'left',
  transition: 'all 0.12s',
})
const methodNameStyle = { fontFamily: FONT_DISPLAY, fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: C.ink }
const methodDescStyle = { fontFamily: FONT_BODY, fontSize: '12px', color: C.inkFaint, marginTop: '2px' }
const beginBtnStyle = (active) => ({
  fontFamily: FONT_DISPLAY, fontSize: '9.5px', letterSpacing: '0.22em', textTransform: 'uppercase',
  padding: '9px 20px',
  border: `1px solid ${active ? C.rule : C.ruleSoft}`,
  background: active ? `linear-gradient(180deg, ${C.rule}, ${C.inkFaint})` : 'rgba(253,246,227,0.4)',
  color: active ? C.paperHi : C.inkFaint,
  cursor: active ? 'pointer' : 'default',
  boxShadow: active ? `inset 0 -2px 0 ${C.goldHi}` : 'none',
  transition: 'all 0.12s',
  marginTop: '4px',
})

// Done screen
const doneStyle = {
  display: 'flex', flexDirection: 'column', alignItems: 'center',
  textAlign: 'center', padding: '32px 8px 24px', gap: '14px',
}
const doneGlyphStyle = { fontFamily: FONT_DISPLAY, fontSize: '40px', color: C.gold, lineHeight: 1 }
const doneTitleStyle = { fontFamily: FONT_DISPLAY, fontSize: '18px', letterSpacing: '0.16em', textTransform: 'uppercase', color: C.ink, margin: 0, fontWeight: 600 }
const doneBodyStyle  = { fontFamily: FONT_BODY, fontSize: '13.5px', lineHeight: '1.65', color: C.inkSoft, margin: 0, maxWidth: '300px' }
const startBtnStyle  = { fontFamily: FONT_DISPLAY, fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', padding: '10px 20px', border: `1px solid ${C.rule}`, background: `linear-gradient(180deg, ${C.rule}, ${C.inkFaint})`, color: C.paperHi, cursor: 'pointer', boxShadow: `inset 0 -2px 0 ${C.goldHi}`, marginTop: '4px' }
const reviewBtnStyle = { fontFamily: FONT_DISPLAY, fontSize: '9.5px', letterSpacing: '0.2em', textTransform: 'uppercase', padding: '7px 16px', border: `1px solid ${C.rule}`, background: 'transparent', color: C.inkFaint, cursor: 'pointer' }
const resetLinkStyle = { fontFamily: FONT_BODY, fontSize: '11px', color: C.inkFaint, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', padding: 0 }

// Wizard
const progressStyle = { fontFamily: FONT_DISPLAY, fontSize: '9px', letterSpacing: '0.28em', textTransform: 'uppercase', color: C.gold, marginBottom: '12px' }
const sectionHeadStyle = { display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '10px' }
const sectionNumStyle  = { fontFamily: FONT_DISPLAY, fontSize: '11px', letterSpacing: '0.25em', color: C.gold, minWidth: '22px' }
const sectionTitleStyle = { fontFamily: FONT_DISPLAY, fontSize: '14px', letterSpacing: '0.15em', textTransform: 'uppercase', color: C.ink, fontWeight: 600 }
const srdLinkStyle = {
  fontFamily: FONT_DISPLAY, fontSize: '8.5px', letterSpacing: '0.15em', textTransform: 'uppercase',
  color: C.gold, textDecoration: 'none', marginLeft: '8px',
  opacity: 0.75,
}
const leadStyle = { fontFamily: FONT_BODY, fontSize: '13.5px', lineHeight: '1.65', color: C.inkSoft, margin: '0 0 14px' }

const checklistStyle = { display: 'flex', flexDirection: 'column', gap: '3px', margin: '4px 0 20px' }
const checkRowStyle = (checked, hovered) => ({
  display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '7px 8px',
  cursor: 'pointer',
  background: hovered ? 'rgba(139,90,43,0.06)' : 'transparent',
  border: `1px solid ${hovered ? C.ruleSoft : 'transparent'}`,
  transition: 'background 0.1s', userSelect: 'none',
})
const checkBoxStyle = (checked) => ({
  width: '14px', height: '14px', flexShrink: 0, marginTop: '2px',
  border: `1px solid ${checked ? C.gold : C.ruleSoft}`,
  background: checked ? C.gold : C.paperHi,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  transition: 'all 0.12s',
})
const checkMarkStyle = { color: C.paperHi, fontSize: '10px', lineHeight: 1, fontWeight: 700 }
const checkLabelStyle = { fontFamily: FONT_BODY, fontSize: '13.5px', lineHeight: '1.5', color: C.inkSoft }
const locationRowStyle = { display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }
const locationStyle = { fontFamily: FONT_BODY, fontSize: '11px', color: C.inkFaint, fontStyle: 'italic' }
const itemLinkStyle = {
  fontFamily: FONT_DISPLAY, fontSize: '9px', color: C.gold, textDecoration: 'none',
  letterSpacing: '0.1em', flexShrink: 0,
}

const tableWrapStyle = {
  margin: '0 0 16px',
  border: `1px solid ${C.ruleSoft}`,
  background: 'rgba(253,246,227,0.45)',
  overflow: 'hidden',
}
const tableTitleStyle = {
  padding: '7px 8px 5px',
  fontFamily: FONT_DISPLAY,
  fontSize: '9px',
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  color: C.inkFaint,
  textAlign: 'center',
  borderBottom: `1px solid ${C.ruleSoft}`,
}
const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  tableLayout: 'fixed',
  fontFamily: FONT_BODY,
  fontSize: '11.5px',
  color: C.ink,
}
const thStyle = {
  padding: '5px 4px',
  background: C.rule,
  color: C.paperHi,
  fontFamily: FONT_DISPLAY,
  fontSize: '8px',
  lineHeight: 1.2,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  fontWeight: 600,
}
const trStyle = (active) => ({
  background: active ? 'rgba(184,134,43,0.22)' : 'transparent',
  boxShadow: active ? `inset 3px 0 0 ${C.gold}` : 'none',
})
const tdStyle = (active) => ({
  padding: '4px 5px',
  textAlign: 'center',
  borderTop: `1px solid ${C.ruleSoft}`,
  fontWeight: active ? 700 : 500,
})

const navRowStyle  = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '8px', borderTop: `1px solid ${C.ruleSoft}` }
const navRightStyle = { display: 'flex', gap: '8px', alignItems: 'center' }
const backBtnStyle = { fontFamily: FONT_DISPLAY, fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', padding: '5px 12px', border: `1px solid ${C.rule}`, background: 'transparent', color: C.inkFaint, cursor: 'pointer' }
const skipBtnStyle = { fontFamily: FONT_DISPLAY, fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', padding: '5px 12px', border: `1px solid ${C.rule}`, background: 'transparent', color: C.inkFaint, cursor: 'pointer' }
const continueBtnStyle = (active) => ({
  fontFamily: FONT_DISPLAY, fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase',
  padding: '5px 14px',
  border: `1px solid ${active ? C.rule : C.ruleSoft}`,
  background: active ? `linear-gradient(180deg, ${C.rule}, ${C.inkFaint})` : 'rgba(253,246,227,0.4)',
  color: active ? C.paperHi : C.inkFaint,
  cursor: active ? 'pointer' : 'default',
  transition: 'all 0.12s',
  boxShadow: active ? `inset 0 -2px 0 ${C.goldHi}` : 'none',
})
</script>
