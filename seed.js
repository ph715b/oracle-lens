import { PrismaClient } from "./src/generated/prisma/index.js"

const prisma = new PrismaClient()

// ============================================
// CARD DATA
// Add cards here following the schema below
// ============================================
const cards = [
  {
    id: "OGS-001",
    slug: "annie-fiery",
    name: "Annie, Fiery",

    set: "OGS",
    setName: "Origins - Proving Grounds",
    number: "001",

    types: ["Champion", "Unit"],
    domains: ["Fury"],
    tags: ["Annie", "Noxus"],
    rarity: "Epic",

    energyCost: 5,
    furyPower: 1,
    calmPower: 0,
    mindPower: 0,
    bodyPower: 0,
    chaosPower: 0,
    orderPower: 0,
    wildPower: 0,
    alternateCost: false,

    might: 4,
    mightBonus: null,

    huntValue: null,
    levelThreshold: null,
    levelAbility: null,

    cardText: "Your spells and abilities deal 1 Bonus Damage. (Each instance of damage the spell deals is increased by 1.)",
    flavorText: "\"I never play with matches.\"",
    keywords: [],

    imageUrl: "https://pub-6c0cf07bed80457da2e86e2baf433845.r2.dev/cards/annie-fiery.png",
    imageArtist: "Polar Engine Studio",

    legalStandard: true,
    legalCasual: true,

    releasedAt: new Date("2025-10-01"),
  },

  {
    id: "OGS-002",
    slug: "firestorm",
    name: "Firestorm",

    set: "OGS",
    setName: "Origins - Proving Grounds",
    number: "002",

    types: ["Spell"],
    domains: ["Fury"],
    tags: [],
    rarity: "Uncommon",

    energyCost: 6,
    furyPower: 1,
    calmPower: 0,
    mindPower: 0,
    bodyPower: 0,
    chaosPower: 0,
    orderPower: 0,
    wildPower: 0,
    alternateCost: false,

    might: null,
    mightBonus: null,

    huntValue: null,
    levelThreshold: null,
    levelAbility: null,

    cardText: "Deal 3 to all enemy units at a battlefield.",
    flavorText: "\"Eeny, meeny, miny, burn!\"",
    keywords: [],

    imageUrl: "https://pub-6c0cf07bed80457da2e86e2baf433845.r2.dev/cards/firestorm.png",
    imageArtist: "Kudos Productions",

    legalStandard: true,
    legalCasual: true,

    releasedAt: new Date("2025-10-01"),
  },

  {
    id: "OGS-003",
    slug: "incinerate",
    name: "Incinerate",

    set: "OGS",
    setName: "Origins - Proving Grounds",
    number: "003",

    types: ["Spell"],
    domains: ["Fury"],
    tags: [],
    rarity: "Common",

    energyCost: 2,
    furyPower: 0,
    calmPower: 0,
    mindPower: 0,
    bodyPower: 0,
    chaosPower: 0,
    orderPower: 0,
    wildPower: 0,
    alternateCost: false,

    might: null,
    mightBonus: null,

    huntValue: null,
    levelThreshold: null,
    levelAbility: null,

    cardText: "[Action] (Play on your turn or in showdowns.) Deal 2 to a unit at a battlefield.",
    flavorText: "\"You smell like burning!\" -Annie",
    keywords: ["Action"],

    imageUrl: "https://pub-6c0cf07bed80457da2e86e2baf433845.r2.dev/cards/incinerate.png",
    imageArtist: "Kudos Productions",

    legalStandard: true,
    legalCasual: true,

    releasedAt: new Date("2025-10-01"),
  },

  {
    id: "OGS-004",
    slug: "master-yi-meditative",
    name: "Master Yi, Meditative",

    set: "OGS",
    setName: "Origins - Proving Grounds",
    number: "004",

    types: ["Champion", "Unit"],
    domains: ["Calm"],
    tags: ["Master Yi", "Ionia"],
    rarity: "Rare",

    energyCost: 5,
    furyPower: 0,
    calmPower: 1,
    mindPower: 0,
    bodyPower: 0,
    chaosPower: 0,
    orderPower: 0,
    wildPower: 0,
    alternateCost: false,

    might: 4,
    mightBonus: null,

    huntValue: null,
    levelThreshold: null,
    levelAbility: null,

    cardText: "While you have 8+ runes, I have +4{M}.",
    flavorText: "\"Anger gives motivation without purpose.\"",
    keywords: [],

    imageUrl: "https://pub-6c0cf07bed80457da2e86e2baf433845.r2.dev/cards/master-yi-meditative.png",
    imageArtist: "Kudos Productions",

    legalStandard: true,
    legalCasual: true,

    releasedAt: new Date("2025-10-01"),
  },

  {
    id: "OGS-005",
    slug: "zephyr-sage",
    name: "Zephyr Sage",

    set: "OGS",
    setName: "Origins - Proving Grounds",
    number: "005",

    types: ["Unit"],
    domains: ["Calm"],
    tags: ["Ionia", "Bird"],
    rarity: "Uncommon",

    energyCost: 6,
    furyPower: 0,
    calmPower: 1,
    mindPower: 0,
    bodyPower: 0,
    chaosPower: 0,
    orderPower: 0,
    wildPower: 0,
    alternateCost: false,

    might: 6,
    mightBonus: null,

    huntValue: null,
    levelThreshold: null,
    levelAbility: null,

    cardText: "[Shield] (+1{M} while I'm a defender.)",
    flavorText: "\"A true master is an eternal student\" -Master Yi",
    keywords: ["Shield"],

    imageUrl: "https://pub-6c0cf07bed80457da2e86e2baf433845.r2.dev/cards/zephyr-sage.png",
    imageArtist: "Six More Vodka",

    legalStandard: true,
    legalCasual: true,

    releasedAt: new Date("2025-10-01"),
  },

  {
    id: "OGS-006",
    slug: "lux-illuminated",
    name: "Lux, Illuminated",

    set: "OGS",
    setName: "Origins - Proving Grounds",
    number: "006",

    types: ["Champion", "Unit"],
    domains: ["Mind"],
    tags: ["Lux", "Demacia"],
    rarity: "Rare",

    energyCost: 6,
    furyPower: 0,
    calmPower: 0,
    mindPower: 1,
    bodyPower: 0,
    chaosPower: 0,
    orderPower: 0,
    wildPower: 0,
    alternateCost: false,

    might: 5,
    mightBonus: null,

    huntValue: null,
    levelThreshold: null,
    levelAbility: null,

    cardText: "When you play a spell that costs {5} or more, give me +3{M} this turn.",
    flavorText: "\"No more holding back!\"",
    keywords: [],

    imageUrl: "https://pub-6c0cf07bed80457da2e86e2baf433845.r2.dev/cards/lux-illuminated.png",
    imageArtist: "Six More Vodka",

    legalStandard: true,
    legalCasual: true,

    releasedAt: new Date("2025-10-01"),
  },

  {
    id: "OGS-007",
    slug: "garen-rugged",
    name: "Garen, Rugged",

    set: "OGS",
    setName: "Origins - Proving Grounds",
    number: "007",

    types: ["Champion", "Unit"],
    domains: ["Body"],
    tags: ["Garen", "Demacia", "Elite"],
    rarity: "Rare",

    energyCost: 6,
    furyPower: 0,
    calmPower: 0,
    mindPower: 0,
    bodyPower: 1,
    chaosPower: 0,
    orderPower: 0,
    wildPower: 0,
    alternateCost: false,

    might: 5,
    mightBonus: null,

    huntValue: null,
    levelThreshold: null,
    levelAbility: null,

    cardText: "Assault 2, Shield 2 (+2{M} while I'm an attacker or defender.)",
    flavorText: "\"Fear is the first of many foes.\"",
    keywords: ["Assault 2", "Shield 2"],

    imageUrl: "https://pub-6c0cf07bed80457da2e86e2baf433845.r2.dev/cards/garen-rugged.png",
    imageArtist: "Six More Vodka",

    legalStandard: true,
    legalCasual: true,

    releasedAt: new Date("2025-10-01"),
  },

  {
    id: "OGS-008",
    slug: "gentlemens-duel",
    name: "Gentlemen's Duel",

    set: "OGS",
    setName: "Origins - Proving Grounds",
    number: "008",

    types: ["Spell"],
    domains: ["Body"],
    tags: [],
    rarity: "Common",

    energyCost: 6,
    furyPower: 0,
    calmPower: 0,
    mindPower: 0,
    bodyPower: 1,
    chaosPower: 0,
    orderPower: 0,
    wildPower: 0,
    alternateCost: false,

    might: null,
    mightBonus: null,

    huntValue: null,
    levelThreshold: null,
    levelAbility: null,

    cardText: "[Action] (Play on your turn or in showdowns.) Give a friendly unit +3{M} this turn. Then choose an enemy unit. They deal damage equal to their Mights to each other.",
    flavorText: "A proper and formal way to kill your enemies.",
    keywords: ["Action"],

    imageUrl: "https://pub-6c0cf07bed80457da2e86e2baf433845.r2.dev/cards/gentlemens-duel.png",
    imageArtist: "Kudos Productions",

    legalStandard: true,
    legalCasual: true,

    releasedAt: new Date("2025-10-01"),
  },

  {
    id: "OGS-009",
    slug: "master-yi-honed",
    name: "Master Yi, Honed",

    set: "OGS",
    setName: "Origins - Proving Grounds",
    number: "009",

    types: ["Champion", "Unit"],
    domains: ["Body"],
    tags: ["Master Yi", "Ionia"],
    rarity: "Epic",

    energyCost: 7,
    furyPower: 0,
    calmPower: 0,
    mindPower: 0,
    bodyPower: 1,
    chaosPower: 0,
    orderPower: 0,
    wildPower: 0,
    alternateCost: false,

    might: 6,
    mightBonus: null,

    huntValue: null,
    levelThreshold: null,
    levelAbility: null,

    cardText: "[Ganking] (I can move from battlefield to battlefield.) I enter ready.",
    flavorText: "\"The focused mind can pierce through stone.\"",
    keywords: ["Ganking"],

    imageUrl: "https://pub-6c0cf07bed80457da2e86e2baf433845.r2.dev/cards/master-yi-honed.png",
    imageArtist: "Kudos Productions",

    legalStandard: true,
    legalCasual: true,

    releasedAt: new Date("2025-10-01"),
  },

  {
    id: "OGS-010",
    slug: "annie-stubborn",
    name: "Annie, Stubborn",

    set: "OGS",
    setName: "Origins - Proving Grounds",
    number: "010",

    types: ["Champion", "Unit"],
    domains: ["Chaos"],
    tags: ["Annie", "Noxus"],
    rarity: "Rare",

    energyCost: 4,
    furyPower: 0,
    calmPower: 0,
    mindPower: 0,
    bodyPower: 0,
    chaosPower: 1,
    orderPower: 0,
    wildPower: 0,
    alternateCost: false,

    might: 3,
    mightBonus: null,

    huntValue: null,
    levelThreshold: null,
    levelAbility: null,

    cardText: "When you play me, return a spell from your trash to your hand.",
    flavorText: "\"I want a turn!\"",
    keywords: [],

    imageUrl: "https://pub-6c0cf07bed80457da2e86e2baf433845.r2.dev/cards/annie-stubborn.png",
    imageArtist: "League Splash Team",

    legalStandard: true,
    legalCasual: true,

    releasedAt: new Date("2025-10-01"),
  },

  {
    id: "OGS-011",
    slug: "flash",
    name: "Flash",

    set: "OGS",
    setName: "Origins - Proving Grounds",
    number: "011",

    types: ["Spell"],
    domains: ["Chaos"],
    tags: [],
    rarity: "Common",

    energyCost: 2,
    furyPower: 0,
    calmPower: 0,
    mindPower: 0,
    bodyPower: 0,
    chaosPower: 0,
    orderPower: 0,
    wildPower: 0,
    alternateCost: false,

    might: null,
    mightBonus: null,

    huntValue: null,
    levelThreshold: null,
    levelAbility: null,

    cardText: "[Reaction] (Play any time, even before spells and abilities resolve.) Move up to 2 friendly units to base.",
    flavorText: "It's not running away. It's strategic repositioning.",
    keywords: ["Reaction"],

    imageUrl: "https://pub-6c0cf07bed80457da2e86e2baf433845.r2.dev/cards/flash.png",
    imageArtist: "Sugar Free",

    legalStandard: true,
    legalCasual: true,

    releasedAt: new Date("2025-10-01"),
  },

  {
    id: "OGS-012",
    slug: "blast-of-power",
    name: "Blast of Power",

    set: "OGS",
    setName: "Origins - Proving Grounds",
    number: "012",

    types: ["Spell"],
    domains: ["Order"],
    tags: [],
    rarity: "Common",

    energyCost: 6,
    furyPower: 0,
    calmPower: 0,
    mindPower: 0,
    bodyPower: 0,
    chaosPower: 0,
    orderPower: 1,
    wildPower: 0,
    alternateCost: false,

    might: null,
    mightBonus: null,

    huntValue: null,
    levelThreshold: null,
    levelAbility: null,

    cardText: "[Action] (Play on your turn or in showdowns.) Kill a unit at a battlefield.",
    flavorText: "\"Illuminate the enemy!\" —Lux",
    keywords: ["Action"],

    imageUrl: "https://pub-6c0cf07bed80457da2e86e2baf433845.r2.dev/cards/blast-of-power.png",
    imageArtist: "Kudos Productions",

    legalStandard: true,
    legalCasual: true,

    releasedAt: new Date("2025-10-01"),
  },

  {
    id: "OGS-013",
    slug: "garen-commander",
    name: "Garen, Commander",

    set: "OGS",
    setName: "Origins - Proving Grounds",
    number: "013",

    types: ["Champion", "Unit"],
    domains: ["Order"],
    tags: ["Garen", "Demacia", "Elite"],
    rarity: "Epic",

    energyCost: 6,
    furyPower: 0,
    calmPower: 0,
    mindPower: 0,
    bodyPower: 0,
    chaosPower: 0,
    orderPower: 1,
    wildPower: 0,
    alternateCost: false,

    might: 5,
    mightBonus: null,

    huntValue: null,
    levelThreshold: null,
    levelAbility: null,

    cardText: "Other friendly units have +1{M} here.",
    flavorText: "\"For Demacia!\"",
    keywords: [],

    imageUrl: "https://pub-6c0cf07bed80457da2e86e2baf433845.r2.dev/cards/garen-commander.png",
    imageArtist: "Six More Vodka",

    legalStandard: true,
    legalCasual: true,

    releasedAt: new Date("2025-10-01"),
  },

  {
    id: "OGS-014",
    slug: "lux-crownguard",
    name: "Lux, Crownguard",

    set: "OGS",
    setName: "Origins - Proving Grounds",
    number: "014",

    types: ["Champion", "Unit"],
    domains: ["Order"],
    tags: ["Lux", "Demacia"],
    rarity: "Epic",

    energyCost: 4,
    furyPower: 0,
    calmPower: 0,
    mindPower: 0,
    bodyPower: 0,
    chaosPower: 0,
    orderPower: 0,
    wildPower: 0,
    alternateCost: false,

    might: 2,
    mightBonus: null,

    huntValue: null,
    levelThreshold: null,
    levelAbility: null,

    cardText: "{T}: [Reaction] — Add 2. Use only to play spells. (Abilities that add resources can't be reacted to.)",
    flavorText: "\"I've been hiding my light long enough.\"",
    keywords: ["Reaction"],

    imageUrl: "https://pub-6c0cf07bed80457da2e86e2baf433845.r2.dev/cards/lux-crownguard.png",
    imageArtist: "Envar Studio",

    legalStandard: true,
    legalCasual: true,

    releasedAt: new Date("2025-10-01"),
  },

  {
    id: "OGS-015",
    slug: "recruit-the-vanguard",
    name: "Recruit the Vanguard",

    set: "OGS",
    setName: "Origins - Proving Grounds",
    number: "015",

    types: ["Spell"],
    domains: ["Order"],
    tags: [],
    rarity: "Uncommon",

    energyCost: 6,
    furyPower: 0,
    calmPower: 0,
    mindPower: 0,
    bodyPower: 0,
    chaosPower: 0,
    orderPower: 0,
    wildPower: 0,
    alternateCost: false,

    might: null,
    mightBonus: null,

    huntValue: null,
    levelThreshold: null,
    levelAbility: null,

    cardText: "[Action] (Play on your turn or in showdowns.) Play four 1{M} Recruit unit tokens. (They can be played to your base or to battlefields you control.)",
    flavorText: "\"My heart and sword always for Demacia.\" —Garen",
    keywords: ["Action"],

    imageUrl: "https://pub-6c0cf07bed80457da2e86e2baf433845.r2.dev/cards/recruit-the-vanguard.png",
    imageArtist: "Kudos Productions",

    legalStandard: true,
    legalCasual: true,

    releasedAt: new Date("2025-10-01"),
  },

  {
    id: "OGS-016",
    slug: "vanguard-attendant",
    name: "Vanguard Attendant",

    set: "OGS",
    setName: "Origins - Proving Grounds",
    number: "016",

    types: ["Unit"],
    domains: ["Order"],
    tags: ["Demacia", "Elite"],
    rarity: "Common",

    energyCost: 6,
    furyPower: 0,
    calmPower: 0,
    mindPower: 0,
    bodyPower: 0,
    chaosPower: 0,
    orderPower: 1,
    wildPower: 0,
    alternateCost: false,

    might: 5,
    mightBonus: null,

    huntValue: null,
    levelThreshold: null,
    levelAbility: null,

    cardText: "I enter ready.",
    flavorText: "Even the Vanguard needs a first line of defense.",
    keywords: [],

    imageUrl: "https://pub-6c0cf07bed80457da2e86e2baf433845.r2.dev/cards/vanguard-attendant.png",
    imageArtist: "Six More Vodka",

    legalStandard: true,
    legalCasual: true,

    releasedAt: new Date("2025-10-01"),
  },

  {
    id: "OGS-017",
    slug: "dark-child-starter",
    name: "Dark Child, Starter",

    set: "OGS",
    setName: "Origins - Proving Grounds",
    number: "017",

    types: ["Legend"],
    domains: ["Fury", "Chaos"],
    tags: ["Annie"],
    rarity: "Rare",

    // Legends have no energy or power cost
    energyCost: null,
    furyPower: 0,
    calmPower: 0,
    mindPower: 0,
    bodyPower: 0,
    chaosPower: 0,
    orderPower: 0,
    wildPower: 0,
    alternateCost: false,

    might: null,
    mightBonus: null,

    huntValue: null,
    levelThreshold: null,
    levelAbility: null,

    cardText: "At the end of your turn, ready 2 runes.",
    flavorText: null,
    keywords: [],

    imageUrl: "https://pub-6c0cf07bed80457da2e86e2baf433845.r2.dev/cards/dark-child-starter.png",
    imageArtist: "Six More Vodka",

    legalStandard: true,
    legalCasual: true,

    releasedAt: new Date("2025-10-01"),
  },

  {
    id: "OGS-018",
    slug: "tibbers",
    name: "Tibbers",

    set: "OGS",
    setName: "Origins - Proving Grounds",
    number: "018",

    types: ["Signature", "Unit"],
    domains: ["Fury", "Chaos"],
    tags: ["Annie"],
    rarity: "Epic",

    energyCost: 8,
    furyPower: 2,
    calmPower: 0,
    mindPower: 0,
    bodyPower: 0,
    chaosPower: 2,
    orderPower: 0,
    wildPower: 0,
    alternateCost: true,

    might: 7,
    mightBonus: null,

    huntValue: null,
    levelThreshold: null,
    levelAbility: null,

    cardText: "When you play me, deal 3 to all units at battlefields.",
    flavorText: "\"Bear hug!\" —Annie",
    keywords: [],

    imageUrl: "https://pub-6c0cf07bed80457da2e86e2baf433845.r2.dev/cards/tibbers.png",
    imageArtist: "Polar Engine Studio",

    legalStandard: true,
    legalCasual: true,

    releasedAt: new Date("2025-10-01"),
  },

  {
    id: "OGS-019",
    slug: "wuju-bladesman-starter",
    name: "Wuju Bladesman, Starter",

    set: "OGS",
    setName: "Origins - Proving Grounds",
    number: "019",

    types: ["Legend"],
    domains: ["Calm", "Body"],
    tags: ["Master Yi"],
    rarity: "Rare",

    energyCost: null,
    furyPower: 0,
    calmPower: 0,
    mindPower: 0,
    bodyPower: 0,
    chaosPower: 0,
    orderPower: 0,
    wildPower: 0,
    alternateCost: false,

    might: null,
    mightBonus: null,

    huntValue: null,
    levelThreshold: null,
    levelAbility: null,

    cardText: "While a friendly unit defends alone, it gets +2{M}.",
    flavorText: null,
    keywords: [],

    imageUrl: "https://pub-6c0cf07bed80457da2e86e2baf433845.r2.dev/cards/wuju-bladesman-starter.png",
    imageArtist: "Grafit Studio/Quy Ho",

    legalStandard: true,
    legalCasual: true,

    releasedAt: new Date("2025-10-01"),
  },

  {
    id: "OGS-020",
    slug: "highlander",
    name: "Highlander",

    set: "OGS",
    setName: "Origins - Proving Grounds",
    number: "020",

    types: ["Signature", "Spell"],
    domains: ["Calm", "Body"],
    tags: ["Master Yi"],
    rarity: "Epic",

    energyCost: 4,
    furyPower: 0,
    calmPower: 0,
    mindPower: 0,
    bodyPower: 0,
    chaosPower: 0,
    orderPower: 0,
    wildPower: 0,
    alternateCost: false,

    might: null,
    mightBonus: null,

    huntValue: null,
    levelThreshold: null,
    levelAbility: null,

    cardText: "[Reaction] (Play any time, even before spells and abilities resolve.) Choose a friendly unit. The next time it dies this turn, recall it exhausted instead. (Send it to base. This isn't a move.)",
    flavorText: null,
    keywords: ["Reaction"],

    imageUrl: "https://pub-6c0cf07bed80457da2e86e2baf433845.r2.dev/cards/highlander.png",
    imageArtist: "Kudos Productions",

    legalStandard: true,
    legalCasual: true,

    releasedAt: new Date("2025-10-01"),
  },

  {
    id: "OGS-021",
    slug: "lady-of-luminosity-starter",
    name: "Lady of Luminosity, Starter",

    set: "OGS",
    setName: "Origins - Proving Grounds",
    number: "021",

    types: ["Legend"],
    domains: ["Mind", "Order"],
    tags: ["Lux"],
    rarity: "Rare",

    energyCost: null,
    furyPower: 0,
    calmPower: 0,
    mindPower: 0,
    bodyPower: 0,
    chaosPower: 0,
    orderPower: 0,
    wildPower: 0,
    alternateCost: false,

    might: null,
    mightBonus: null,

    huntValue: null,
    levelThreshold: null,
    levelAbility: null,

    cardText: "When you play a spell that costs {5} or more, draw 1.",
    flavorText: null,
    keywords: [],

    imageUrl: "https://pub-6c0cf07bed80457da2e86e2baf433845.r2.dev/cards/lady-of-luminosity-starter.png",
    imageArtist: "Grafit Studio/Maki Planas Meta",

    legalStandard: true,
    legalCasual: true,

    releasedAt: new Date("2025-10-01"),
  },
  {
    id: "OGS-022",
    slug: "final-spark",
    name: "Final Spark",

    set: "OGS",
    setName: "Origins - Proving Grounds",
    number: "022",

    types: ["Sagnature", "Spell"],
    domains: ["Mind", "Order"],
    tags: ["Lux"],
    rarity: "Epic",

    energyCost: 8,
    furyPower: 0,
    calmPower: 0,
    mindPower: 0,
    bodyPower: 0,
    chaosPower: 0,
    orderPower: 0,
    wildPower: 0,
    alternateCost: false,

    might: null,
    mightBonus: null,

    huntValue: null,
    levelThreshold: null,
    levelAbility: null,

    cardText: "[Action] (Play on your turn or in showdowns.) Deal 8 to a unit.",
    flavorText: null,
    keywords: ["Action"],

    imageUrl: "https://pub-6c0cf07bed80457da2e86e2baf433845.r2.dev/cards/final-spark.png",
    imageArtist: "Kudos Productions",

    legalStandard: true,
    legalCasual: true,

    releasedAt: new Date("2025-10-01"),
  },
  
  {
    id: "OGS-023",
    slug: "might-of-demacia-starter",
    name: "Might of Demacia, Starter",

    set: "OGS",
    setName: "Origins - Proving Grounds",
    number: "023",

    types: ["Legend"],
    domains: ["Body", "Order"],
    tags: ["Garen"],
    rarity: "Rare",

    energyCost: null,
    furyPower: 0,
    calmPower: 0,
    mindPower: 0,
    bodyPower: 0,
    chaosPower: 0,
    orderPower: 0,
    wildPower: 0,
    alternateCost: false,

    might: null,
    mightBonus: null,

    huntValue: null,
    levelThreshold: null,
    levelAbility: null,

    cardText: "When you conquer, if you have 4+ units at that battlefield, draw 2.",
    flavorText: null,
    keywords: [],

    imageUrl: "https://pub-6c0cf07bed80457da2e86e2baf433845.r2.dev/cards/might-of-demacia-starter.png",
    imageArtist: "Six More Vodka",

    legalStandard: true,
    legalCasual: true,

    releasedAt: new Date("2025-10-01"),
  },

  {
    id: "OGS-024",
    slug: "decisive-strike",
    name: "Decisive Strike",

    set: "OGS",
    setName: "Origins - Proving Grounds",
    number: "024",

    types: ["Signature", "Spell"],
    domains: ["Body", "Order"],
    tags: ["Garen"],
    rarity: "Epic",

    energyCost: 5,
    furyPower: 0,
    calmPower: 0,
    mindPower: 0,
    bodyPower: 1,
    chaosPower: 0,
    orderPower: 1,
    wildPower: 0,
    alternateCost: true,

    might: null,
    mightBonus: null,

    huntValue: null,
    levelThreshold: null,
    levelAbility: null,

    cardText: "[Action] (Play on your turn or in showdowns.) Give friendly units +2{M} this turn.",
    flavorText: null,
    keywords: ["Action"],

    imageUrl: "https://pub-6c0cf07bed80457da2e86e2baf433845.r2.dev/cards/decisive-strike.png",
    imageArtist: "Kudos Productions",

    legalStandard: true,
    legalCasual: true,

    releasedAt: new Date("2025-10-01"),
  },
]

