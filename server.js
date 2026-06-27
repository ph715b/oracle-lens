import express from "express"
import cors from "cors"
import { PrismaClient } from "./src/generated/prisma/index.js"
import path from "path"
import { fileURLToPath } from "url"
// POST /api/admin/upload-image — upload card image to R2
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"

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
  // Keyword filter (handled after query for prefix matching)
  let keywordFilter = null
  if (keyword) keywordFilter = keyword.toLowerCase()

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
    filteredCards = filteredCards.filter(c =>
      c.tags.some(t => t.toLowerCase().includes(tagLower))
    )
  }

  if (keywordFilter) {
    filteredCards = filteredCards.filter(c =>
      c.keywords.some(k => k.toLowerCase().startsWith(keywordFilter))
    )
  }

  filteredTotal = filteredCards.length

  res.json({
    cards: filteredCards,
    total: filteredTotal,
    page: pageNum,
    pageSize,
    totalPages: Math.ceil(filteredTotal / pageSize),
  })
})

// ---- ADMIN ROUTES ----
app.get("/api/admin/cards-list", requireAdmin, async (req, res) => {
  const cards = await prisma.card.findMany({
    orderBy: [{ set: "asc" }, { number: "asc" }],
    select: {
      id: true, slug: true, name: true, set: true, number: true,
      types: true, rarity: true, imageUrl: true,
    }
  })
  res.json(cards)
})

// GET /api/admin/cards/:id — fetch full card data for editing
app.get("/api/admin/cards/:id", requireAdmin, async (req, res) => {
  const card = await prisma.card.findUnique({ where: { id: req.params.id } })
  if (!card) return res.status(404).json({ error: "Card not found" })
  res.json(card)
})

// GET /api/cards/:slug/printings — find all printings of the same card
app.get("/api/cards/:slug/printings", async (req, res) => {
  try {
    const card = await prisma.card.findUnique({
      where: { slug: req.params.slug },
      select: { name: true, baseName: true, id: true }
    })
    if (!card) return res.status(404).json({ error: "Card not found" })

    const searchName = card.baseName || card.name

    const printings = await prisma.card.findMany({
      where: {
        OR: [
          { baseName: searchName },
          { name: searchName },
        ]
      },
      select: {
        id: true, slug: true, name: true,
        set: true, setName: true, number: true,
        rarity: true, variant: true, imageUrl: true,
      },
      orderBy: [{ set: "asc" }, { number: "asc" }]
    })

    res.json(printings)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// POST /api/admin/bulk-import — import multiple cards at once
app.post("/api/admin/bulk-import", requireAdmin, async (req, res) => {
  try {
    const cards = req.body.cards
    if (!Array.isArray(cards)) return res.status(400).json({ error: "Expected cards array" })

    const results = { created: 0, updated: 0, failed: [] }
    for (const card of cards) {
      try {
        await prisma.card.upsert({
          where:  { id: card.id },
          update: card,
          create: card,
        })
        results.updated++
      } catch (e) {
        results.failed.push({ id: card.id, error: e.message })
      }
    }
    res.json(results)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// Middleware that checks the admin password from a header
function requireAdmin(req, res, next) {
  const password = req.headers["x-admin-password"]
  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Unauthorized" })
  }
  next()
}

// POST /api/admin/cards — create or update a card
app.post("/api/admin/cards", requireAdmin, async (req, res) => {
  try {
    const card = req.body
    // Upsert — create if doesn't exist, update if it does
    const result = await prisma.card.upsert({
      where:  { id: card.id },
      update: card,
      create: card,
    })
    res.json(result)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// DELETE /api/admin/cards/:id — delete a card
app.delete("/api/admin/cards/:id", requireAdmin, async (req, res) => {
  try {
    await prisma.card.delete({ where: { id: req.params.id } })
    res.json({ success: true })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId:     process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
})

app.post("/api/admin/upload-image", requireAdmin, express.raw({ type: "*/*", limit: "10mb" }), async (req, res) => {
  try {
    const slug = req.query.slug
    const ext  = req.query.ext || "png"
    if (!slug) return res.status(400).json({ error: "Missing slug" })

    const key = `cards/${slug}.${ext}`
    const contentType = {
      png:  "image/png",
      jpg:  "image/jpeg",
      jpeg: "image/jpeg",
      webp: "image/webp",
      avif: "image/avif",
    }[ext.toLowerCase()] || "image/png"

    await s3.send(new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET,
      Key: key,
      Body: req.body,
      ContentType: contentType,
    }))

    const url = `${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${key}`
    res.json({ url })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
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