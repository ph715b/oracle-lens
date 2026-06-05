import express from "express"
import cors from "cors"
import { PrismaClient } from "./src/generated/prisma/index.js"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Initialize Express and Prisma
const app = express()
const prisma = new PrismaClient()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())                                               // Allows the React frontend to talk to this server
app.use(express.json())                                       // Lets the server read JSON from requests

app.use("/api", (req, res, next) => {
  res.set("Cache-Control", "no-store")
  next()
})

// ---- API ROUTES ----

// GET /api/cards — return all cards
app.get("/api/cards", async (req, res) => {
  const cards = await prisma.card.findMany()
  res.json(cards)
})

// GET /api/cards/:slug — return a single card by its slug
app.get("/api/cards/:slug", async (req, res) => {
  const card = await prisma.card.findUnique({
    where: { slug: req.params.slug }
  })
  if (!card) return res.status(404).json({ error: "Card not found" })
  res.json(card)
})

// GET /api/search?name=yi&type=Champion&domain=Mind&sortBy=name&order=asc
// Search, filter, and sort cards
app.get("/api/search", async (req, res) => {
  const {
    name, type, domain, domainMode, rarity, set,
    cardText, flavorText, keyword, tag, artist, cardNumber,
    energyCostMin, energyCostMax, energyCostExact,
    powerCostMin, powerCostMax, powerCostExact,
    mightMin, mightMax, mightExact,
    legalStandard, legalCasual,
    sortBy = "name",
    order = "asc",
    page = "1",
    limit = "60",
  } = req.query

  const sortField = {
    name:        "name",
    releaseDate: "releasedAt",
    set:         "set",
    rarity:      "rarity",
    energyCost:  "energyCost",
    powerCost:   "powerCost",
    might:       "might",
  }[sortBy] || "name"

  const pageNum  = Math.max(1, parseInt(page))
  const pageSize = Math.max(1, Math.min(120, parseInt(limit)))

  // Build the where clause dynamically
  const where = {}

  // Text searches (case insensitive contains)
  if (name)       where.name        = { contains: name,        mode: "insensitive" }
  if (cardText)   where.cardText    = { contains: cardText,    mode: "insensitive" }
  if (flavorText) where.flavorText  = { contains: flavorText,  mode: "insensitive" }
  if (artist)     where.imageArtist = { contains: artist,      mode: "insensitive" }
  if (cardNumber) where.number      = { contains: cardNumber,  mode: "insensitive" }

  // Exact matches
  if (type)   where.types  = { has: type }
  if (rarity) where.rarity = rarity
  if (set)    where.set    = set
  if (keyword) where.keywords = { has: keyword }

  // Domain — supports single or multiple (AND/OR)
  if (domain) {
    const domains = Array.isArray(domain) ? domain : domain.split(",").filter(Boolean)
    if (domains.length > 0) {
      if (domainMode === "and") {
        // Must have ALL of these domains
        where.domains = { hasEvery: domains }
      } else {
        // Must have ANY of these domains (default)
        where.domains = { hasSome: domains }
      }
    }
  }

  // Numeric filters — exact takes precedence over range
  if (energyCostExact)    where.energyCost = parseInt(energyCostExact)
  else if (energyCostMin || energyCostMax) {
    where.energyCost = {}
    if (energyCostMin) where.energyCost.gte = parseInt(energyCostMin)
    if (energyCostMax) where.energyCost.lte = parseInt(energyCostMax)
  }

  if (powerCostExact)    where.powerCost = parseInt(powerCostExact)
  else if (powerCostMin || powerCostMax) {
    where.powerCost = {}
    if (powerCostMin) where.powerCost.gte = parseInt(powerCostMin)
    if (powerCostMax) where.powerCost.lte = parseInt(powerCostMax)
  }

  if (mightExact)    where.might = parseInt(mightExact)
  else if (mightMin || mightMax) {
    where.might = {}
    if (mightMin) where.might.gte = parseInt(mightMin)
    if (mightMax) where.might.lte = parseInt(mightMax)
  }

  // Legality
  if (legalStandard === "true")  where.legalStandard = true
  if (legalStandard === "false") where.legalStandard = false
  if (legalCasual === "true")    where.legalCasual = true
  if (legalCasual === "false")   where.legalCasual = false

  const [total, cards] = await Promise.all([
    prisma.card.count({ where }),
    prisma.card.findMany({
      where,
      orderBy: { [sortField]: order },
      skip: (pageNum - 1) * pageSize,
      take: pageSize,
    })
  ])

  // Case-insensitive tag filter applied after database query
  let filteredCards = cards
  let filteredTotal = total
  if (tag) {
    const tagLower = tag.toLowerCase()
    filteredCards = cards.filter(c =>
      c.tags.some(t => t.toLowerCase().includes(tagLower))
    )
    filteredTotal = filteredCards.length
  }

  res.json({
    cards: filteredCards,
    total: filteredTotal,
    page: pageNum,
    pageSize,
    totalPages: Math.ceil(filteredTotal / pageSize),
  })
})

// GET /api/sets — return all sets
app.get("/api/sets", async (req, res) => {
  const sets = await prisma.set.findMany()
  res.json(sets)
})

// ---- SERVE REACT APP ----

// Serve the built React app (CSS, JS, etc.)
app.use(express.static(path.join(__dirname, "dist")))

// Catch-all — send React app for any non-API route (for client-side routing)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"))
})

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Oracle Lens API running at http://localhost:${PORT}`)
})