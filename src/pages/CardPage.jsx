import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getCard } from "../api"
import DOMAIN_SYMBOLS, { RECYCLE_SYMBOL, MIGHT_SYMBOL } from "../data/domains"

function CardPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [card, setCard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCard = async () => {
      setLoading(true)
      try {
        const data = await getCard(slug)
        if (data.error) setError("Card not found")
        else setCard(data)
      } catch (e) {
        setError("Failed to load card.")
      }
      setLoading(false)
    }
    fetchCard()
  }, [slug])

  if (loading) return (
    <div className="text-center mt-20" style={{ color: "var(--text-secondary)" }}>
      Loading...
    </div>
  )

  if (error) return (
    <div className="text-center mt-20" style={{ color: "#f87171" }}>
      {error}
    </div>
  )

  return (
    <div style={{ maxWidth: "1400px", margin: "0 auto" }}>

      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="text-sm mb-6 flex items-center gap-2 transition-colors duration-200"
        style={{ color: "var(--text-secondary)" }}
        onMouseEnter={e => e.currentTarget.style.color = "var(--text-primary)"}
        onMouseLeave={e => e.currentTarget.style.color = "var(--text-secondary)"}
      >
        ← Back to card gallery
      </button>

      <div style={{ display: "flex", flexDirection: "row", gap: "48px", alignItems: "flex-start" }}>

        {/* ---- LEFT — Card Image ---- */}
        <div style={{ width: "400px", flexShrink: 0 }}>
          {card.imageUrl ? (
            <img
              src={card.imageUrl}
              alt={card.name}
              style={{
                width: "400px",
                borderRadius: "16px",
                boxShadow: "0 25px 60px rgba(0,0,0,0.8), 0 0 40px rgba(220,80,20,0.15)",
              }}
            />
          ) : (
            <div style={{
              width: "400px",
              aspectRatio: "2/3",
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <span style={{ fontSize: "4rem" }}>🃏</span>
            </div>
          )}
        </div>

        {/* ---- RIGHT — Card Details ---- */}
        <div className="flex flex-col gap-6 flex-1">

          {/* Name + subtitle */}
          <div>
            <h1
              className="text-4xl font-bold leading-tight"
              style={{ color: "var(--text-primary)" }}
            >
              {card.name}
            </h1>
            <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
              {card.setName} · {card.number}
            </p>
          </div>

          {/* Type */}
          <div className="flex flex-col gap-1">
            <span className="text-xs uppercase tracking-widest" style={{ color: "var(--text-dim)" }}>
              Type
            </span>
            <span className="font-medium" style={{ color: "var(--text-primary)" }}>
              {card.types.join(" | ")}
            </span>
          </div>

          {/* Tags */}
          {card.tags && card.tags.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="text-xs uppercase tracking-widest" style={{ color: "var(--text-dim)" }}>
                Tags
              </span>
              <div className="flex gap-2 flex-wrap">
                {card.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-sm px-3 py-1 rounded-full"
                    style={{
                      background: "var(--bg-card)",
                      border: "1px solid var(--border)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Domains */}
          <div className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-widest" style={{ color: "var(--text-dim)" }}>
              Domain
            </span>
            <div className="flex gap-4">
              {card.domains.map((domain) => (
                <div key={domain} className="flex items-center gap-2">
                  <img
                    src={DOMAIN_SYMBOLS[domain]}
                    alt={domain}
                    title={domain}
                    style={{ width: "24px", height: "24px" }}
                  />
                  <span className="font-medium" style={{ color: "var(--text-primary)" }}>
                    {domain}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Casting Cost */}
          <div className="flex flex-col gap-2">
          <span className="text-xs uppercase tracking-widest" style={{ color: "var(--text-dim)" }}>
            Casting Cost
          </span>
          <div className="flex items-center gap-3">

            {/* Energy cost — white circle with black number */}
            {card.energyCost !== null && (
              <span
                className="font-black rounded-full w-8 h-8 flex items-center justify-center"
                style={{ background: "white", color: "black", fontSize: "1.1rem" }}
              >
                {card.energyCost}
              </span>
            )}

            {/* Power cost — recycle symbol + number */}
            {card.powerCost > 0 && (
              <div className="flex items-center gap-1">
                <img
                  src={RECYCLE_SYMBOL}
                  alt="Power Cost"
                  style={{ width: "24px", height: "24px" }}
                />
                <span style={{ color: "var(--text-primary)", fontWeight: "bold" }}>
                  {card.powerCost}
                </span>
              </div>
            )}

          </div>
        </div>

          {/* Might */}
          {card.might !== null && (
            <div className="flex flex-col gap-1">
              <span className="text-xs uppercase tracking-widest" style={{ color: "var(--text-dim)" }}>
                Might
              </span>
              <div className="flex items-center gap-2">
                <img
                  src={MIGHT_SYMBOL}
                  alt="Might"
                  style={{ width: "24px", height: "24px" }}
                />
                <span className="text-2xl font-bold" style={{ color: "var(--accent)" }}>
                  {card.might}
                </span>
              </div>
            </div>
          )}

          {/* Keywords */}
          {card.keywords.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="text-xs uppercase tracking-widest" style={{ color: "var(--text-dim)" }}>
                Keywords
              </span>
              <div className="flex gap-2 flex-wrap">
                {card.keywords.map((kw) => (
                  <span
                    key={kw}
                    className="text-sm px-3 py-1 rounded font-medium"
                    style={{
                      background: "var(--accent-dim)",
                      border: "1px solid rgba(245,158,11,0.3)",
                      color: "var(--accent)",
                    }}
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Card Text */}
          {card.cardText && (
            <div className="flex flex-col gap-2">
              <span className="text-xs uppercase tracking-widest" style={{ color: "var(--text-dim)" }}>
                Card Text
              </span>
              <div
                className="rounded-xl p-4"
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                }}
              >
                <p className="leading-relaxed" style={{ color: "var(--text-primary)" }}>
                  {card.cardText}
                </p>
              </div>
            </div>
          )}

          {/* Flavor Text */}
          {card.flavorText && (
            <div className="flex flex-col gap-1">
              <span className="text-xs uppercase tracking-widest" style={{ color: "var(--text-dim)" }}>
                Flavor Text
              </span>
              <p className="italic text-sm" style={{ color: "var(--text-secondary)" }}>
                {card.flavorText}
              </p>
            </div>
          )}

          {/* Artist */}
          {card.imageArtist && (
            <p className="text-sm" style={{ color: "var(--text-dim)" }}>
              🎨 Illustrated by {card.imageArtist}
            </p>
          )}

          {/* Legality */}
          <div
            className="flex gap-4 text-sm pt-4"
            style={{ borderTop: "1px solid var(--border)" }}
          >
            <span style={{ color: card.legalStandard ? "#4ade80" : "#f87171" }}>
              {card.legalStandard ? "✅" : "❌"} Standard
            </span>
            <span style={{ color: card.legalCasual ? "#4ade80" : "#f87171" }}>
              {card.legalCasual ? "✅" : "❌"} Casual
            </span>
          </div>

        </div>
      </div>
    </div>
  )
}

export default CardPage
