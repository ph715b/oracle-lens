import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { searchCards } from "../api"
import CardTile from "../components/CardTile"

const TYPES    = ["Champion", "Legend", "Unit", "Token", "Spell", "Signature", "Rune", "Gear", "Battlefield"]
const DOMAINS  = ["Fury", "Calm", "Mind", "Body", "Chaos", "Order"]
const RARITIES = ["Common", "Uncommon", "Rare", "Epic", "AlternateArt", "Promo", "Champion"]
const SETS     = ["OGN", "OGS", "SFD", "UNL"]
const KEYWORDS = [
  "Accelerate", "Action", "Ambush", "Assault", "Backline", "Deathknell",
  "Deflect", "Equip", "Exhaust", "Ganking", "Hidden", "Hunt", "Legion",
  "Level", "Predict", "Quick-Draw", "Reaction", "Ready", "Recycle",
  "Repeat", "Shield", "Tank", "Temporary", "Unique", "Vision",
  "Weaponmaster", "XP", "Strike"
]

const RARITY_ORDER = {
  Common: 1, Uncommon: 2, Rare: 3, Epic: 4,
  AlternateArt: 5, Signature: 5, Promo: 6, Champion: 7,
}

export default function Advanced() {
  const navigate = useNavigate()

  // ---- TEXT FILTERS ----
  const [name, setName]             = useState("")
  const [cardText, setCardText]     = useState("")
  const [flavorText, setFlavorText] = useState("")
  const [artist, setArtist]         = useState("")
  const [cardNumber, setCardNumber] = useState("")

  // ---- DROPDOWN FILTERS ----
  const [type, setType]     = useState("")
  const [rarity, setRarity] = useState("")
  const [set, setSet]       = useState("")
  const [tag, setTag]       = useState("")
  const [keyword, setKeyword] = useState("")

  // ---- DOMAINS (multi-select with AND/OR) ----
  const [selectedDomains, setSelectedDomains] = useState([])
  const [domainMode, setDomainMode]           = useState("or")

  // ---- NUMERIC FILTERS (with range toggle) ----
  const [energyMode, setEnergyMode]   = useState("range")
  const [energyMin, setEnergyMin]     = useState("")
  const [energyMax, setEnergyMax]     = useState("")
  const [energyExact, setEnergyExact] = useState("")

  const [powerMode, setPowerMode]     = useState("range")
  const [powerMin, setPowerMin]       = useState("")
  const [powerMax, setPowerMax]       = useState("")
  const [powerExact, setPowerExact]   = useState("")

  const [mightMode, setMightMode]     = useState("range")
  const [mightMin, setMightMin]       = useState("")
  const [mightMax, setMightMax]       = useState("")
  const [mightExact, setMightExact]   = useState("")

  // ---- LEGALITY ----
  const [legalStandard, setLegalStandard] = useState("")
  const [legalCasual, setLegalCasual]     = useState("")

  // ---- SORT & RESULTS ----
  const [sortBy, setSortBy] = useState("name")
  const [order, setOrder]   = useState("asc")
  const [cards, setCards]   = useState([])
  const [total, setTotal]   = useState(0)
  const [loading, setLoading] = useState(false)

  // Toggle a domain in the multi-select
  const toggleDomain = (d) => {
    setSelectedDomains(prev =>
      prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]
    )
  }

  // Reset all filters
  const reset = () => {
    setName(""); setCardText(""); setFlavorText(""); setArtist(""); setCardNumber("")
    setType(""); setRarity(""); setSet(""); setTag(""); setKeyword("")
    setSelectedDomains([]); setDomainMode("or")
    setEnergyMode("range"); setEnergyMin(""); setEnergyMax(""); setEnergyExact("")
    setPowerMode("range"); setPowerMin(""); setPowerMax(""); setPowerExact("")
    setMightMode("range"); setMightMin(""); setMightMax(""); setMightExact("")
    setLegalStandard(""); setLegalCasual("")
    setSortBy("name"); setOrder("asc")
  }

  // Live search whenever any filter changes
  useEffect(() => {
    const fetchCards = async () => {
      setLoading(true)
      try {
        const filters = {
          name, cardText, flavorText, artist, cardNumber,
          type, rarity, set, tag, keyword,
          domain: selectedDomains, domainMode,
          legalStandard, legalCasual,
          sortBy, order, limit: 60,
        }

        // Numeric — only send the active mode
        if (energyMode === "exact") filters.energyCostExact = energyExact
        else { filters.energyCostMin = energyMin; filters.energyCostMax = energyMax }

        if (powerMode === "exact") filters.powerCostExact = powerExact
        else { filters.powerCostMin = powerMin; filters.powerCostMax = powerMax }

        if (mightMode === "exact") filters.mightExact = mightExact
        else { filters.mightMin = mightMin; filters.mightMax = mightMax }

        const data = await searchCards(filters)

        // Apply proper rarity sort on the frontend
        let sortedCards = data.cards
        if (sortBy === "rarity") {
          sortedCards = [...sortedCards].sort((a, b) => {
            const aRank = RARITY_ORDER[a.rarity] || 0
            const bRank = RARITY_ORDER[b.rarity] || 0
            return order === "asc" ? aRank - bRank : bRank - aRank
          })
        }

        setCards(sortedCards)
        setTotal(data.total)
      } catch (e) {
        console.error(e)
      }
      setLoading(false)
    }
    const timer = setTimeout(fetchCards, 300)
    return () => clearTimeout(timer)
  }, [
    name, cardText, flavorText, artist, cardNumber,
    type, rarity, set, tag, keyword,
    selectedDomains, domainMode,
    energyMode, energyMin, energyMax, energyExact,
    powerMode, powerMin, powerMax, powerExact,
    mightMode, mightMin, mightMax, mightExact,
    legalStandard, legalCasual,
    sortBy, order,
  ])

  // Shared input styles
  const inputStyle = {
    background: "var(--bg-card)",
    border: "1px solid var(--border)",
    color: "var(--text-primary)",
  }
  const labelStyle = { color: "var(--text-dim)" }

  return (
    <div className="max-w-7xl mx-auto">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
          Advanced Search
        </h1>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Results update live as you change filters.
        </p>
      </div>

      {/* FILTER GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">

        {/* NAME */}
        <div className="flex flex-col gap-1">
          <label className="text-xs uppercase tracking-widest" style={labelStyle}>Name</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)}
            placeholder="e.g. Annie"
            className="rounded-lg px-3 py-2 text-sm focus:outline-none" style={inputStyle} />
        </div>

        {/* CARD TEXT */}
        <div className="flex flex-col gap-1">
          <label className="text-xs uppercase tracking-widest" style={labelStyle}>Card Text</label>
          <input type="text" value={cardText} onChange={e => setCardText(e.target.value)}
            placeholder="e.g. deal damage"
            className="rounded-lg px-3 py-2 text-sm focus:outline-none" style={inputStyle} />
        </div>

        {/* FLAVOR TEXT */}
        <div className="flex flex-col gap-1">
          <label className="text-xs uppercase tracking-widest" style={labelStyle}>Flavor Text</label>
          <input type="text" value={flavorText} onChange={e => setFlavorText(e.target.value)}
            placeholder="e.g. demacia"
            className="rounded-lg px-3 py-2 text-sm focus:outline-none" style={inputStyle} />
        </div>

        {/* TYPE */}
        <div className="flex flex-col gap-1">
          <label className="text-xs uppercase tracking-widest" style={labelStyle}>Type</label>
          <select value={type} onChange={e => setType(e.target.value)}
            className="rounded-lg px-3 py-2 text-sm focus:outline-none cursor-pointer" style={inputStyle}>
            <option value="">Any Type</option>
            {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {/* RARITY */}
        <div className="flex flex-col gap-1">
          <label className="text-xs uppercase tracking-widest" style={labelStyle}>Rarity</label>
          <select value={rarity} onChange={e => setRarity(e.target.value)}
            className="rounded-lg px-3 py-2 text-sm focus:outline-none cursor-pointer" style={inputStyle}>
            <option value="">Any Rarity</option>
            {RARITIES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        {/* SET */}
        <div className="flex flex-col gap-1">
          <label className="text-xs uppercase tracking-widest" style={labelStyle}>Set</label>
          <select value={set} onChange={e => setSet(e.target.value)}
            className="rounded-lg px-3 py-2 text-sm focus:outline-none cursor-pointer" style={inputStyle}>
            <option value="">Any Set</option>
            {SETS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* KEYWORD */}
        <div className="flex flex-col gap-1">
          <label className="text-xs uppercase tracking-widest" style={labelStyle}>Keyword</label>
          <select value={keyword} onChange={e => setKeyword(e.target.value)}
            className="rounded-lg px-3 py-2 text-sm focus:outline-none cursor-pointer" style={inputStyle}>
            <option value="">Any Keyword</option>
            {KEYWORDS.map(k => <option key={k} value={k}>{k}</option>)}
          </select>
        </div>

        {/* TAG */}
        <div className="flex flex-col gap-1">
          <label className="text-xs uppercase tracking-widest" style={labelStyle}>Tag</label>
          <input type="text" value={tag} onChange={e => setTag(e.target.value)}
            placeholder="e.g. Annie, Demacia"
            className="rounded-lg px-3 py-2 text-sm focus:outline-none" style={inputStyle} />
        </div>

        {/* ARTIST */}
        <div className="flex flex-col gap-1">
          <label className="text-xs uppercase tracking-widest" style={labelStyle}>Artist</label>
          <input type="text" value={artist} onChange={e => setArtist(e.target.value)}
            placeholder="e.g. Polar Engine"
            className="rounded-lg px-3 py-2 text-sm focus:outline-none" style={inputStyle} />
        </div>

        {/* CARD NUMBER */}
        <div className="flex flex-col gap-1">
          <label className="text-xs uppercase tracking-widest" style={labelStyle}>Card Number</label>
          <input type="text" value={cardNumber} onChange={e => setCardNumber(e.target.value)}
            placeholder="e.g. 001"
            className="rounded-lg px-3 py-2 text-sm focus:outline-none" style={inputStyle} />
        </div>

        {/* LEGAL STANDARD */}
        <div className="flex flex-col gap-1">
          <label className="text-xs uppercase tracking-widest" style={labelStyle}>Standard Legal</label>
          <select value={legalStandard} onChange={e => setLegalStandard(e.target.value)}
            className="rounded-lg px-3 py-2 text-sm focus:outline-none cursor-pointer" style={inputStyle}>
            <option value="">Any</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>

        {/* LEGAL CASUAL */}
        <div className="flex flex-col gap-1">
          <label className="text-xs uppercase tracking-widest" style={labelStyle}>Casual Legal</label>
          <select value={legalCasual} onChange={e => setLegalCasual(e.target.value)}
            className="rounded-lg px-3 py-2 text-sm focus:outline-none cursor-pointer" style={inputStyle}>
            <option value="">Any</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
      </div>

      {/* DOMAINS — multi-select with AND/OR */}
      <div className="mb-6 p-4 rounded-lg" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs uppercase tracking-widest" style={labelStyle}>Domains</label>
          <div className="flex gap-2">
            <button
              onClick={() => setDomainMode("or")}
              className="text-xs px-3 py-1 rounded transition-colors"
              style={domainMode === "or"
                ? { background: "var(--accent)", color: "var(--bg-primary)" }
                : { background: "var(--bg-primary)", color: "var(--text-secondary)", border: "1px solid var(--border)" }
              }
            >
              Match ANY
            </button>
            <button
              onClick={() => setDomainMode("and")}
              className="text-xs px-3 py-1 rounded transition-colors"
              style={domainMode === "and"
                ? { background: "var(--accent)", color: "var(--bg-primary)" }
                : { background: "var(--bg-primary)", color: "var(--text-secondary)", border: "1px solid var(--border)" }
              }
            >
              Match ALL
            </button>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {DOMAINS.map(d => (
            <button
              key={d}
              onClick={() => toggleDomain(d)}
              className="text-xs px-3 py-1.5 rounded-full transition-colors"
              style={selectedDomains.includes(d)
                ? { background: "var(--accent)", color: "var(--bg-primary)" }
                : { background: "var(--bg-primary)", color: "var(--text-secondary)", border: "1px solid var(--border)" }
              }
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* NUMERIC FILTERS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

        {/* ENERGY COST */}
        <NumericFilter
          label="Energy Cost"
          mode={energyMode} setMode={setEnergyMode}
          min={energyMin} setMin={setEnergyMin}
          max={energyMax} setMax={setEnergyMax}
          exact={energyExact} setExact={setEnergyExact}
          inputStyle={inputStyle} labelStyle={labelStyle}
        />

        {/* POWER COST */}
        <NumericFilter
          label="Power Cost"
          mode={powerMode} setMode={setPowerMode}
          min={powerMin} setMin={setPowerMin}
          max={powerMax} setMax={setPowerMax}
          exact={powerExact} setExact={setPowerExact}
          inputStyle={inputStyle} labelStyle={labelStyle}
        />

        {/* MIGHT */}
        <NumericFilter
          label="Might"
          mode={mightMode} setMode={setMightMode}
          min={mightMin} setMin={setMightMin}
          max={mightMax} setMax={setMightMax}
          exact={mightExact} setExact={setMightExact}
          inputStyle={inputStyle} labelStyle={labelStyle}
        />
      </div>

      {/* SORT + RESET */}
      <div className="flex items-end gap-3 mb-6 flex-wrap">
        <div className="flex flex-col gap-1">
          <label className="text-xs uppercase tracking-widest" style={labelStyle}>Sort by</label>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}
            className="rounded-lg px-3 py-2 text-sm focus:outline-none cursor-pointer" style={inputStyle}>
            <option value="name">Name</option>
            <option value="releaseDate">Release Date</option>
            <option value="set">Set</option>
            <option value="rarity">Rarity</option>
            <option value="energyCost">Energy Cost</option>
            <option value="powerCost">Power Cost</option>
            <option value="might">Might</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs uppercase tracking-widest" style={labelStyle}>Order</label>
          <select value={order} onChange={e => setOrder(e.target.value)}
            className="rounded-lg px-3 py-2 text-sm focus:outline-none cursor-pointer" style={inputStyle}>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
        <button onClick={reset}
          className="text-sm px-4 py-2 rounded-lg transition-colors"
          style={{ color: "var(--text-secondary)", border: "1px solid var(--border)" }}
          onMouseEnter={e => e.currentTarget.style.color = "var(--accent)"}
          onMouseLeave={e => e.currentTarget.style.color = "var(--text-secondary)"}
        >
          Reset All
        </button>
      </div>

      {/* RESULTS COUNT */}
      <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
        {loading ? "Searching..." : `Found ${total} card${total !== 1 ? "s" : ""}`}
      </p>

      {/* CARD GRID */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-5 gap-3">
        {cards.map(card => <CardTile key={card.id} card={card} />)}
      </div>

      {!loading && cards.length === 0 && (
        <div className="text-center mt-16">
          <p className="text-4xl mb-3">🃏</p>
          <p style={{ color: "var(--text-secondary)" }}>No cards match your filters.</p>
        </div>
      )}
    </div>
  )
}

// Numeric filter component — toggles between range and exact match
function NumericFilter({ label, mode, setMode, min, setMin, max, setMax, exact, setExact, inputStyle, labelStyle }) {
  return (
    <div className="p-4 rounded-lg" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
      <div className="flex items-center justify-between mb-3">
        <label className="text-xs uppercase tracking-widest" style={labelStyle}>{label}</label>
        <div className="flex gap-1">
          <button onClick={() => setMode("range")}
            className="text-xs px-2 py-1 rounded transition-colors"
            style={mode === "range"
              ? { background: "var(--accent)", color: "var(--bg-primary)" }
              : { background: "var(--bg-primary)", color: "var(--text-secondary)", border: "1px solid var(--border)" }
            }
          >Range</button>
          <button onClick={() => setMode("exact")}
            className="text-xs px-2 py-1 rounded transition-colors"
            style={mode === "exact"
              ? { background: "var(--accent)", color: "var(--bg-primary)" }
              : { background: "var(--bg-primary)", color: "var(--text-secondary)", border: "1px solid var(--border)" }
            }
          >Exact</button>
        </div>
      </div>
      {mode === "range" ? (
        <div className="flex gap-2 items-center">
          <input type="number" min="0" value={min} onChange={e => setMin(e.target.value)}
            placeholder="Min"
            className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none"
            style={inputStyle} />
          <span style={{ color: "var(--text-dim)" }}>—</span>
          <input type="number" min="0" value={max} onChange={e => setMax(e.target.value)}
            placeholder="Max"
            className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none"
            style={inputStyle} />
        </div>
      ) : (
        <input type="number" min="0" value={exact} onChange={e => setExact(e.target.value)}
          placeholder="Exact value"
          className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none"
          style={inputStyle} />
      )}
    </div>
  )
}