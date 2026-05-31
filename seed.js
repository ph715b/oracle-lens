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