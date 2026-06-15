import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { getCards } from "../api"
import CardTile from "../components/CardTile"
import { parseQuery, filtersToParams } from "../utils/searchParser"

// Filter options
const TYPES    = ["All", "Champion", "Legend", "Unit", "Token", "Spell", "Signature", "Rune", "Gear", "Battlefield"]
const DOMAINS  = ["All", "Fury", "Calm", "Mind", "Body", "Chaos", "Order"]
const RARITIES = ["All", "Common", "Uncommon", "Rare", "Epic", "AlternateArt", "Promo", "Champion"]
const SETS     = ["All", "OGN", "OGS", "SFD", "UNL"]

function Cards() {
  const [cards,   setCards]         = useState([])
  const [loading, setLoading]       = useState(true)
  const [error,   setError]         = useState(null)
  const [page, setPage]             = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal]           = useState(0)

  const [searchParams] = useSearchParams()
  const [search,       setSearch]       = useState(searchParams.get("search") || "")
  const [typeFilter,   setTypeFilter]   = useState("All")
  const [domainFilter, setDomainFilter] = useState("All")
  const [rarityFilter, setRarityFilter] = useState("All")
  const [setFilter,    setSetFilter]    = useState("All")
  const [sortBy,       setSortBy]       = useState("name")
  const [order,        setOrder]        = useState("asc")

  // Add this above the useEffect
  const RARITY_ORDER = {
    Common:       1,
    Uncommon:     2,
    Rare:         3,
    Epic:         4,
    AlternateArt: 5,
    Signature:    5,
    Promo:        6,
    Champion:     7,
  }

  // Fetch cards whenever filters or sort change
  useEffect(() => {
    const fetchCards = async () => {
      setLoading(true)
      setError(null)
      try {
        // Parse the search bar for syntax
        const parsedFilters = parseQuery(search)
        const syntaxParams   = filtersToParams(parsedFilters)

        // Pull out negated filters before sending to API
        const { __negate, ...searchParams } = syntaxParams

        const data = await getCards({
          ...searchParams,
          type:   typeFilter   !== "All" ? typeFilter   : searchParams.type,
          domain: domainFilter !== "All" ? domainFilter : searchParams.domain,
          rarity: rarityFilter !== "All" ? rarityFilter : searchParams.rarity,
          set:    setFilter    !== "All" ? setFilter    : searchParams.set,
          sortBy,
          order,
          page,
          limit: 60,
        })

        // Apply negation filters client-side
        let sortedCards = data.cards
        if (__negate && __negate.length > 0) {
          sortedCards = sortedCards.filter(card => {
            return __negate.every(({ field, value }) => {
              const val = value.toLowerCase()
              if (field === "type")    return !card.types.some(t => t.toLowerCase() === val)
              if (field === "domain")  return !card.domains.some(d => d.toLowerCase() === val)
              if (field === "rarity")  return card.rarity.toLowerCase() !== val
              if (field === "set")     return card.set.toLowerCase() !== val
              if (field === "tag")     return !card.tags.some(t => t.toLowerCase().includes(val))
              if (field === "keyword") return !card.keywords.some(k => k.toLowerCase() === val)
              if (field === "name")    return !card.name.toLowerCase().includes(val)
              return true
            })
          })
        }

        setCards(sortedCards)
        setTotal(data.total)
        setTotalPages(data.totalPages)
      } catch (e) {
        setError("Failed to load cards. Is the server running?")
      }
      setLoading(false)
    }
    const timer = setTimeout(fetchCards, 300)
    return () => clearTimeout(timer)
  }, [search, typeFilter, domainFilter, rarityFilter, setFilter, sortBy, order, page])

