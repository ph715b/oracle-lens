import { useNavigate } from "react-router-dom"

function CardTile({ card }) {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/cards/${card.slug}`)}
      className="cursor-pointer rounded-lg overflow-hidden transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-black/50"
    >
      {card.imageUrl ? (
        <img
          src={card.imageUrl}
          alt={card.name}
          className="w-full h-auto object-cover"
        />
      ) : (
        <div className="bg-gray-800 border border-gray-700 rounded-lg aspect-[2/3] flex flex-col items-center justify-center gap-2 text-gray-500">
          <span className="text-4xl">🃏</span>
          <span className="text-xs text-center px-2">{card.name}</span>
        </div>
      )}
    </div>
  )
}

export default CardTile