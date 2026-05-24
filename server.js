import express from "express"
import cors from "cors"
import { PrismaClient } from "./src/generated/prisma/index.js"

// Initialize Express and Prisma
const app = express()
const prisma = new PrismaClient()
const PORT = 3001

// Middleware
app.use(cors())                  // Allows the React frontend to talk to this server
app.use(express.json())          // Lets the server read JSON from requests

// ---- ROUTES ----

// GET /cards — return all cards
app.get("/cards", async (req, res) => {
  const cards = await prisma.card.findMany()
  res.json(cards)
})

// GET /cards/:slug — return a single card by its slug e.g. /cards/master-yi
app.get("/cards/:slug", async (req, res) => {
  const card = await prisma.card.findUnique({
    where: { slug: req.params.slug }
  })
  if (!card) return res.status(404).json({ error: "Card not found" })
  res.json(card)
})

// GET /cards/search?name=yi&type=Champion&domain=Mind
// Search and filter cards
app.get("/search", async (req, res) => {
  const { name, type, domain, rarity, set } = req.query

  const cards = await prisma.card.findMany({
    where: {
      // Only apply each filter if it was provided in the query
      name:   name   ? { contains: name, mode: "insensitive" } : undefined,
      type:   type   ? { equals: type }                        : undefined,
      rarity: rarity ? { equals: rarity }                      : undefined,
      set:    set    ? { equals: set }                         : undefined,
      // Filter by domain (checks if the domains array contains the value)
      domains: domain ? { has: domain }                        : undefined,
    }
  })
  res.json(cards)
})

// GET /sets — return all sets
app.get("/sets", async (req, res) => {
  const sets = await prisma.set.findMany()
  res.json(sets)
})

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Pix Helper API running at http://localhost:${PORT}`)
})