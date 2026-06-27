const API_URL = import.meta.env.PROD ? "/api" : "http://localhost:3001/api"

export async function getCards(filters = {}) {
  const params = new URLSearchParams()
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "" && value !== null) {
      if (Array.isArray(value)) {
        if (value.length > 0) params.append(key, value.join(","))
      } else {
        params.append(key, value)
      }
    }
  })
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

export async function searchCards(filters = {}) {
  const params = new URLSearchParams()
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "" && value !== null) {
      if (Array.isArray(value)) {
        if (value.length > 0) params.append(key, value.join(","))
      } else {
        params.append(key, value)
      }
    }
  })

  const res = await fetch(`${API_URL}/search?${params}`)
  return res.json()
}

export async function getCardPrintings(slug) {
  const res = await fetch(`${API_URL}/cards/${slug}/printings`)
  return res.json()
}