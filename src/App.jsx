import { Routes, Route, useNavigate, useLocation } from "react-router-dom"
import Cards from "./pages/Cards"
import CardPage from "./pages/CardPage"
import Landing from "./pages/Landing"

function App() {
  const navigate = useNavigate()
  const location = useLocation()
  const isLanding = location.pathname === "/"

  return (
    <div className="min-h-screen">

      {!isLanding && (
        <nav className="relative z-10 px-8 py-5 flex items-center justify-between"
          style={{ borderBottom: "1px solid var(--border)", background: "var(--bg-primary)" }}>
          <h1
            onClick={() => navigate("/")}
            className="text-xl font-bold cursor-pointer tracking-wide"
            style={{ color: "var(--accent)" }}
          >
            Oracle Lens
          </h1>
          <div className="flex items-center gap-6">
            {["cards", "sets", "api"].map((p) => (
              <button
                key={p}
                onClick={() => navigate(`/${p}`)}
                className="text-sm uppercase tracking-widest transition-colors duration-200"
                style={{
                  color: location.pathname === `/${p}` ? "var(--accent)" : "var(--text-secondary)"
                }}
                onMouseEnter={e => e.target.style.color = "var(--text-primary)"}
                onMouseLeave={e => {
                  e.target.style.color = location.pathname === `/${p}` ? "var(--accent)" : "var(--text-secondary)"
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </nav>
      )}

      <main className={isLanding ? "" : "p-6"}>
        <Routes>
          <Route path="/"            element={<Landing />} />
          <Route path="/cards"       element={<Cards />} />
          <Route path="/cards/:slug" element={<CardPage />} />
          <Route path="/sets"        element={<div style={{ color: "var(--text-secondary)" }}>Sets coming soon...</div>} />
          <Route path="/api"         element={<div style={{ color: "var(--text-secondary)" }}>API docs coming soon...</div>} />
        </Routes>
      </main>
    </div>
  )
}

export default App