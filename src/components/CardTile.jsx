// A single card tile displayed in the card browser grid

// Domain color mapping for the colored dot/badge on each card
const DOMAIN_COLORS = {
  Fury:  "bg-red-500",
  Calm:  "bg-green-500",
  Mind:  "bg-blue-500",
  Body:  "bg-orange-500",
  Chaos: "bg-purple-500",
  Order: "bg-yellow-400",
}

// Rarity color mapping for the rarity badge
const RARITY_COLORS = {
  Common:       "text-gray-400",
  Uncommon:     "text-teal-400",
  Rare:         "text-pink-400",
  Epic:         "text-orange-400",
  AlternateArt: "text-yellow-400",
  Signature:    "text-yellow-300",
  Promo:        "text-yellow-400",
  Champion:     "text-yellow-400",
}

function CardTile({ card, onClick }) {
  return (
    <div
      onClick={() => onClick(card)}
      className="bg-gray-800 border border-gray-700 hover:border-yellow-400/60 rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-yellow-400/10 flex flex-col"
    >
      {/* Card image area */}
      <div className="bg-gray-700 h-40 flex items-center justify-center relative">
        {card.imageUrl ? (
          // Show real image when available
          <img
            src={card.imageUrl}
            alt={card.name}
            className="w-full h-full object-cover"
          />
        ) : (
          // Placeholder until we have real images
          <div className="flex flex-col items-center gap-2 text-gray-500">
            <span className="text-3xl">🃏</span>
            <span className="text-xs">No Image</span>
          </div>
        )}

        {/* Domain dots in top right corner of image */}
        <div className="absolute top-2 right-2 flex gap-1">
          {card.domains.map((domain) => (
            <div
              key={domain}
              title={domain}   // Tooltip showing domain name on hover
              className={`w-3 h-3 rounded-full ${DOMAIN_COLORS[domain] ?? "bg-gray-400"}`}
            />
          ))}
        </div>

        {/* Card type badge in top left */}
        <div className="absolute top-2 left-2">
          <span className="bg-gray-900/80 text-gray-300 text-xs px-2 py-0.5 rounded-full">
            {card.type}
          </span>
        </div>
      </div>

      {/* Card info below image */}
      <div className="p-3 flex flex-col gap-1 flex-1">

        {/* Card name */}
        <p className="text-white font-semibold text-sm leading-tight">{card.name}</p>

        {/* Rarity and set on same row */}
        <div className="flex justify-between items-center">
          <span className={`text-xs font-medium ${RARITY_COLORS[card.rarity] ?? "text-gray-400"}`}>
            {card.rarity}
          </span>
          <span className="text-gray-500 text-xs">{card.set}</span>
        </div>

        {/* Cost row — energy + power costs */}
        <div className="flex items-center gap-1 mt-1 flex-wrap">
          {/* Energy cost bubble */}
          {card.energyCost !== null && (
            <span className="bg-gray-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
              {card.energyCost}
            </span>
          )}

          {/* Power cost dots — one colored dot per power cost pip */}
          {Object.entries({
            Fury:  card.furyPower,
            Calm:  card.calmPower,
            Mind:  card.mindPower,
            Body:  card.bodyPower,
            Chaos: card.chaosPower,
            Order: card.orderPower,
            Wild:  card.wildPower,
          }).map(([domain, count]) =>
            // Render 'count' number of dots for each domain
            Array.from({ length: count }).map((_, i) => (
              <div
                key={`${domain}-${i}`}
                title={domain === "Wild" ? "Wild Power" : `${domain} Power`}
                className={`w-4 h-4 rounded-full border-2 border-gray-900 ${
                  domain === "Wild" ? "bg-gray-300" : DOMAIN_COLORS[domain]
                }`}
              />
            ))
          )}
        </div>

        {/* Might stat — only shown for Champion, Unit, Token */}
        {card.might !== null && (
          <div className="mt-1">
            <span className="text-yellow-400 text-xs font-bold">
              ⚔ {card.might} Might
            </span>
          </div>
        )}

        {/* Keywords */}
        {card.keywords.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {card.keywords.map((kw) => (
              <span
                key={kw}
                className="bg-gray-700 text-gray-300 text-xs px-1.5 py-0.5 rounded"
              >
                {kw}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default CardTile