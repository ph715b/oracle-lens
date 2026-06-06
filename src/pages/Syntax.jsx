import { Link } from "react-router-dom"

const SECTIONS = [
  {
    title: "Names",
    operators: [
      { syntax: "annie",        desc: 'Find cards named "Annie"' },
      { syntax: "n:annie",      desc: "Explicit name search (same as above)" },
      { syntax: '"final spark"', desc: "Use quotes for multi-word names" },
    ],
  },
  {
    title: "Types",
    operators: [
      { syntax: "t:champion",   desc: "Cards with Champion type" },
      { syntax: "t:unit",       desc: "Cards with Unit type" },
      { syntax: "-t:spell",     desc: "Exclude Spell cards (minus sign negates)" },
      { syntax: "t:champion t:unit", desc: "Cards that are BOTH Champion AND Unit" },
    ],
  },
  {
    title: "Domains",
    operators: [
      { syntax: "d:fury",       desc: "Fury domain cards" },
      { syntax: "d:fury d:chaos", desc: "Cards with BOTH Fury and Chaos" },
      { syntax: "-d:order",     desc: "Cards NOT in Order domain" },
    ],
  },
  {
    title: "Sets",
    operators: [
      { syntax: "s:ogs",        desc: "Cards from Origins - Proving Grounds" },
      { syntax: "s:ogn",        desc: "Cards from Origins" },
      { syntax: "s:sfd",        desc: "Cards from Spiritforged" },
      { syntax: "s:unl",        desc: "Cards from Unleashed" },
    ],
  },
  {
    title: "Rarity",
    operators: [
      { syntax: "r:common",     desc: "Common cards" },
      { syntax: "r:uncommon",   desc: "Uncommon cards" },
      { syntax: "r:rare",       desc: "Rare cards" },
      { syntax: "r:epic",       desc: "Epic cards" },
    ],
  },
  {
    title: "Text Search",
    operators: [
      { syntax: "text:damage",         desc: "Card text contains 'damage'" },
      { syntax: 'text:"deal 2"',       desc: "Exact phrase in card text" },
      { syntax: "flavor:bear",         desc: "Flavor text contains 'bear'" },
      { syntax: "artist:vodka",        desc: "Artist name contains 'vodka'" },
    ],
  },
  {
    title: "Tags & Keywords",
    operators: [
      { syntax: "tag:demacia",  desc: "Cards tagged with 'Demacia'" },
      { syntax: "tag:annie",    desc: "All Annie cards" },
      { syntax: "kw:assault",   desc: "Cards with the Assault keyword" },
      { syntax: "kw:shield",    desc: "Cards with the Shield keyword" },
    ],
  },
  {
    title: "Numeric Stats",
    operators: [
      { syntax: "energy:5",     desc: "Energy cost exactly 5" },
      { syntax: "energy>=5",    desc: "Energy cost 5 or more" },
      { syntax: "energy<=3",    desc: "Energy cost 3 or less" },
      { syntax: "energy>4",     desc: "Energy cost greater than 4" },
      { syntax: "energy<7",     desc: "Energy cost less than 7" },
      { syntax: "might:5",      desc: "Might exactly 5" },
      { syntax: "might>=4",     desc: "Might 4 or more" },
      { syntax: "power:1",      desc: "Power cost exactly 1" },
    ],
  },
  {
    title: "Card Number",
    operators: [
      { syntax: "num:001",      desc: "Card number 001" },
      { syntax: "#:001",        desc: "Same as above (shortcut)" },
    ],
  },
  {
    title: "Legality",
    operators: [
      { syntax: "legal:standard", desc: "Standard legal cards" },
      { syntax: "legal:casual",   desc: "Casual legal cards" },
    ],
  },
  {
    title: "Combining Filters",
    operators: [
      { syntax: "t:champion d:fury",          desc: "Champions in the Fury domain" },
      { syntax: "tag:annie r:epic",           desc: "Epic Annie cards" },
      { syntax: "t:spell energy<=3",          desc: "Spells costing 3 or less energy" },
      { syntax: 'text:"deal damage" d:fury',  desc: "Fury cards that deal damage" },
    ],
  },
]

export default function Syntax() {
  return (
    <div className="max-w-5xl mx-auto">

      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-3" style={{ color: "var(--text-primary)" }}>
          Search Syntax
        </h1>
        <p className="text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          Oracle Lens supports a powerful search syntax inspired by Scryfall. Use the operators below
          in the search bar to find exactly the cards you're looking for. You can mix and match
          multiple operators to build complex queries.
        </p>
      </div>

      {/* QUICK EXAMPLE */}
      <div
        className="mb-10 p-5 rounded-xl"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
      >
        <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "var(--text-dim)" }}>
          Example
        </p>
        <code
          className="text-base font-mono px-3 py-2 rounded-lg block mb-3"
          style={{ background: "var(--bg-primary)", color: "var(--accent)" }}
        >
          t:champion d:fury r:epic
        </code>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Finds all Epic Champion cards in the Fury domain.
        </p>
      </div>

      {/* SECTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {SECTIONS.map(section => (
          <div
            key={section.title}
            className="p-5 rounded-xl"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
          >
            <h2 className="text-lg font-bold mb-4" style={{ color: "var(--accent)" }}>
              {section.title}
            </h2>
            <div className="flex flex-col gap-3">
              {section.operators.map(op => (
                <div key={op.syntax} className="flex flex-col gap-1">
                  <code
                    className="text-sm font-mono px-2 py-1 rounded inline-block w-fit"
                    style={{ background: "var(--bg-primary)", color: "var(--accent)" }}
                  >
                    {op.syntax}
                  </code>
                  <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                    {op.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* TIPS */}
      <div className="mt-10 p-5 rounded-xl" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h2 className="text-lg font-bold mb-3" style={{ color: "var(--accent)" }}>Tips</h2>
        <ul className="flex flex-col gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
          <li>• All searches are case-insensitive</li>
          <li>• Use quotes for multi-word values: <code style={{ color: "var(--accent)" }}>text:"deal damage"</code></li>
          <li>• Prefix with minus to exclude: <code style={{ color: "var(--accent)" }}>-t:spell</code></li>
          <li>• Bare words search card names by default</li>
          <li>• You can also use the <Link to="/advanced" style={{ color: "var(--accent)" }}>Advanced Search</Link> page for a visual filter builder</li>
        </ul>
      </div>
    </div>
  )
}