import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { getCards } from "../api"
import CardTile from "../components/CardTile"

// Filter options
const TYPES    = ["All", "Champion", "Legend", "Unit", "Token", "Spell", "Signature", "Rune", "Gear", "Battlefield"]
const DOMAINS  = ["All", "Fury", "Calm", "Mind", "Body", "Chaos", "Order"]
const RARITIES = ["All", "Common", "Uncommon", "Rare", "Epic", "AlternateArt", "Promo", "Champion"]
const SETS     = ["All", "OGN", "OGS", "SFD", "UNL"]

function Cards() {
  const [cards, setCards]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  const [searchParams] = useSearchParams()
  const [search,       setSearch]       = useState(searchParams.get("search") || "")
  const [typeFilter,   setTypeFilter]   = useState("All")
  const [domainFilter, setDomainFilter] = useState("All")
  const [rarityFilter, setRarityFilter] = useState("All")
  const [setFilter,    setSetFilter]    = useState("All")

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
          className="w-full max-w-md rounded-lg px-4 py-2 text-sm focus:outline-none transition-all duration-200"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            color: "var(--text-primary)",
          }}
          onFocus={e => e.target.style.borderColor = "var(--accent)"}
          onBlur={e => e.target.style.borderColor = "var(--border)"}
        />

        {/* Type filter buttons */}
        <div className="flex gap-2 flex-wrap">
          {TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className="px-3 py-1 rounded-full text-xs font-medium transition-all duration-200"
              style={typeFilter === t
                ? { background: "var(--accent)", color: "var(--bg-primary)", border: "1px solid transparent" }
                : { background: "var(--bg-card)", color: "var(--text-secondary)", border: "1px solid var(--border)" }
              }
            >
              {t}
            </button>
          ))}
        </div>

        {/* Domain filter buttons */}
        <div className="flex gap-2 flex-wrap">
          {DOMAINS.map((d) => (
            <button
              key={d}
              onClick={() => setDomainFilter(d)}
              className="px-3 py-1 rounded-full text-xs font-medium transition-all duration-200"
              style={domainFilter === d
                ? { background: "var(--accent)", color: "var(--bg-primary)", border: "1px solid transparent" }
                : { background: "var(--bg-card)", color: "var(--text-secondary)", border: "1px solid var(--border)" }
              }
            >
              {d}
            </button>
          ))}
        </div>

        {/* Rarity + Set dropdowns */}
        <div className="flex gap-4 flex-wrap">
          <select
            value={rarityFilter}
            onChange={(e) => setRarityFilter(e.target.value)}
            className="text-sm rounded-lg px-3 py-1.5 focus:outline-none"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              color: "var(--text-secondary)",
            }}
          >
            {RARITIES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>

          <select
            value={setFilter}
            onChange={(e) => setSetFilter(e.target.value)}
            className="text-sm rounded-lg px-3 py-1.5 focus:outline-none"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              color: "var(--text-secondary)",
            }}
          >
            {SETS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* ---- RESULTS COUNT ---- */}
      <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
        {loading ? "Loading..." : `Showing ${cards.length} card${cards.length !== 1 ? "s" : ""}`}
      </p>

      {/* ---- ERROR STATE ---- */}
      {error && (
        <div
          className="rounded-lg p-4 mb-4 text-sm"
          style={{
            background: "rgba(220,38,38,0.1)",
            border: "1px solid rgba(220,38,38,0.3)",
            color: "#f87171",
          }}
        >
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
        <div className="text-center mt-16">
          <p className="text-4xl mb-3">🃏</p>
          <p style={{ color: "var(--text-secondary)" }}>No cards found. Try adjusting your filters.</p>
        </div>
      )}
    </div>
  )
}

export default Cards