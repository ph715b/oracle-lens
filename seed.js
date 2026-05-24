import { PrismaClient } from "./src/generated/prisma/index.js"

const prisma = new PrismaClient()

// ============================================
// CARD DATA
// Add cards here following the schema below
// ============================================
const cards = [
  {
    // ---- IDENTITY ----
    id: "OGN-001",
    slug: "master-yi",
    name: "Master Yi",

    // ---- SET INFO ----
    set: "OGN",
    setName: "Origins",
    number: "001",

    // ---- CARD DETAILS ----
    type: "Champion",
    domains: ["Mind"],
    rarity: "Rare",

    // ---- COSTS ----
    energyCost: 3,
    furyPower: 0,
    calmPower: 0,
    mindPower: 1,
    bodyPower: 0,
    chaosPower: 0,
    orderPower: 0,
    wildPower: 0,
    alternateCost: false,

    // ---- STATS ----
    might: 4,
    mightBonus: null,

    // ---- XP & LEVEL ----
    huntValue: null,
    levelThreshold: null,
    levelAbility: null,

    // ---- TEXT ----
    cardText: "Assault 2. Strike: Deal 1 damage to target unit.",
    flavorText: "The Seven Deadly Cuts.",
    keywords: ["Assault 2", "Strike"],

    // ---- VISUALS ----
    imageUrl: null,
    imageArtist: null,

    // ---- LEGALITY ----
    legalStandard: true,
    legalCasual: true,

    // ---- META ----
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
    name: "Origins Starter",
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

  // Import sets first
  for (const set of sets) {
    await prisma.set.upsert({
      where: { code: set.code },  // If set already exists, update it
      update: set,                // upsert = update OR insert
      create: set,                // so running seed twice won't duplicate data
    })
  }
  console.log(`✅ ${sets.length} sets imported`)

  // Import cards
  for (const card of cards) {
    await prisma.card.upsert({
      where: { id: card.id },
      update: card,
      create: card,
    })
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