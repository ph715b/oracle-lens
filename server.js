import express from "express"
import cors from "cors"
import { PrismaClient } from "./src/generated/prisma/index.js"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const prisma = new PrismaClient()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

// ---- API ROUTES (must come BEFORE static files) ----

app.get("/api/cards", async (req, res) => {
  const cards = await prisma.card.findMany()
  res.json(cards)
})

app.get("/api/cards/:slug", async (req, res) => {
  const card = await prisma.card.findUnique({
    where: { slug: req.params.slug }
  })
  if (!card) return res.status(404).json({ error: "Card not found" })
  res.json(card)
})

app.get("/api/search", async (req, res) => {
  const { name, type, domain, rarity, set } = req.query
  const cards = await prisma.card.findMany({
    where: {
      name:    name   ? { contains: name, mode: "insensitive" } : undefined,
      types:   type   ? { has: type }                           : undefined,
      rarity:  rarity ? { equals: rarity }                      : undefined,
      set:     set    ? { equals: set }                         : undefined,
      domains: domain ? { has: domain }                         : undefined,
    }
  })
  res.json(cards)
})

app.get("/api/sets", async (req, res) => {
  const sets = await prisma.set.findMany()
  res.json(sets)
})

// ---- SERVE REACT APP ----
// Static files served from dist
app.use(express.static(path.join(__dirname, "dist")))

// Catch-all — send React app for any other route
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"))
})

app.listen(PORT, () => {
  console.log(`✅ Oracle Lens API running at http://localhost:${PORT}`)
})