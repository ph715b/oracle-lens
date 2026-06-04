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
  const { name, type, domain, rarity, set, sortBy = "name", order = "asc" } = req.query

  // Map frontend sort options to actual database fields
  const sortField = {
    name:        "name",
    releaseDate: "releasedAt",
    set:         "set",
    rarity:      "rarity",
    energyCost:  "energyCost",
    powerCost:   "powerCost",
    might:       "might",
  }[sortBy] || "name"

  const cards = await prisma.card.findMany({
    where: {
      name:    name   ? { contains: name, mode: "insensitive" } : undefined,
      types:   type   ? { has: type }                           : undefined,
      rarity:  rarity ? { equals: rarity }                      : undefined,
      set:     set    ? { equals: set }                         : undefined,
      domains: domain ? { has: domain }                         : undefined,
    },
    orderBy: { [sortField]: order }
  })
  res.json(cards)
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