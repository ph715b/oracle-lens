# Oracle Lens

An open source card database and browser for Riftbound, inspired by Scryfall.

## Features
- Browse and search every Riftbound card
- Filter by type, domain, rarity, and set
- Full card details including cost, keywords, card text, and artwork
- Click any card to see its full detail page
- Public API for developers to build their own Riftbound tools

## Tech Stack
- React + Vite + Tailwind CSS
- Node.js + Express
- PostgreSQL + Prisma
- Cloudflare R2 (image hosting)

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL

### Installation
\`\`\`bash
git clone https://github.com/ph715b/oracle-lens
cd oracle-lens
npm install
\`\`\`

### Setup

1. Create a `.env` file in the project root:
\`\`\`
DATABASE_URL="postgresql://postgres:YOURPASSWORD@localhost:5432/oraclelens"
CLOUDFLARE_ACCOUNT_ID="your_account_id"
CLOUDFLARE_R2_BUCKET="oracle-lens-cards"
CLOUDFLARE_R2_PUBLIC_URL="your_public_bucket_url"
CLOUDFLARE_R2_ACCESS_KEY_ID="your_access_key_id"
CLOUDFLARE_R2_SECRET_ACCESS_KEY="your_secret_access_key"
\`\`\`

2. Run database migrations:
\`\`\`bash
npx prisma migrate dev
\`\`\`

3. Seed the database:
\`\`\`bash
npm run seed
\`\`\`

4. Start the servers in two separate terminals:
\`\`\`bash
npm run dev
node server.js
\`\`\`

5. Open your browser at http://localhost:5173

## API Endpoints

\`\`\`
GET /cards              — Returns all cards
GET /cards/:slug        — Returns a single card by slug
GET /search             — Search and filter cards
GET /sets               — Returns all sets
\`\`\`

### Search Parameters
\`\`\`
/search?name=annie
/search?type=Champion
/search?domain=Fury
/search?rarity=Rare
/search?set=OGS
\`\`\`

## Uploading Card Images
\`\`\`bash
node upload-image.js <card-slug> ./images/<filename>.png
\`\`\`

## Card Schema

Each card includes the following fields:
- `id`, `slug`, `name` — identifiers
- `set`, `setName`, `number` — set information
- `types` — array of card types (Champion, Legend, Unit, Token, Spell, Signature, Rune, Gear, Battlefield)
- `domains` — array of domains (Fury, Calm, Mind, Body, Chaos, Order)
- `tags` — array of tags (champion name, region, race, etc.)
- `rarity` — Common, Uncommon, Rare, Epic, AlternateArt, Promo, Champion
- `energyCost`, `powerCost`, `alternateCost` — cost information
- `might`, `mightBonus` — combat stats
- `huntValue`, `levelThreshold`, `levelAbility` — XP and level mechanics
- `cardText`, `flavorText`, `keywords` — card text
- `imageUrl`, `imageArtist` — artwork
- `legalStandard`, `legalCasual` — legality

## Sets
| Code | Name | Cards |
|------|------|-------|
| OGS | Origins - Proving Grounds | 24 |
| OGN | Origins | 298 |
| SFD | Spiritforged | 221 |
| UNL | Unleashed | 219 |

## Contributing
Contributions are welcome! If you want to add card data, fix a bug, or suggest
a feature feel free to open an issue or pull request.

## Legal
Oracle Lens was created under Riot Games' "Legal Jibber Jabber" policy using
assets owned by Riot Games. Riot Games does not endorse or sponsor this project.
Card names, artwork, and game data are the property of Riot Games.