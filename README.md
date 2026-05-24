# Oracle Lens

A community-built card database and browser for Riftbound, inspired by Scryfall.

## Features
- Browse and search every Riftbound card
- Filter by type, domain, rarity, and set
- Full card details including cost, keywords, and rulings
- Open REST API for developers

## Tech Stack
- React + Vite + Tailwind CSS
- Node.js + Express
- PostgreSQL + Prisma

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL

### Installation
```bash
git clone https://github.com/YOURUSERNAME/oracle-lens
cd oracle-lens
npm install
```

### Setup
1. Create a `.env` file in the project root:

2. Run database migrations:
```bash
npx prisma migrate dev
```

3. Seed the database:
```bash
npm run seed
```

4. Start the development server:
```bash
npm run dev
node server.js
```

## Contributing
Contributions are welcome! If you'd like to add card data, fix a bug, or suggest
a feature, feel free to open an issue or pull request.

## Legal
Oracle Lens was created under Riot Games' "Legal Jibber Jabber" policy using
assets owned by Riot Games. Riot Games does not endorse or sponsor this project.