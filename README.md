# Oracle Lens

An open source card database, search engine, and public API for Riftbound: League of Legends TCG.

## Vision

Oracle Lens aims to be the most powerful and accessible Riftbound card resource for both players and developers. Built in the open, for the community.

## Features
- Browse and search every Riftbound card
- Advanced search with powerful filter options
- Search syntax for power users (e.g. `t:champion d:fury energy<=3`)
- Full card details including cost, keywords, card text, and artwork
- Public REST API — free for any developer to build on
- Open source — contribute card data, features, or bug fixes

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
ADMIN_PASSWORD="your_admin_password"
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

## Public API

Oracle Lens exposes a free public REST API for developers building Riftbound tools.

### Endpoints
\`\`\`
GET /api/cards              — All cards
GET /api/cards/:slug        — Single card by slug
GET /api/search             — Search and filter cards
GET /api/sets               — All sets
\`\`\`

### Search Parameters
\`\`\`
name, type, domain, rarity, set
cardText, flavorText, keyword, tag, artist, cardNumber
energyCostMin, energyCostMax, energyCostExact
powerCostMin, powerCostMax, powerCostExact
mightMin, mightMax, mightExact
legalStandard, legalCasual
sortBy, order, page, limit
\`\`\`

### Search Syntax
Oracle Lens supports a powerful search syntax for advanced queries:
\`\`\`
t:champion          → Champion type cards
d:fury              → Fury domain cards
r:epic              → Epic rarity
energy<=3           → Energy cost 3 or less
might>=5            → Might 5 or more
tag:annie           → Annie cards
kw:assault          → Cards with Assault keyword
text:damage         → Card text contains damage
-t:spell            → Exclude spells
\`\`\`

Full syntax guide available at /syntax on the live site.

## Uploading Card Images
\`\`\`bash
node upload-image.js <card-slug> ./images/<filename>.png
\`\`\`

## Sets
| Code | Name | Cards |
|------|------|-------|
| OGS | Origins - Proving Grounds | 24 |
| OGN | Origins | 298 |
| SFD | Spiritforged | 221 |
| UNL | Unleashed | 219 |

## Contributing
Contributions are welcome! Whether you want to add card data, fix a bug, build a new feature, or improve the API — open an issue or pull request on GitHub.

## Legal
Oracle Lens is unofficial fan content created under Riot Games' "Legal Jibber Jabber" policy.
Riftbound and the League of Legends Universe are the intellectual property of Riot Games, Inc.
All card names, artwork, and game data are copyright Riot Games.
Oracle Lens is not produced by, affiliated with, or endorsed by Riot Games.