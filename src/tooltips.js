// SRD 5.1 explanations for every field on the sheet.

export const SRD_TIPS = {
  'Character Name': "Your character's name — the legend they will become.",
  'Class & Level': 'Your class defines what your character can do (Fighter, Wizard, Rogue, etc.). Level (1–20) reflects experience and grants new features, hit points, and proficiency bonus.',
  'Class': 'Your character\'s vocation (Fighter, Wizard, Rogue, Cleric, etc.). Class determines hit die, proficiencies, features, and — for casters — spellcasting ability.',
  'Level': 'Your character\'s level (1–20). Each level grants hit points, often new class features, and increases your proficiency bonus at thresholds (5, 9, 13, 17).',
  'Race': "Your character's ancestry (Human, Elf, Dwarf, Halfling, Dragonborn, Gnome, Half-Elf, Half-Orc, Tiefling). Race grants ability score increases, traits, and often a speed and language.",
  'Background': 'A snapshot of your life before adventuring (Acolyte, Criminal, Folk Hero, Noble, Sage, Soldier, etc.). Grants two skill proficiencies, often tool/language proficiencies, equipment, and a unique feature.',
  'Alignment': 'Your moral and ethical compass: a combination of Lawful/Neutral/Chaotic and Good/Neutral/Evil (e.g. Chaotic Good, Lawful Neutral, True Neutral).',
  'Experience': 'Experience Points (XP) earned from overcoming challenges. Track your XP to know when you advance to the next level (300 XP = level 2, 900 = level 3, etc.).',
  'Player': "The name of the player running this character — that's you!",

  'Inspiration': "A boon awarded by the DM for great roleplay. Spend it before any d20 roll to gain advantage on that roll. You either have it or you don't — it doesn't stack.",
  'Proficiency Bonus': "Added to ability checks, saving throws, and attack rolls you're proficient in. Scales with level: +2 (1–4), +3 (5–8), +4 (9–12), +5 (13–16), +6 (17–20).",
  'Armor Class': 'How hard you are to hit. An attacker must roll equal to or higher than your AC to hit you. Base AC = 10 + Dex modifier (modified by armor and shields).',
  'Initiative': 'Determines turn order in combat. Roll d20 + Dex modifier at the start of combat; act in descending order.',
  'Speed': 'Distance in feet you can move on your turn (typically 30 ft. for most races, 25 for dwarves and halflings).',

  'Hit Point Maximum': 'Your total HP at full health. At level 1: max of your hit die + Con modifier. Each level after, add a roll (or average) of your hit die + Con modifier.',
  'Current Hit Points': 'Your hit points right now. Damage subtracts; healing adds (up to your maximum). At 0 HP, you fall unconscious and start making death saves.',
  'Temporary Hit Points': "Bonus HP from spells or features (e.g. False Life). Damage depletes these first. They don't stack — keep the higher value.",

  'Total': 'Total Hit Dice equals your character level. The die size depends on class (d6 Sorcerer/Wizard, d8 Bard/Cleric/Druid/Monk/Rogue/Warlock, d10 Fighter/Paladin/Ranger, d12 Barbarian).',
  'Hit Dice': 'Spend during a short rest to recover HP (roll the die + add Con modifier per die spent). Regain half (rounded up) on a long rest.',
  'Death Saves': 'When at 0 HP at the start of your turn, roll a d20. 10+ is a success, below 10 is a failure. 3 successes = stable; 3 failures = death. A natural 1 counts as 2 failures; a natural 20 means you regain 1 HP.',

  'Strength':     'Measures physical power, athletic training, and brute force. Affects melee attacks, Athletics, and weight you can carry.',
  'Dexterity':    'Measures agility, reflexes, and balance. Affects AC (light/medium armor), Initiative, ranged attacks, Acrobatics, Sleight of Hand, and Stealth.',
  'Constitution': 'Measures health, stamina, and vital force. Affects Hit Points and Concentration checks for spells.',
  'Intelligence': 'Measures mental acuity, recall, and analytical reasoning. Affects Arcana, History, Investigation, Nature, and Religion.',
  'Wisdom':       'Measures attunement to your surroundings and intuition. Affects Animal Handling, Insight, Medicine, Perception, and Survival.',
  'Charisma':     'Measures force of personality, persuasiveness, and leadership. Affects Deception, Intimidation, Performance, and Persuasion.',

  'Saving Throws': "A roll to resist a spell, trap, or other effect. Roll d20 + ability modifier (+ proficiency if you're proficient in that save). Each class is proficient in two saves.",

  'Skills': 'Apply ability checks to specific tasks. If proficient in a skill, add your proficiency bonus to the d20 + ability modifier roll.',
  'Acrobatics':       'Dex check — staying on your feet, balancing, tumbling, escaping a grapple.',
  'Animal Handling':  'Wis check — calming an animal, intuiting its intentions, controlling a mount in tough conditions.',
  'Arcana':           'Int check — recalling lore about spells, magic items, eldritch symbols, and arcane traditions.',
  'Athletics':        'Str check — climbing, jumping, swimming in difficult conditions, grappling.',
  'Deception':        'Cha check — convincingly hiding the truth: fast talk, disguise, misdirection.',
  'History':          'Int check — recalling lore about historical events, legendary people, ancient kingdoms, recent wars.',
  'Insight':          'Wis check — determining the true intentions of a creature; spotting a lie or predicting next move.',
  'Intimidation':     'Cha check — influencing through threats, hostile actions, or physical violence.',
  'Investigation':    'Int check — looking for clues, deducing the location of a hidden object, or making inferences from evidence.',
  'Medicine':         'Wis check — stabilizing a dying companion or diagnosing an illness.',
  'Nature':           'Int check — recalling lore about terrain, plants, animals, weather, and natural cycles.',
  'Perception':       'Wis check — spotting, hearing, or otherwise detecting the presence of something.',
  'Performance':      'Cha check — delighting an audience with music, dance, acting, storytelling, or other entertainment.',
  'Persuasion':       'Cha check — influencing others with tact, social grace, or good nature (without resorting to deceit).',
  'Religion':         'Int check — recalling lore about deities, rites and prayers, religious hierarchies, holy symbols.',
  'Sleight of Hand':  'Dex check — pickpocketing, planting something on someone, palming an object, picking a lock.',
  'Stealth':          'Dex check — concealing yourself from enemies, slinking past guards, sneaking up on someone.',
  'Survival':         'Wis check — following tracks, hunting wild game, guiding through wastes, predicting weather.',

  'Passive Wisdom (Perception)': 'Your passive Perception score equals 10 + your Perception bonus. Used by the DM to detect hidden creatures or things without you actively searching.',

  'Attacks & Spellcasting': 'Your weapons, attacks, and offensive spells. Attack roll: d20 + ability mod + proficiency (if proficient with the weapon). Damage: weapon die + ability mod.',
  'Name': 'The weapon, attack, or spell name (e.g. Longsword, Shortbow, Fire Bolt).',
  'Atk Bonus': 'Total bonus added to your d20 attack roll: ability modifier + proficiency bonus (if proficient) + magic bonuses.',
  'Damage / Type': 'Damage dice and type (e.g. "1d8+3 slashing", "2d6 fire"). Damage type matters for resistances, immunities, and vulnerabilities.',

  'Equipment': 'Everything your character carries. Track weight if your DM uses encumbrance rules.',
  'CP': 'Copper Pieces. 10 cp = 1 sp. The lowest denomination of currency.',
  'SP': 'Silver Pieces. 10 sp = 1 gp. Common laborer\'s wages.',
  'EP': 'Electrum Pieces. 1 ep = 5 sp. A rare half-gold coin.',
  'GP': 'Gold Pieces. The standard currency. 1 gp = a day\'s comfortable lodging.',
  'PP': 'Platinum Pieces. 1 pp = 10 gp. Wealth of nobility.',

  'Other Proficiencies & Languages': "Armor, weapons, and tools you're trained in (granted by class, race, and background), plus languages you can speak, read, and write.",

  'Features & Traits': "Class features, racial traits, feats, and other special abilities. Reference these often — they're what makes your character unique.",

  'Personality Traits': 'Two short phrases describing how your character behaves (e.g. "I quote sacred texts in conversation," "I always have a plan for what to do when things go wrong").',
  'Ideals': 'The principles your character believes in — what drives them. Tied to your alignment (e.g. Honor, Knowledge, Freedom, Greater Good).',
  'Bonds': 'Connections to people, places, or events that anchor your character (e.g. "I would die to recover an ancient relic of my faith").',
  'Flaws': 'A weakness or vice that could be exploited (e.g. "I have a weakness for the vices of the city, especially hard drink").',

  'Character Appearance': 'How your character looks. Specifics make the character memorable.',
  'Age': "Your character's age in years. Different races mature and age at different rates.",
  'Height': 'How tall your character stands.',
  'Weight': "Your character's body weight.",
  'Eyes': 'Eye color — or other unusual eye features.',
  'Skin': 'Skin color and complexion.',
  'Hair': 'Hair color, length, and style (or lack thereof).',

  'Allies & Organizations': 'Groups, factions, friends, and contacts your character has connections to. Note your standing or rank.',
  'Faction': 'The name of a major organization you belong to (e.g. Harpers, Order of the Gauntlet, Zhentarim).',

  'Additional Features & Traits': 'Overflow from page 1 — magic items, secondary class features, optional rule benefits.',

  'Character Backstory': "The story of your character's life before adventuring — family, formative events, why they took up the adventurer's life.",

  'Treasure': 'Significant non-coin loot: gemstones, art objects, magical items, rare materials, deeds, etc.',

  'Spellcasting': 'Spells let you alter reality. Casters get a spellcasting class, an ability that powers their spells, a save DC enemies must beat, and an attack bonus for spell attacks.',
  'Spellcasting Class': 'The class you cast as. If you multiclass, each spellcasting class is tracked separately for spells known/prepared.',
  'Spellcasting Ability': 'The ability used to cast (Int = Wizard/Artificer, Wis = Cleric/Druid/Ranger, Cha = Bard/Paladin/Sorcerer/Warlock).',
  'Spell Save DC': '8 + proficiency bonus + spellcasting ability modifier. The number enemies must beat on saves against your spells.',
  'Spell Attack Bonus': 'Proficiency bonus + spellcasting ability modifier. Added to d20 attack rolls for spells like Fire Bolt or Eldritch Blast.',
}

export function lookupTip(text) {
  if (text == null) return null
  const key = String(text).replace(/[❦✦·]/g, '').trim()
  return SRD_TIPS[key] || null
}