// Reset to page 1 when filters change
useEffect(() => {
  setPage(1)
}, [search, typeFilter, domainFilter, rarityFilter, setFilter, sortBy, order])
  return (
    <div>
      {/* ---- SEARCH & FILTERS ---- */}
      <div className="mb-6 flex flex-col gap-4">

        {/* Search input with syntax guide link */}
        <div className="flex flex-col gap-1 max-w-md">
          <input
            type="text"
            placeholder='Search cards or use syntax (e.g. t:champion d:fury)'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg px-4 py-2 text-sm focus:outline-none transition-all duration-200"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
            }}
            onFocus={e => e.target.style.borderColor = "var(--accent)"}
            onBlur={e => e.target.style.borderColor = "var(--border)"}
          />
          <a
            href="/syntax"
            className="text-xs underline transition-colors self-start"
            style={{ color: "var(--text-secondary)" }}
          >
            Syntax guide
          </a>
        </div>

        {/* Filters + Sort row */}
        <div className="flex gap-3 flex-wrap items-end">

          {/* Type filter */}
          <div className="flex flex-col gap-1">
            <label className="text-xs uppercase tracking-widest" style={{ color: "var(--text-dim)" }}>Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="text-sm rounded-lg px-3 py-2 focus:outline-none cursor-pointer"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                color: "var(--text-primary)",
                minWidth: "140px",
              }}
            >
              {TYPES.map((t) => <option key={t} value={t}>{t === "All" ? "All Types" : t}</option>)}
            </select>
          </div>

          {/* Domain filter */}
          <div className="flex flex-col gap-1">
            <label className="text-xs uppercase tracking-widest" style={{ color: "var(--text-dim)" }}>Domain</label>
            <select
              value={domainFilter}
              onChange={(e) => setDomainFilter(e.target.value)}
              className="text-sm rounded-lg px-3 py-2 focus:outline-none cursor-pointer"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                color: "var(--text-primary)",
                minWidth: "140px",
              }}
            >
              {DOMAINS.map((d) => <option key={d} value={d}>{d === "All" ? "All Domains" : d}</option>)}
            </select>
          </div>

          {/* Rarity filter */}
          <div className="flex flex-col gap-1">
            <label className="text-xs uppercase tracking-widest" style={{ color: "var(--text-dim)" }}>Rarity</label>
            <select
              value={rarityFilter}
              onChange={(e) => setRarityFilter(e.target.value)}
              className="text-sm rounded-lg px-3 py-2 focus:outline-none cursor-pointer"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                color: "var(--text-primary)",
                minWidth: "140px",
              }}
            >
              {RARITIES.map((r) => <option key={r} value={r}>{r === "All" ? "All Rarities" : r}</option>)}
            </select>
          </div>

          {/* Set filter */}
          <div className="flex flex-col gap-1">
            <label className="text-xs uppercase tracking-widest" style={{ color: "var(--text-dim)" }}>Set</label>
            <select
              value={setFilter}
              onChange={(e) => setSetFilter(e.target.value)}
              className="text-sm rounded-lg px-3 py-2 focus:outline-none cursor-pointer"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                color: "var(--text-primary)",
                minWidth: "140px",
              }}
            >
              {SETS.map((s) => <option key={s} value={s}>{s === "All" ? "All Sets" : s}</option>)}
            </select>
          </div>

          {/* Divider */}
          <div style={{ width: "1px", alignSelf: "stretch", background: "var(--border)", margin: "0 4px" }} />

          {/* Sort by */}
          <div className="flex flex-col gap-1">
            <label className="text-xs uppercase tracking-widest" style={{ color: "var(--text-dim)" }}>Sort by</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm rounded-lg px-3 py-2 focus:outline-none cursor-pointer"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                color: "var(--text-primary)",
                minWidth: "140px",
              }}
            >
              <option value="name">Name</option>
              <option value="releaseDate">Release Date</option>
              <option value="set">Set</option>
              <option value="rarity">Rarity</option>
              <option value="energyCost">Energy Cost</option>
              <option value="powerCost">Power Cost</option>
              <option value="might">Might</option>
            </select>
          </div>

          {/* Order */}
          <div className="flex flex-col gap-1">
            <label className="text-xs uppercase tracking-widest" style={{ color: "var(--text-dim)" }}>Order</label>
            <select
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              className="text-sm rounded-lg px-3 py-2 focus:outline-none cursor-pointer"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                color: "var(--text-primary)",
                minWidth: "120px",
              }}
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>

          {/* Reset filters button */}
          {(typeFilter !== "All" || domainFilter !== "All" || rarityFilter !== "All" || setFilter !== "All" || search) && (
            <button
              onClick={() => {
                setSearch("")
                setTypeFilter("All")
                setDomainFilter("All")
                setRarityFilter("All")
                setSetFilter("All")
              }}
              className="text-sm px-3 py-2 rounded-lg transition-colors"
              style={{
                color: "var(--text-secondary)",
                border: "1px solid var(--border)",
              }}
              onMouseEnter={e => e.currentTarget.style.color = "var(--accent)"}
              onMouseLeave={e => e.currentTarget.style.color = "var(--text-secondary)"}
            >
              Reset
            </button>
          )}

        </div>
      </div>

      {/* ---- RESULTS COUNT ---- */}
      <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
        {loading ? "Loading..." : `Showing ${cards.length} of ${total} card${total !== 1 ? "s" : ""}`}
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-4 gap-3 max-w-7xl mx-auto">
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

      {/* ---- PAGINATION ---- */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">

          {/* First page */}
          <button
            onClick={() => setPage(1)}
            disabled={page === 1}
            className="px-3 py-2 rounded-lg text-sm transition-colors"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              color: page === 1 ? "var(--text-dim)" : "var(--text-primary)",
              cursor: page === 1 ? "not-allowed" : "pointer",
            }}
          >
            «
          </button>

          {/* Previous */}
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-2 rounded-lg text-sm transition-colors"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              color: page === 1 ? "var(--text-dim)" : "var(--text-primary)",
              cursor: page === 1 ? "not-allowed" : "pointer",
            }}
          >
            ‹ Prev
          </button>

          {/* Current page info */}
          <span
            className="px-4 py-2 text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            Page {page} of {totalPages}
          </span>

          {/* Next */}
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-2 rounded-lg text-sm transition-colors"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              color: page === totalPages ? "var(--text-dim)" : "var(--text-primary)",
              cursor: page === totalPages ? "not-allowed" : "pointer",
            }}
          >
            Next ›
          </button>

          {/* Last page */}
          <button
            onClick={() => setPage(totalPages)}
            disabled={page === totalPages}
            className="px-3 py-2 rounded-lg text-sm transition-colors"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              color: page === totalPages ? "var(--text-dim)" : "var(--text-primary)",
              cursor: page === totalPages ? "not-allowed" : "pointer",
            }}
          >
            »
          </button>

        </div>
      )}
    </div>
  )
}

export default Cards