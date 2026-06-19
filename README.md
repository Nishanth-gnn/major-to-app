# Smart Airport Companion — MVP

This repository contains a minimal production-ready MVP for Smart Airport Companion.

Server (Express + Prisma + PostgreSQL) and Client (React + Vite + TypeScript + Tailwind).

Quick start (local):

1. Create a PostgreSQL database and set `DATABASE_URL` in `server/.env`.
2. Copy `server/.env.example` to `server/.env` and fill values.
3. Install server dependencies:

```bash
cd server
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run seed
npm run dev
```

4. Install client and run:

```bash
cd client
npm install
npm run dev
```

Environment variables:
- `DATABASE_URL` - Postgres connection string
- `JWT_SECRET` - JWT signing secret
- `OPENAI_API_KEY` - OpenAI API key

API endpoints are under `/api/*` proxied by the dev server.

Notes:
- OpenAI key is used server-side only.
- This is an MVP; streaming and advanced features can be added later.
