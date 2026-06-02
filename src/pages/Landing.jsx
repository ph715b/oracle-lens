import { useNavigate } from "react-router-dom"
import { useState } from "react"

export default function Landing() {
  const navigate = useNavigate()
  const [search, setSearch] = useState("")

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) {
      navigate(`/cards?search=${encodeURIComponent(search)}`)
    } else {
      navigate("/cards")
    }
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden"
      style={{ background: "var(--bg-primary)" }}>

      {/* ---- BACKGROUND EFFECTS ---- */}
      {/* Central amber beam glow — mimics the Oracle Lens light beam */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 60% 70% at 50% 100%, rgba(220,80,20,0.18) 0%, rgba(180,40,10,0.08) 40%, transparent 70%)",
      }} />
      {/* Top vignette */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 80% 40% at 50% 50%, rgba(245,158,11,0.06) 0%, transparent 65%)",
      }} />
      {/* Subtle scanline texture */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.5) 2px, rgba(255,255,255,0.5) 3px)",
      }} />

      {/* ---- NAVBAR ---- */}
      <nav className="relative z-10 px-8 py-5 flex items-center justify-between"
        style={{ borderBottom: "1px solid var(--border)" }}>
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
              style={{ color: "var(--text-secondary)" }}
              onMouseEnter={e => e.target.style.color = "var(--text-primary)"}
              onMouseLeave={e => e.target.style.color = "var(--text-secondary)"}
            >
              {p}
            </button>
          ))}
        </div>
      </nav>

      {/* ---- HERO ---- */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-6">

        {/* Main headline */}
        <h2
          className="text-5xl md:text-6xl font-bold text-center mb-3 leading-tight"
          style={{
            color: "var(--text-primary)",
            textShadow: "0 0 120px rgba(220,80,20,0.3)",
          }}
        >
          The Riftbound
        </h2>
        <h2
          className="text-5xl md:text-6xl font-bold text-center mb-12 leading-tight"
          style={{
            background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 40%, #dc6014 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: "drop-shadow(0 0 30px rgba(220,80,20,0.4))",
          }}
        >
          Card Database
        </h2>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="w-full max-w-2xl relative">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search for a card..."
            autoFocus
            className="w-full rounded-2xl px-6 pr-32 py-5 text-lg focus:outline-none transition-all duration-200"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
              boxShadow: "0 0 60px rgba(220,80,20,0.08), inset 0 1px 0 rgba(255,255,255,0.03)",
            }}
            onFocus={e => e.target.style.borderColor = "var(--accent)"}
            onBlur={e => e.target.style.borderColor = "var(--border)"}
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 font-bold px-5 py-2.5 rounded-xl transition-all duration-200 text-sm"
            style={{
              background: "linear-gradient(135deg, #f59e0b, #dc6014)",
              color: "#0d0505",
              boxShadow: "0 0 20px rgba(220,80,20,0.3)",
            }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = "0 0 30px rgba(220,80,20,0.5)"}
            onMouseLeave={e => e.currentTarget.style.boxShadow = "0 0 20px rgba(220,80,20,0.3)"}
          >
            Search
          </button>
        </form>

        {/* Quick links */}
        <div className="flex items-center gap-6 mt-5">
          {[
            { label: "Browse All Cards →", path: "/cards" },
            { label: "All Sets →", path: "/sets" },
            { label: "API Docs →", path: "/api" },
          ].map((link, i, arr) => (
            <span key={link.path} className="flex items-center gap-6">
              <button
                onClick={() => navigate(link.path)}
                className="text-sm transition-colors duration-200"
                style={{ color: "var(--text-secondary)" }}
                onMouseEnter={e => e.target.style.color = "var(--accent)"}
                onMouseLeave={e => e.target.style.color = "var(--text-secondary)"}
              >
                {link.label}
              </button>
              {i < arr.length - 1 && (
                <span style={{ color: "var(--text-dim)" }}>·</span>
              )}
            </span>
          ))}
        </div>
      </div>

      {/* ---- FOOTER ---- */}
      <div className="relative z-10 px-8 py-4 flex items-center justify-between"
        style={{ borderTop: "1px solid var(--border)" }}>
        <p className="text-xs" style={{ color: "var(--text-dim)" }}>
          Oracle Lens is not endorsed by Riot Games. Card data © Riot Games.
        </p>
        <a
          href="https://github.com/ph715b/oracle-lens"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs transition-colors duration-200"
          style={{ color: "var(--text-dim)" }}
          onMouseEnter={e => e.target.style.color = "var(--accent)"}
          onMouseLeave={e => e.target.style.color = "var(--text-dim)"}
        >
           GitHub →
        </a>
      </div>
    </div>
  )
}