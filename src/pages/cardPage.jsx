import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getCard } from "../api"

// Domain colors for the colored pips
const DOMAIN_COLORS = {
  Fury:  "bg-red-500",
  Calm:  "bg-green-500",
  Mind:  "bg-blue-500",
  Body:  "bg-orange-500",
  Chaos: "bg-purple-500",
  Order: "bg-yellow-400",
}

const DOMAIN_TEXT_COLORS = {
  Fury:  "text-red-400",
  Calm:  "text-green-400",
  Mind:  "text-blue-400",
  Body:  "text-orange-400",
  Chaos: "text-purple-400",
  Order: "text-yellow-400",
}

function CardPage() {
  const { slug } = useParams()     // Gets the slug from the URL e.g. "annie-fiery"
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
    <div className="text-gray-400 text-center mt-20">Loading...</div>
  )

  if (error) return (
    <div className="text-red-400 text-center mt-20">{error}</div>
  )

  return (
    <div className="max-w-5xl mx-auto">

      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="text-gray-400 hover:text-white text-sm mb-6 flex items-center gap-2 transition-colors"
      >
        ← Back to card gallery
      </button>

      <div className="flex flex-col md:flex-row gap-10">

        {/* ---- LEFT — Card Image ---- */}
        <div className="flex-shrink-0">
          {card.imageUrl ? (
            <img
              src={card.imageUrl}
              alt={card.name}
              className="w-72 rounded-2xl shadow-2xl shadow-black/50"
            />
          ) : (
            <div className="w-72 aspect-[2/3] bg-gray-800 rounded-2xl flex items-center justify-center text-gray-500">
              <span className="text-6xl">🃏</span>
            </div>
          )}
        </div>

        {/* ---- RIGHT — Card Details ---- */}
        <div className="flex flex-col gap-6 flex-1">

          {/* Name + subtitle */}
          <div>
            <h1 className="text-4xl font-bold text-white">{card.name}</h1>
            <p className="text-gray-400 mt-1">{card.setName} · {card.number}</p>
          </div>

          {/* Type */}
          <div className="flex flex-col gap-1">
            <span className="text-gray-500 text-xs uppercase tracking-widest">Type</span>
            <span className="text-white font-medium">{card.types.join(" | ")}</span>
          </div>

          {/* Tags */}
          {card.tags && card.tags.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="text-gray-500 text-xs uppercase tracking-widest">Tags</span>
              <div className="flex gap-2 flex-wrap">
                {card.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-gray-700 text-gray-300 text-sm px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Domains */}
          <div className="flex flex-col gap-2">
            <span className="text-gray-500 text-xs uppercase tracking-widest">Domain</span>
            <div className="flex gap-3">
              {card.domains.map((domain) => (
                <div key={domain} className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full ${DOMAIN_COLORS[domain]}`} />
                  <span className={`font-medium ${DOMAIN_TEXT_COLORS[domain]}`}>{domain}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Casting Cost */}
          <div className="flex flex-col gap-2">
            <span className="text-gray-500 text-xs uppercase tracking-widest">Casting Cost</span>
            <div className="flex items-center gap-2">
              {/* Energy cost */}
              {card.energyCost !== null && (
                <span className="bg-gray-600 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center text-sm">
                  {card.energyCost}
                </span>
              )}
              {/* Power cost pips */}
              {Object.entries({
                Fury:  card.furyPower,
                Calm:  card.calmPower,
                Mind:  card.mindPower,
                Body:  card.bodyPower,
                Chaos: card.chaosPower,
                Order: card.orderPower,
                Wild:  card.wildPower,
              }).map(([domain, count]) =>
                Array.from({ length: count }).map((_, i) => (
                  <div
                    key={`${domain}-${i}`}
                    title={domain === "Wild" ? "Wild Power" : `${domain} Power`}
                    className={`w-8 h-8 rounded-full border-2 border-gray-900 ${
                      domain === "Wild" ? "bg-gray-300" : DOMAIN_COLORS[domain]
                    }`}
                  />
                ))
              )}
            </div>
          </div>

          {/* Might */}
          {card.might !== null && (
            <div className="flex flex-col gap-1">
              <span className="text-gray-500 text-xs uppercase tracking-widest">Might</span>
              <span className="text-yellow-400 text-2xl font-bold">⚔ {card.might}</span>
            </div>
          )}

          {/* Keywords */}
          {card.keywords.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="text-gray-500 text-xs uppercase tracking-widest">Keywords</span>
              <div className="flex gap-2 flex-wrap">
                {card.keywords.map((kw) => (
                  <span
                    key={kw}
                    className="bg-yellow-400/20 text-yellow-300 text-sm px-3 py-1 rounded font-medium"
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
              <span className="text-gray-500 text-xs uppercase tracking-widest">Card Text</span>
              <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                <p className="text-gray-200 leading-relaxed">{card.cardText}</p>
              </div>
            </div>
          )}

          {/* Flavor Text */}
          {card.flavorText && (
            <div className="flex flex-col gap-2">
              <span className="text-gray-500 text-xs uppercase tracking-widest">Flavor Text</span>
              <p className="text-gray-500 italic">{card.flavorText}</p>
            </div>
          )}

          {/* Artist */}
          {card.imageArtist && (
            <p className="text-gray-600 text-sm">🎨 Illustrated by {card.imageArtist}</p>
          )}

          {/* Legality */}
          <div className="flex gap-3 text-sm border-t border-gray-700 pt-4">
            <span className={card.legalStandard ? "text-green-400" : "text-red-400"}>
              {card.legalStandard ? "✅" : "❌"} Standard
            </span>
            <span className={card.legalCasual ? "text-green-400" : "text-red-400"}>
              {card.legalCasual ? "✅" : "❌"} Casual
            </span>
          </div>

        </div>
      </div>
    </div>
  )
}

export default CardPage