import { useState, useEffect } from "react"
import { getCards } from "../api"
import CardTile from "../components/CardTile"

// Filter options
const TYPES    = ["All", "Champion", "Legend", "Unit", "Token", "Spell", "Rune", "Gear", "Battlefield"]
const DOMAINS  = ["All", "Fury", "Calm", "Mind", "Body", "Chaos", "Order"]
const RARITIES = ["All", "Common", "Uncommon", "Rare", "Epic", "AlternateArt", "Signature", "Promo", "Champion"]
const SETS     = ["All", "OGN", "OGS", "SFD", "UNL"]

function Cards() {
  // Card data from the API
  const [cards, setCards]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState(null)

  // Filter state
  const [search,       setSearch]       = useState("")
  const [typeFilter,   setTypeFilter]   = useState("All")
  const [domainFilter, setDomainFilter] = useState("All")
  const [rarityFilter, setRarityFilter] = useState("All")
  const [setFilter,    setSetFilter]    = useState("All")

  // Fetch cards whenever filters change
  useEffect(() => {
    const fetchCards = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await getCards({
          name:   search       || undefined,
          type:   typeFilter   !== "All" ? typeFilter   : undefined,
          domain: domainFilter !== "All" ? domainFilter : undefined,
          rarity: rarityFilter !== "All" ? rarityFilter : undefined,
          set:    setFilter    !== "All" ? setFilter    : undefined,
        })
        setCards(data)
      } catch (e) {
        setError("Failed to load cards. Is the server running?")
      }
      setLoading(false)
    }

    // Debounce search — wait 300ms after typing before fetching
    // This prevents an API call on every single keypress
    const timer = setTimeout(fetchCards, 300)
    return () => clearTimeout(timer)
  }, [search, typeFilter, domainFilter, rarityFilter, setFilter])

  return (
    <div>
      {/* ---- SEARCH & FILTERS ---- */}
      <div className="mb-6 flex flex-col gap-3">

        {/* Search input */}
        <input
          type="text"
          placeholder="Search cards..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition-colors"
        />

        {/* Type filters */}
        <div className="flex gap-2 flex-wrap">
          {TYPES.map((t) => (
            <button key={t} onClick={() => setTypeFilter(t)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                typeFilter === t
                  ? "bg-yellow-400 text-gray-900"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >{t}</button>
          ))}
        </div>

        {/* Domain filters */}
        <div className="flex gap-2 flex-wrap">
          {DOMAINS.map((d) => (
            <button key={d} onClick={() => setDomainFilter(d)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                domainFilter === d
                  ? "bg-yellow-400 text-gray-900"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >{d}</button>
          ))}
        </div>

        {/* Rarity + Set filters on same row */}
        <div className="flex gap-4 flex-wrap">

          {/* Rarity dropdown */}
          <select
            value={rarityFilter}
            onChange={(e) => setRarityFilter(e.target.value)}
            className="bg-gray-800 border border-gray-600 text-gray-300 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-yellow-400"
          >
            {RARITIES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>

          {/* Set dropdown */}
          <select
            value={setFilter}
            onChange={(e) => setSetFilter(e.target.value)}
            className="bg-gray-800 border border-gray-600 text-gray-300 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-yellow-400"
          >
            {SETS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* ---- RESULTS COUNT ---- */}
      <p className="text-gray-500 text-sm mb-4">
        {loading ? "Loading..." : `Showing ${cards.length} card${cards.length !== 1 ? "s" : ""}`}
      </p>

      {/* ---- ERROR STATE ---- */}
      {error && (
        <div className="text-red-400 bg-red-400/10 border border-red-400/30 rounded-lg p-4 mb-4">
          {error}
        </div>
      )}

      {/* ---- CARD GRID ---- */}
      {!loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {cards.map((card) => (
            <CardTile key={card.id} card={card} />
          ))}
        </div>
      )}

      {/* ---- EMPTY STATE ---- */}
      {!loading && cards.length === 0 && !error && (
        <div className="text-center text-gray-500 mt-16">
          <p className="text-4xl mb-3">🃏</p>
          <p>No cards found. Try adjusting your filters.</p>
        </div>
      )}
    </div>
  )
}

export default Cards