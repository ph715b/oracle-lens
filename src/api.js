// Base URL for our API
// We use an environment variable so it's easy to swap when we deploy
const API_URL = "http://localhost:3001"

// Fetch all cards, with optional filters
export async function getCards({ name, type, domain, rarity, set } = {}) {
  // Build query string from any filters that were provided
  const params = new URLSearchParams()
  if (name)   params.append("name", name)
  if (type)   params.append("type", type)
  if (domain) params.append("domain", domain)
  if (rarity) params.append("rarity", rarity)
  if (set)    params.append("set", set)

  const res = await fetch(`${API_URL}/search?${params}`)
  return res.json()
}

// Fetch a single card by its slug
export async function getCard(slug) {
  const res = await fetch(`${API_URL}/cards/${slug}`)
  return res.json()
}

// Fetch all sets
export async function getSets() {
  const res = await fetch(`${API_URL}/sets`)
  return res.json()
}