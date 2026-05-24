// Shows full card details when a card is clicked

const DOMAIN_COLORS = {
  Fury:  "bg-red-500",
  Calm:  "bg-green-500",
  Mind:  "bg-blue-500",
  Body:  "bg-orange-500",
  Chaos: "bg-purple-500",
  Order: "bg-yellow-400",
}

function CardModal({ card, onClose }) {
  if (!card) return null

  return (
    // Dark overlay behind the modal — clicking it closes the modal
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      {/* Modal box — stop clicks from bubbling up to the overlay */}
      <div
        className="bg-gray-800 border border-gray-600 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Card image */}
        <div className="bg-gray-700 h-56 flex items-center justify-center rounded-t-2xl relative">
          {card.imageUrl ? (
            <img src={card.imageUrl} alt={card.name} className="w-full h-full object-cover rounded-t-2xl" />
          ) : (
            <span className="text-6xl">🃏</span>
          )}

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 bg-gray-900/80 hover:bg-gray-900 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Card details */}
        <div className="p-5 flex flex-col gap-4">

          {/* Name + type row */}
          <div className="flex justify-between items-start">
            <h2 className="text-white text-xl font-bold">{card.name}</h2>
            <span className="bg-gray-700 text-gray-300 text-sm px-3 py-1 rounded-full">{card.type}</span>
          </div>

          {/* Domains */}
          <div className="flex gap-2 items-center">
            <span className="text-gray-400 text-sm">Domains:</span>
            {card.domains.map((domain) => (
              <div key={domain} className="flex items-center gap-1">
                <div className={`w-3 h-3 rounded-full ${DOMAIN_COLORS[domain]}`} />
                <span className="text-gray-300 text-sm">{domain}</span>
              </div>
            ))}
          </div>

          {/* Set + rarity + number */}
          <div className="flex gap-4 text-sm">
            <span className="text-gray-400">{card.setName} — {card.number}</span>
            <span className="text-gray-400">{card.rarity}</span>
          </div>

          {/* Cost */}
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">Cost:</span>
            {card.energyCost !== null && (
              <span className="bg-gray-600 text-white text-sm font-bold rounded-full w-7 h-7 flex items-center justify-center">
                {card.energyCost}
              </span>
            )}
            {Object.entries({
              Fury: card.furyPower, Calm: card.calmPower,
              Mind: card.mindPower, Body: card.bodyPower,
              Chaos: card.chaosPower, Order: card.orderPower,
              Wild: card.wildPower,
            }).map(([domain, count]) =>
              Array.from({ length: count }).map((_, i) => (
                <div
                  key={`${domain}-${i}`}
                  title={domain}
                  className={`w-5 h-5 rounded-full ${domain === "Wild" ? "bg-gray-300" : DOMAIN_COLORS[domain]}`}
                />
              ))
            )}
          </div>

          {/* Might */}
          {card.might !== null && (
            <div className="text-yellow-400 font-bold">⚔ {card.might} Might</div>
          )}

          {/* Keywords */}
          {card.keywords.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {card.keywords.map((kw) => (
                <span key={kw} className="bg-yellow-400/20 text-yellow-300 text-sm px-2 py-1 rounded font-medium">
                  {kw}
                </span>
              ))}
            </div>
          )}

          {/* Card text */}
          {card.cardText && (
            <div className="bg-gray-700/50 rounded-lg p-3">
              <p className="text-gray-200 text-sm leading-relaxed">{card.cardText}</p>
            </div>
          )}

          {/* Flavor text */}
          {card.flavorText && (
            <p className="text-gray-500 text-sm italic">{card.flavorText}</p>
          )}

          {/* Artist credit */}
          {card.imageArtist && (
            <p className="text-gray-600 text-xs">🎨 {card.imageArtist}</p>
          )}

          {/* Legality */}
          <div className="flex gap-3 text-xs border-t border-gray-700 pt-3">
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

export default CardModal