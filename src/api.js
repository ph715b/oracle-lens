// Base URL for the API
// In production it's the same domain, in development it's localhost
const API_URL = import.meta.env.PROD ? "" : "http://localhost:3001"

// Fetch all cards
export async function getCards({ name, type, domain, rarity, set } = {}) {
  const params = new URLSearchParams()
  if (name)   params.append("name", name)
  if (type)   params.append("type", type)
  if (domain) params.append("domain", domain)
  if (rarity) params.append("rarity", rarity)
  if (set)    params.append("set", set)

  const res = await fetch(`${API_URL}/search?${params}`)
  return res.json()
}

export async function getCard(slug) {
  const res = await fetch(`${API_URL}/cards/${slug}`)
  return res.json()
}

export async function getSets() {
  const res = await fetch(`${API_URL}/sets`)
  return res.json()
}