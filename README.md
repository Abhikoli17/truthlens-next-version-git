# TruthLens V2 — Live News + Explainable Verification

TruthLens V2 is an upgraded Next.js project that:
- fetches live news from NewsAPI
- extracts a main claim from each story using AI or a built-in fallback
- checks matching fact-check results using Google Fact Check Tools API
- saves analyses into a database
- provides a protected admin dashboard
- lets you tune trust lists and thresholds
- stores user feedback on verdict quality

## What is new in V2

- Database-backed saved analyses
- Admin login with cookie-based auth
- Admin settings panel
- AI claim extraction using OpenAI-compatible chat completions
- Feedback API
- Better upsert and review flow

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Prisma ORM
- SQLite for local development
- NewsAPI
- Google Fact Check Tools API
- Optional OpenAI-compatible API for claim extraction

## Run locally

### 1. Install dependencies

```bash
npm install
```

### 2. Create the environment file

Copy `.env.example` to `.env.local`.

Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

macOS/Linux:

```bash
cp .env.example .env.local
```

### 3. Set your keys

Required:
- `NEWS_API_KEY`
- `JWT_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

Recommended:
- `GOOGLE_FACTCHECK_API_KEY`

Optional:
- `OPENAI_API_KEY`
- `OPENAI_MODEL`

### 4. Create the database and seed config

```bash
npm run prisma:generate
npm run prisma:push
npm run seed
```

### 5. Start the app

```bash
npm run dev
```

Open `http://localhost:3000`.

## Admin login

Go to `/admin/login` and sign in with:
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

## Deploy

### Vercel
1. Push the folder to GitHub.
2. Import the repo into Vercel.
3. Add the environment variables in Vercel.
4. For production database, change `DATABASE_URL` from SQLite to a hosted PostgreSQL connection and update the Prisma provider if needed.

## Recommended production upgrade

For production, switch Prisma from SQLite to PostgreSQL:
- update `prisma/schema.prisma`
- change `provider = "sqlite"` to `provider = "postgresql"`
- use Neon, Supabase, Railway, or another hosted database

## Main routes

- `/` live dashboard
- `/saved` saved analyses
- `/admin/login` admin sign in
- `/admin` admin dashboard

## Main API routes

- `GET /api/news`
- `POST /api/analyze`
- `POST /api/feedback`
- `POST /api/admin/login`
- `POST /api/admin/config`
- `POST /api/admin/logout`

## Important note

This project is an evidence-based credibility assistant, not a perfect truth detector. It helps users verify news faster, but human review still matters.
