# Tech Stack — WayPoint MVP

> Finalised after tech design phase. Use this as the reference for all implementation decisions.

---

## Confirmed stack

| Concern | Choice | Notes |
|---------|--------|-------|
| Framework | **Next.js 14 (App Router)** | SSR + client components; API routes as serverless functions |
| Language | **TypeScript (strict)** | Required across all files |
| Styling | **Tailwind CSS + shadcn/ui** | shadcn/ui for accessible component primitives |
| Database | **Supabase (PostgreSQL)** | Auth, storage, and DB in one managed service |
| ORM | **Prisma** | Type-safe schema + migrations |
| Auth | **Supabase Auth** | Email + Google OAuth; anonymous generation allowed |
| LLM | **OpenAI GPT-4o (JSON mode)** | Rationale generation and quality check only |
| Place data | **Foursquare Places API** | 100k requests/month free tier |
| Community signals | **Reddit API (read-only)** | Travel subreddits; summary + link only |
| Maps | **Mapbox GL JS + react-map-gl** | 50k map loads/month free tier |
| Routing / travel time | **Mapbox Directions API** | Cached aggressively |
| Deployment | **Vercel** | Automatic preview per branch; native Next.js support |
| Error tracking | **Sentry (free tier)** | Required before launch |
| Analytics | **Posthog (free tier)** | Product funnel analytics |
| Testing (unit) | **Vitest** | |
| Testing (E2E) | **Playwright** | |

---

## Architecture pattern

Single Next.js app: frontend + API routes (serverless). No separate backend service.

```
Browser → Next.js API Routes (Vercel) → Supabase / OpenAI / Mapbox / Foursquare / Reddit
```

---

## Key design decisions

1. **Anonymous generation, sign-in to save.** Users can generate without an account. Sign-in (Supabase Auth) unlocks saving and viewing saved trips.

2. **Deterministic scheduling first, LLM last.** The itinerary builder uses rules (max stops/day, time blocks, geographic grouping) before calling the LLM. LLM is only used for rationale text and a quality check pass.

3. **All API calls are cached.** Foursquare results: 7 days. Mapbox route results: 30 days. LLM rationale: 14 days. Reddit mentions: 24 hours. This keeps costs near zero at MVP scale.

4. **rationale is non-nullable at the DB level.** PlaceSlot.rationale is required in the Prisma schema, enforcing the product's core trust layer at the data layer.

5. **V1 scope: one city per trip.** Two-city support is deferred to reduce scope risk.

6. **Top 10 destinations at launch.** Quality is more important than coverage. Manually QA each destination.

---

## Cost reference (MVP scale)

| Scale | Monthly estimate |
|-------|----------------|
| 0–500 users | $0–$15 |
| 500–2000 users | $30–$80 |
| 2000–10000 users | $100–$300 |

Set an OpenAI spending cap at $20/month during development. Rate limit itinerary generation to 3 per IP per hour.

---

## Environment variables needed

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
OPENAI_API_KEY
NEXT_PUBLIC_MAPBOX_TOKEN
MAPBOX_TOKEN
FOURSQUARE_API_KEY
REDDIT_CLIENT_ID
REDDIT_CLIENT_SECRET
REDDIT_USER_AGENT
SENTRY_DSN
NEXT_PUBLIC_POSTHOG_KEY
NEXT_PUBLIC_POSTHOG_HOST
```

---

## Full technical design

See `docs/TechDesign-WayPoint-MVP.md` for architecture diagram, full data schema, API design, pipeline breakdown, and build phase order.
