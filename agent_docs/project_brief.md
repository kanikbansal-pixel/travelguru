# Project Brief — WayPoint

> Load this at the start of every session alongside AGENTS.md and MEMORY.md.
> Keep this file updated as the project scales.

---

## Product vision

WayPoint generates realistic, source-backed international trip itineraries for research-heavy leisure travelers. Every recommendation shows *why* it was chosen. Every day plan is realistic — never overpacked.

**Core differentiators:**
1. Specific, personalized rationale on every place (not "a must-visit")
2. Realistic travel-time buffers between stops
3. Edit like a document, not a chatbot

---

## Current phase

**Phase 1 — Skeleton** (check `MEMORY.md` for task-level state)

---

## Key commands

```bash
# Development
npm run dev              # Start dev server → http://localhost:3000
npm run build            # Production build (run before deploying)

# Quality
npm run typecheck        # TypeScript strict check (no emit)
npm run lint             # ESLint
npm run lint:fix         # ESLint with auto-fix

# Database
# Run SQL directly in Supabase dashboard SQL editor
# No Prisma in 48-hour MVP
```

## Environment setup

```bash
# 1. Clone
git clone https://github.com/kanikbansal-pixel/travelguru
cd travelguru

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.example .env.local
# Fill in: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,
#          SUPABASE_SERVICE_ROLE_KEY, OPENAI_API_KEY

# 4. Create trips table in Supabase SQL editor
# Copy SQL from agent_docs/resources.md

# 5. Start dev server
npm run dev
```

---

## Architecture at a glance

```
Browser
  └── Next.js 14 App Router (src/app/)
        ├── Pages (server components by default)
        ├── Client components (marked 'use client')
        └── API routes (src/app/api/**/route.ts)
              └── Calls: Supabase JS | OpenAI API
```

No separate backend. Everything is serverless Next.js on Vercel.

---

## Directory structure (48-hour MVP)

```
src/
├── app/
│   ├── page.tsx                  # Landing page
│   ├── plan/
│   │   ├── page.tsx              # Trip input form
│   │   └── [tripId]/page.tsx    # Itinerary view + editor
│   └── api/
│       ├── itinerary/
│       │   ├── generate/route.ts
│       │   └── [tripId]/day/regenerate/route.ts
│       └── trips/route.ts
├── components/
│   ├── ui/                       # shadcn/ui primitives
│   ├── trip-form/
│   │   └── TripForm.tsx
│   └── itinerary/
│       ├── ItineraryView.tsx
│       ├── DayCard.tsx
│       ├── PlaceCard.tsx
│       └── TravelTimeBadge.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts             # Browser client
│   │   └── server.ts             # Server client
│   └── openai/
│       └── generateItinerary.ts
└── types/
    └── index.ts
```

---

## Coding conventions

| Rule | Detail |
|------|--------|
| Language | TypeScript strict — no `any` |
| Components | One per file, PascalCase filename |
| Server vs client | Server by default; `'use client'` only when needed |
| Imports | Path aliases: `@/components`, `@/lib`, `@/types` |
| API validation | Zod on all request bodies before use |
| LLM output | Zod validation after parsing — never trust raw LLM JSON |
| Error shape | `{ error: string }` from all API routes |
| Comments | Only for non-obvious intent — no code narration |
| DB columns | snake_case |
| TS types/interfaces | PascalCase |
| Env vars | SCREAMING_SNAKE_CASE, in `.env.local` only |

---

## Quality gates (run before every commit)

```bash
npm run typecheck   # must pass — zero errors
npm run lint        # must pass — zero errors/warnings
```

If either fails: fix before committing. Do not suppress errors.

---

## Pre-commit hook setup (add after Phase 1)

```bash
npm install --save-dev husky lint-staged
npx husky init
# In .husky/pre-commit:
# npx lint-staged

# In package.json:
# "lint-staged": {
#   "*.{ts,tsx}": ["eslint --fix", "prettier --write"]
# }
```

---

## Update cadence

Update this file when:
- New dependencies are added (add the install command)
- The directory structure changes significantly
- New conventions are adopted
- Phase changes (update "Current phase")
