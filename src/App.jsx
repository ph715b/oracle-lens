import { Routes, Route, useNavigate } from "react-router-dom"
import Cards from "./pages/Cards"
import CardPage from "./pages/CardPage"

function App() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navbar */}
      <nav className="bg-gray-800 border-b border-yellow-400/30 px-6 py-4 flex items-center gap-8">
        {/* Clicking logo goes home */}
        <h1
          onClick={() => navigate("/")}
          className="text-xl font-bold text-yellow-400 mr-4 cursor-pointer"
        >
          ⚡ Oracle Lens
        </h1>

        <button
          onClick={() => navigate("/")}
          className="uppercase text-sm font-medium tracking-wide text-gray-400 hover:text-white transition-colors"
        >
          Cards
        </button>
        <button
          onClick={() => navigate("/sets")}
          className="uppercase text-sm font-medium tracking-wide text-gray-400 hover:text-white transition-colors"
        >
          Sets
        </button>
        <button
          onClick={() => navigate("/api")}
          className="uppercase text-sm font-medium tracking-wide text-gray-400 hover:text-white transition-colors"
        >
          API
        </button>
      </nav>

      {/* Routes */}
      <main className="p-6">
        <Routes>
          <Route path="/"              element={<Cards />} />
          <Route path="/cards/:slug"   element={<CardPage />} />
          <Route path="/sets"          element={<div className="text-gray-400">Sets coming soon...</div>} />
          <Route path="/api"           element={<div className="text-gray-400">API docs coming soon...</div>} />
        </Routes>
      </main>
    </div>
  )
}

export default App