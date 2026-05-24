import { useState } from "react"
import Cards from "./pages/Cards"

function App() {
  const [page, setPage] = useState("cards")

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="bg-gray-800 border-b border-yellow-400/30 px-6 py-4 flex items-center gap-8">
        <h1 className="text-xl font-bold text-yellow-400 mr-4">Oracle Lens</h1>
        {["cards", "sets", "api"].map((p) => (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={`uppercase text-sm font-medium tracking-wide transition-colors ${
              page === p
                ? "text-yellow-400 border-b-2 border-yellow-400 pb-0.5"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {p}
          </button>
        ))}
      </nav>

      <main className="p-6">
        {page === "cards"  && <Cards />}
        {page === "sets"   && <div className="text-gray-400">Sets coming soon...</div>}
        {page === "api"    && <div className="text-gray-400">API docs coming soon...</div>}
      </main>
    </div>
  )
}

export default App