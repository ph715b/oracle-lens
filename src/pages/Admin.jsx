import { useState, useEffect } from "react"

const TYPES    = ["Champion", "Legend", "Unit", "Token", "Spell", "Signature", "Rune", "Gear", "Battlefield"]
const DOMAINS  = ["Fury", "Calm", "Mind", "Body", "Chaos", "Order"]
const RARITIES = ["Common", "Uncommon", "Rare", "Epic", "AlternateArt", "Promo", "Champion"]
const SETS     = [
  { code: "OGN", name: "Origins" },
  { code: "OGS", name: "Origins - Proving Grounds" },
  { code: "SFD", name: "Spiritforged" },
  { code: "UNL", name: "Unleashed" },
]

const API_URL = import.meta.env.PROD ? "/api" : "http://localhost:3001/api"

const blankCard = () => ({
  id: "", slug: "", name: "",
  set: "OGN", setName: "Origins", number: "",
  types: [], domains: [], tags: "",
  rarity: "Common",
  energyCost: "", powerCost: 0, alternateCost: false,
  might: "",
  cardText: "", flavorText: "",
  keywords: "",
  imageArtist: "", imageUrl: "",
  legalStandard: true, legalCasual: true,
  releasedAt: "2025-10-01",
})

export default function Admin() {
  const [password, setPassword] = useState(localStorage.getItem("adminPassword") || "")
  const [authed, setAuthed]     = useState(false)
  const [tab, setTab]           = useState("add")            // "add" | "list" | "bulk"

  // Form state
  const [card, setCard]               = useState(blankCard())
  const [imageFile, setImageFile]     = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [status, setStatus]           = useState("")
  const [loading, setLoading]         = useState(false)
  const [editing, setEditing]         = useState(false)

  // Cards list state
  const [allCards, setAllCards] = useState([])
  const [filter, setFilter]     = useState("")

  // Bulk import state
  const [bulkText, setBulkText] = useState("")

  const inputStyle = { background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-primary)" }
  const labelStyle = { color: "var(--text-dim)" }

  // ---- AUTH ----
  const tryAuth = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/cards-list`, {
        headers: { "X-Admin-Password": password },
      })
      if (res.status === 401) {
        setStatus("❌ Wrong password")
        setAuthed(false)
      } else {
        localStorage.setItem("adminPassword", password)
        setAuthed(true)
        setStatus("")
      }
    } catch (e) {
      setStatus("❌ Connection error")
    }
  }

  // ---- LOAD CARDS LIST ----
  const loadCards = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/cards-list`, {
        headers: { "X-Admin-Password": password },
      })
      const data = await res.json()
      setAllCards(data)
    } catch (e) {
      setStatus("❌ Failed to load cards")
    }
  }

  useEffect(() => {
    if (authed && tab === "list") loadCards()
  }, [authed, tab])

  // ---- IMAGE PREVIEW ----
  const handleImageSelect = (file) => {
    setImageFile(file)
    if (file) {
      const url = URL.createObjectURL(file)
      setImagePreview(url)
    } else {
      setImagePreview(null)
    }
  }

  // ---- FORM HELPERS ----
  const updateName = (name) => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
    setCard(c => ({ ...c, name, slug }))
  }
  const updateNumber = (number) => setCard(c => ({ ...c, number, id: `${c.set}-${number}` }))
  const updateSet = (setCode) => {
    const setObj = SETS.find(s => s.code === setCode)
    setCard(c => ({
      ...c,
      set: setCode,
      setName: setObj?.name || setCode,
      id: c.number ? `${setCode}-${c.number}` : c.id,
    }))
  }
  const toggleArray = (field, value) => {
    setCard(c => ({
      ...c,
      [field]: c[field].includes(value)
        ? c[field].filter(v => v !== value)
        : [...c[field], value]
    }))
  }

  // ---- SAVE CARD ----
  const handleSubmit = async () => {
    setLoading(true)
    setStatus("Saving...")
    try {
      let imageUrl = card.imageUrl
      if (imageFile) {
        setStatus("Uploading image...")
        const ext = imageFile.name.split(".").pop().toLowerCase()
        const buffer = await imageFile.arrayBuffer()
        const imgRes = await fetch(`${API_URL}/admin/upload-image?slug=${card.slug}&ext=${ext}`, {
          method: "POST",
          headers: { "X-Admin-Password": password, "Content-Type": "application/octet-stream" },
          body: buffer,
        })
        const imgData = await imgRes.json()
        if (!imgRes.ok) throw new Error(imgData.error || "Image upload failed")
        imageUrl = imgData.url
      }

      const payload = {
        ...card,
        tags:        Array.isArray(card.tags)     ? card.tags     : card.tags.split(",").map(t => t.trim()).filter(Boolean),
        keywords:    Array.isArray(card.keywords) ? card.keywords : card.keywords.split(",").map(k => k.trim()).filter(Boolean),
        energyCost:  card.energyCost === "" ? null : parseInt(card.energyCost),
        powerCost:   parseInt(card.powerCost) || 0,
        might:       card.might === "" ? null : parseInt(card.might),
        imageUrl,
        releasedAt:  new Date(card.releasedAt).toISOString(),
      }

      const res = await fetch(`${API_URL}/admin/cards`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Admin-Password": password },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Save failed")

      setStatus(`✅ ${editing ? "Updated" : "Saved"} ${payload.name}!`)
      setCard(blankCard())
      setImageFile(null)
      setImagePreview(null)
      setEditing(false)
    } catch (e) {
      setStatus(`❌ ${e.message}`)
    }
    setLoading(false)
  }

  // ---- EDIT / DELETE ----
  const editCard = async (id) => {
    const res = await fetch(`${API_URL}/admin/cards/${id}`, {
      headers: { "X-Admin-Password": password },
    })
    const data = await res.json()
    // Convert arrays to comma-separated strings for the form
    setCard({
      ...data,
      tags:       data.tags.join(", "),
      keywords:   data.keywords.join(", "),
      energyCost: data.energyCost ?? "",
      might:      data.might ?? "",
      releasedAt: data.releasedAt ? data.releasedAt.split("T")[0] : "2025-10-01",
    })
    setEditing(true)
    setTab("add")
    setStatus(`Editing ${data.name}`)
  }

  const deleteCard = async (id, name) => {
    if (!confirm(`Delete ${name}? This cannot be undone.`)) return
    try {
      const res = await fetch(`${API_URL}/admin/cards/${id}`, {
        method: "DELETE",
        headers: { "X-Admin-Password": password },
      })
      if (!res.ok) throw new Error("Delete failed")
      setStatus(`🗑️ Deleted ${name}`)
      loadCards()
    } catch (e) {
      setStatus(`❌ ${e.message}`)
    }
  }

  // ---- BULK IMPORT ----
  const handleBulkImport = async () => {
    setLoading(true)
    setStatus("Importing...")
    try {
      const cards = JSON.parse(bulkText)
      const res = await fetch(`${API_URL}/admin/bulk-import`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Admin-Password": password },
        body: JSON.stringify({ cards }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Import failed")
      setStatus(`✅ Imported ${data.updated} cards. ${data.failed.length} failed.`)
      if (data.failed.length > 0) console.log("Failed:", data.failed)
    } catch (e) {
      setStatus(`❌ ${e.message}`)
    }
    setLoading(false)
  }

  // ---- LOGIN ----
  if (!authed) {
    return (
      <div className="max-w-md mx-auto mt-20">
        <h1 className="text-2xl font-bold mb-6" style={{ color: "var(--text-primary)" }}>Admin Login</h1>
        <input
          type="password"
          placeholder="Admin password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === "Enter" && tryAuth()}
          className="w-full rounded-lg px-4 py-3 mb-3 focus:outline-none"
          style={inputStyle}
        />
        <button onClick={tryAuth}
          className="w-full py-3 rounded-lg font-bold"
          style={{ background: "var(--accent)", color: "var(--bg-primary)" }}
        >
          Sign In
        </button>
        {status && <p className="mt-4 text-sm" style={{ color: "var(--text-secondary)" }}>{status}</p>}
      </div>
    )
  }

  // ---- ADMIN UI ----
  const filteredCards = allCards.filter(c =>
    !filter || c.name.toLowerCase().includes(filter.toLowerCase()) || c.id.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div className="max-w-6xl mx-auto">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>Admin Panel</h1>
        <button onClick={() => { localStorage.removeItem("adminPassword"); setAuthed(false) }}
          className="text-sm" style={{ color: "var(--text-secondary)" }}
        >
          Sign out
        </button>
      </div>

      {/* TABS */}
      <div className="flex gap-2 mb-6">
        {[
          { id: "add",  label: editing ? "Edit Card" : "Add Card" },
          { id: "list", label: "All Cards" },
          { id: "bulk", label: "Bulk Import" },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="px-4 py-2 rounded-lg text-sm transition-colors"
            style={tab === t.id
              ? { background: "var(--accent)", color: "var(--bg-primary)" }
              : { background: "var(--bg-card)", color: "var(--text-secondary)", border: "1px solid var(--border)" }
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ---- ADD/EDIT FORM ---- */}
      {tab === "add" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex flex-col gap-1">
              <label className="text-xs uppercase tracking-widest" style={labelStyle}>Name *</label>
              <input value={card.name} onChange={e => updateName(e.target.value)}
                className="rounded-lg px-3 py-2 focus:outline-none" style={inputStyle} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs uppercase tracking-widest" style={labelStyle}>Set</label>
              <select value={card.set} onChange={e => updateSet(e.target.value)}
                className="rounded-lg px-3 py-2 focus:outline-none cursor-pointer" style={inputStyle}>
                {SETS.map(s => <option key={s.code} value={s.code}>{s.name}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs uppercase tracking-widest" style={labelStyle}>Card Number *</label>
              <input value={card.number} onChange={e => updateNumber(e.target.value)}
                placeholder="001"
                className="rounded-lg px-3 py-2 focus:outline-none" style={inputStyle} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs uppercase tracking-widest" style={labelStyle}>Rarity</label>
              <select value={card.rarity} onChange={e => setCard(c => ({ ...c, rarity: e.target.value }))}
                className="rounded-lg px-3 py-2 focus:outline-none cursor-pointer" style={inputStyle}>
                {RARITIES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs uppercase tracking-widest" style={labelStyle}>Energy Cost</label>
              <input type="number" value={card.energyCost} onChange={e => setCard(c => ({ ...c, energyCost: e.target.value }))}
                placeholder="Empty for Legends"
                className="rounded-lg px-3 py-2 focus:outline-none" style={inputStyle} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs uppercase tracking-widest" style={labelStyle}>Power Cost</label>
              <input type="number" value={card.powerCost} onChange={e => setCard(c => ({ ...c, powerCost: e.target.value }))}
                className="rounded-lg px-3 py-2 focus:outline-none" style={inputStyle} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs uppercase tracking-widest" style={labelStyle}>Might</label>
              <input type="number" value={card.might} onChange={e => setCard(c => ({ ...c, might: e.target.value }))}
                placeholder="Only Champion/Unit/Token"
                className="rounded-lg px-3 py-2 focus:outline-none" style={inputStyle} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs uppercase tracking-widest" style={labelStyle}>Artist</label>
              <input value={card.imageArtist} onChange={e => setCard(c => ({ ...c, imageArtist: e.target.value }))}
                className="rounded-lg px-3 py-2 focus:outline-none" style={inputStyle} />
            </div>
          </div>

          <div className="mb-4 p-4 rounded-lg" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
            <label className="text-xs uppercase tracking-widest mb-3 block" style={labelStyle}>Types</label>
            <div className="flex gap-2 flex-wrap">
              {TYPES.map(t => (
                <button key={t} onClick={() => toggleArray("types", t)}
                  className="text-xs px-3 py-1.5 rounded-full transition-colors"
                  style={card.types.includes(t)
                    ? { background: "var(--accent)", color: "var(--bg-primary)" }
                    : { background: "var(--bg-primary)", color: "var(--text-secondary)", border: "1px solid var(--border)" }
                  }
                >{t}</button>
              ))}
            </div>
          </div>

          <div className="mb-4 p-4 rounded-lg" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
            <label className="text-xs uppercase tracking-widest mb-3 block" style={labelStyle}>Domains</label>
            <div className="flex gap-2 flex-wrap">
              {DOMAINS.map(d => (
                <button key={d} onClick={() => toggleArray("domains", d)}
                  className="text-xs px-3 py-1.5 rounded-full transition-colors"
                  style={card.domains.includes(d)
                    ? { background: "var(--accent)", color: "var(--bg-primary)" }
                    : { background: "var(--bg-primary)", color: "var(--text-secondary)", border: "1px solid var(--border)" }
                  }
                >{d}</button>
              ))}
            </div>
          </div>

          <div className="mb-4 flex flex-col gap-1">
            <label className="text-xs uppercase tracking-widest" style={labelStyle}>Tags (comma separated)</label>
            <input value={card.tags} onChange={e => setCard(c => ({ ...c, tags: e.target.value }))}
              placeholder="Annie, Noxus"
              className="rounded-lg px-3 py-2 focus:outline-none" style={inputStyle} />
          </div>
          <div className="mb-4 flex flex-col gap-1">
            <label className="text-xs uppercase tracking-widest" style={labelStyle}>Keywords (comma separated)</label>
            <input value={card.keywords} onChange={e => setCard(c => ({ ...c, keywords: e.target.value }))}
              placeholder="Assault 2, Shield"
              className="rounded-lg px-3 py-2 focus:outline-none" style={inputStyle} />
          </div>
          <div className="mb-4 flex flex-col gap-1">
            <label className="text-xs uppercase tracking-widest" style={labelStyle}>Card Text</label>
            <textarea rows={3} value={card.cardText} onChange={e => setCard(c => ({ ...c, cardText: e.target.value }))}
              className="rounded-lg px-3 py-2 focus:outline-none resize-y" style={inputStyle} />
          </div>
          <div className="mb-4 flex flex-col gap-1">
            <label className="text-xs uppercase tracking-widest" style={labelStyle}>Flavor Text</label>
            <textarea rows={2} value={card.flavorText} onChange={e => setCard(c => ({ ...c, flavorText: e.target.value }))}
              className="rounded-lg px-3 py-2 focus:outline-none resize-y" style={inputStyle} />
          </div>

          {/* IMAGE WITH PREVIEW */}
          <div className="mb-6 flex flex-col gap-2">
            <label className="text-xs uppercase tracking-widest" style={labelStyle}>Card Image</label>
            <div className="flex gap-4 items-start">
              <div className="flex-1">
                <input type="file" accept="image/*"
                  onChange={e => handleImageSelect(e.target.files[0])}
                  className="text-sm" style={{ color: "var(--text-secondary)" }} />
                {card.imageUrl && !imagePreview && (
                  <p className="text-xs mt-2" style={{ color: "var(--text-dim)" }}>
                    Current image will be kept unless you upload a new one
                  </p>
                )}
              </div>
              {(imagePreview || card.imageUrl) && (
                <img src={imagePreview || card.imageUrl} alt="Preview"
                  style={{ width: "120px", borderRadius: "8px", border: "1px solid var(--border)" }} />
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={handleSubmit} disabled={loading || !card.name || !card.number}
              className="px-6 py-3 rounded-lg font-bold transition-opacity"
              style={{
                background: "var(--accent)", color: "var(--bg-primary)",
                opacity: loading || !card.name || !card.number ? 0.5 : 1,
              }}>
              {loading ? "Saving..." : editing ? "Update Card" : "Save Card"}
            </button>
            <button onClick={() => {
              setCard(blankCard()); setImageFile(null); setImagePreview(null); setEditing(false); setStatus("")
            }}
              className="px-6 py-3 rounded-lg"
              style={{ color: "var(--text-secondary)", border: "1px solid var(--border)" }}>
              Clear Form
            </button>
            {status && <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{status}</p>}
          </div>
        </>
      )}

      {/* ---- CARDS LIST ---- */}
      {tab === "list" && (
        <>
          <div className="mb-4">
            <input type="text"
              placeholder="Filter by name or ID..."
              value={filter}
              onChange={e => setFilter(e.target.value)}
              className="w-full max-w-md rounded-lg px-4 py-2 focus:outline-none"
              style={inputStyle}
            />
          </div>
          <p className="mb-4 text-sm" style={{ color: "var(--text-secondary)" }}>
            {filteredCards.length} of {allCards.length} cards
          </p>
          <div className="flex flex-col gap-2">
            {filteredCards.map(c => (
              <div key={c.id}
                className="flex items-center gap-4 p-3 rounded-lg"
                style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
                {c.imageUrl ? (
                  <img src={c.imageUrl} alt={c.name} style={{ width: "40px", borderRadius: "4px" }} />
                ) : (
                  <div style={{ width: "40px", height: "56px", background: "var(--bg-primary)", borderRadius: "4px" }} />
                )}
                <div className="flex-1">
                  <p style={{ color: "var(--text-primary)" }}>{c.name}</p>
                  <p className="text-xs" style={{ color: "var(--text-dim)" }}>
                    {c.id} · {c.types.join(", ")} · {c.rarity}
                  </p>
                </div>
                <button onClick={() => editCard(c.id)}
                  className="text-sm px-3 py-1 rounded transition-colors"
                  style={{ background: "var(--accent)", color: "var(--bg-primary)" }}>
                  Edit
                </button>
                <button onClick={() => deleteCard(c.id, c.name)}
                  className="text-sm px-3 py-1 rounded transition-colors"
                  style={{ background: "rgba(220,38,38,0.2)", color: "#f87171", border: "1px solid rgba(220,38,38,0.3)" }}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ---- BULK IMPORT ---- */}
      {tab === "bulk" && (
        <>
          <p className="mb-3 text-sm" style={{ color: "var(--text-secondary)" }}>
            Paste a JSON array of card objects. Existing cards (matching id) will be updated.
          </p>
          <textarea
            rows={20}
            value={bulkText}
            onChange={e => setBulkText(e.target.value)}
            placeholder='[{"id": "OGN-001", "slug": "...", "name": "...", ...}]'
            className="w-full rounded-lg px-3 py-2 focus:outline-none resize-y font-mono text-xs"
            style={inputStyle}
          />
          <div className="flex items-center gap-4 mt-4">
            <button onClick={handleBulkImport} disabled={loading || !bulkText}
              className="px-6 py-3 rounded-lg font-bold"
              style={{
                background: "var(--accent)", color: "var(--bg-primary)",
                opacity: loading || !bulkText ? 0.5 : 1,
              }}>
              {loading ? "Importing..." : "Import Cards"}
            </button>
            {status && <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{status}</p>}
          </div>
        </>
      )}
    </div>
  )
}