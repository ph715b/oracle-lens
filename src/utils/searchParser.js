// Parse Scryfall-style search query into structured filters

// Operator aliases — short and long forms
const FIELD_ALIASES = {
  n: "name", name: "name",
  t: "type", type: "type", types: "type",
  d: "domain", domain: "domain", domains: "domain",
  s: "set", set: "set",
  r: "rarity", rarity: "rarity",
  tag: "tag", tags: "tag",
  kw: "keyword", keyword: "keyword", keywords: "keyword",
  o: "text", oracle: "text", text: "text", cardtext: "text",
  flavor: "flavor", ft: "flavor", flavortext: "flavor",
  a: "artist", artist: "artist",
  e: "energy", energy: "energy", energycost: "energy",
  p: "power", power: "power", powercost: "power",
  m: "might", might: "might",
  num: "number", number: "number", "#": "number",
  legal: "legal",
}

const NUMERIC_FIELDS = ["energy", "power", "might"]

// Parse a query string into an array of filter tokens
export function parseQuery(query) {
  const filters = []
  let remainingText = []

  if (!query) return filters

  // Step 1: Pull out quoted strings first so they don't get split
  const tokens = []
  let current = ""
  let inQuotes = false
  let quoteChar = ""

  for (const char of query) {
    if (inQuotes) {
      if (char === quoteChar) {
        inQuotes = false
        current += char
      } else {
        current += char
      }
    } else if (char === '"' || char === "'") {
      inQuotes = true
      quoteChar = char
      current += char
    } else if (char === " ") {
      if (current) tokens.push(current)
      current = ""
    } else {
      current += char
    }
  }
  if (current) tokens.push(current)

  // Step 2: Process each token
  for (const token of tokens) {
    // Match: optional minus, field, operator, value
    // Operators: >=, <=, !=, >, <, :
    const match = token.match(/^(-)?(\w+)(>=|<=|!=|>|<|:)(.+)$/)

    if (match) {
      const [, negate, rawField, operator, rawValue] = match
      const field = FIELD_ALIASES[rawField.toLowerCase()]

      if (field) {
        // Strip surrounding quotes
        const value = rawValue.replace(/^["']|["']$/g, "")

        filters.push({
          field,
          operator: operator === ":" ? "=" : operator,
          value: value.trim(),
          negate: !!negate,
        })
      }
    } else {
      // Bare word — treat as name search
      const stripped = token.replace(/^["']|["']$/g, "")
      if (stripped) remainingText.push(stripped)
    }
  }

  // Leftover words become an implicit name filter
  if (remainingText.length > 0) {
    filters.push({
      field: "name",
      operator: "=",
      value: remainingText.join(" "),
      negate: false,
    })
  }

  return filters
}

// Convert parsed filters into API query params
export function filtersToParams(filters) {
  const params = {}

  filters.forEach(f => {
    const { field, operator, value, negate } = f

    // For now, skip negated filters since we don't have backend support yet
    // We'll handle negation client-side as a post-filter
    if (negate) {
      if (!params.__negate) params.__negate = []
      params.__negate.push({ field, value })
      return
    }

    if (field === "name")    params.name = value
    if (field === "text")    params.cardText = value
    if (field === "flavor")  params.flavorText = value
    if (field === "artist")  params.artist = value
    if (field === "number")  params.cardNumber = value
    if (field === "type")    params.type = capitalize(value)
    if (field === "set")     params.set = value.toUpperCase()
    if (field === "rarity")  params.rarity = capitalize(value)
    if (field === "tag")     params.tag = value
    if (field === "keyword") params.keyword = capitalize(value)

    if (field === "domain") {
      const existing = params.domain ? params.domain.split(",") : []
      params.domain = [...existing, capitalize(value)].join(",")
    }

    if (NUMERIC_FIELDS.includes(field)) {
      const fieldName = field === "energy" ? "energyCost"
                     : field === "power"  ? "powerCost"
                     : "might"
      if (operator === "=") {
        params[`${fieldName}Exact`] = value
      } else if (operator === ">=") {
        params[`${fieldName}Min`] = value
      } else if (operator === "<=") {
        params[`${fieldName}Max`] = value
      } else if (operator === ">") {
        params[`${fieldName}Min`] = String(parseInt(value) + 1)
      } else if (operator === "<") {
        params[`${fieldName}Max`] = String(parseInt(value) - 1)
      }
    }

    if (field === "legal") {
      if (value.toLowerCase() === "standard") params.legalStandard = "true"
      if (value.toLowerCase() === "casual")   params.legalCasual = "true"
    }
  })

  return params
}