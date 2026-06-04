const API_URL = import.meta.env.PROD ? "/api" : "http://localhost:3001/api"

export async function getCards({ name, type, domain, rarity, set, sortBy, order } = {}) {
  const params = new URLSearchParams()
  if (name)    params.append("name", name)
  if (type)    params.append("type", type)
  if (domain)  params.append("domain", domain)
  if (rarity)  params.append("rarity", rarity)
  if (set)     params.append("set", set)
  if (sortBy)  params.append("sortBy", sortBy)
  if (order)   params.append("order", order)

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