// ============================================
// SET DATA
// Add sets here
// ============================================
const sets = [
  {
    code: "OGN",
    name: "Origins",
    totalCards: 298,
    releasedAt: new Date("2025-10-01"),
  },
  {
    code: "OGS",
    name: "Origins - Proving Grounds",
    totalCards: 24,
    releasedAt: new Date("2025-10-01"),
  },
  {
    code: "SFD",
    name: "Spiritforged",
    totalCards: 221,
    releasedAt: new Date("2026-02-01"),
  },
  {
    code: "UNL",
    name: "Unleashed",
    totalCards: 219,
    releasedAt: new Date("2026-05-01"),
  },
]

// ============================================
// SEED FUNCTION
// Runs the import into the database
// ============================================
async function main() {
  console.log("🌱 Seeding database...")

  // Wipe existing data first so seed.js is always the source of truth
  // Cards must be deleted before sets due to relationships
  console.log("🗑️ Clearing existing data...")
  await prisma.card.deleteMany()
  await prisma.set.deleteMany()

  // Import sets
  for (const set of sets) {
    await prisma.set.create({ data: set })
  }
  console.log(`✅ ${sets.length} sets imported`)

  // Import cards
  for (const card of cards) {
    await prisma.card.create({ data: card })
  }
  console.log(`✅ ${cards.length} cards imported`)

  console.log("🎉 Seed complete!")
}

// Run the seed and handle errors
main()
  .catch((e) => {
    console.error("❌ Seed failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })