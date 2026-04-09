# Tech Stack — WayPoint MVP

> Finalised after tech design phase. Use this as the reference for all implementation decisions.

---

## Stack — two phases

### 48-hour MVP (use this to ship first)

| Concern | Choice | Notes |
|---------|--------|-------|
| Framework | **Next.js 14 (App Router)** | SSR + client components; API routes as serverless functions |
| Language | **TypeScript (strict)** | Required across all files |
| Styling | **Tailwind CSS + shadcn/ui** | shadcn/ui for accessible component primitives |
| Database | **Supabase (PostgreSQL, Supabase JS client)** | Direct JS client — no Prisma in 48-hour build |
| Storage schema | **Single `trips` table with jsonb columns** | Raw inputs + full itinerary JSON; migrate to normalised schema post-MVP |
| Auth | **Supabase Auth (email only)** | Drop Google OAuth for now — adds config time |
| LLM | **OpenAI GPT-4o (JSON mode)** | Generates entire itinerary in one call: places, rationale, travel time, source labels |
| Place data | **LLM-generated** | No Foursquare in 48-hour build |
| Community signals | **LLM-authored source labels** | No Reddit API in 48-hour build |
| Maps | **Mapbox Static Images API (optional)** | REST call returns a PNG — 30 min to integrate; skip if time-constrained |
| Deployment | **Vercel** | Automatic preview per branch; native Next.js support |

### Production additions (v1.1, post-MVP validation)

| Concern | Choice | Notes |
|---------|--------|-------|
| ORM | **Prisma** | Migrate after schema stabilises |
| Place data | **Foursquare Places API** | Real place IDs, coordinates, ratings |
| Community signals | **Reddit API (read-only)** | Real post links per destination |
| Maps (interactive) | **Mapbox GL JS + react-map-gl** | Add after validating map is worth the complexity |
| Routing / travel time | **Mapbox Directions API** | Cache aggressively |
| Auth additions | **Google OAuth** | Add after email auth is validated |
| Error tracking | **Sentry (free tier)** | Add before public launch |
| Analytics | **Posthog (free tier)** | Add before public launch |
| Testing (unit) | **Vitest** | Add with Prisma migration |
| Testing (E2E) | **Playwright** | Add after core flow stabilises |

---

## Architecture pattern

Single Next.js app: frontend + API routes (serverless). No separate backend service.

```
Browser → Next.js API Routes (Vercel) → Supabase / OpenAI / Mapbox / Foursquare / Reddit
```

---

## Key design decisions

1. **Anonymous generation, sign-in to save.** Users generate without an account. Sign-in unlocks saving.

2. **48-hour MVP: LLM does everything in one call.** The LLM generates the full itinerary structure — places, rationale, travel time estimates, source labels, day grouping — in a single GPT-4o call with a detailed system prompt. A thin post-processing step enforces hard limits (max 5 places/day, bounding-box validation, non-empty rationale check).

3. **V1.1+: Deterministic scheduling + real sources.** Foursquare for place data, Reddit API for community signals, Mapbox for routing, and a rule-based scheduler replace the LLM-as-scheduler approach. LLM is then used only for rationale text.

4. **jsonb storage first, Prisma schema after validation.** The 48-hour MVP stores the full itinerary as `jsonb`. Normalised Prisma schema comes after the data model is proven stable.

5. **rationale is required.** Enforced in the system prompt, in post-processing, and eventually in the DB schema. Never return a place without it.

6. **V1 scope: one city per trip.** Two-city support deferred.

7. **Top 10 destinations at launch.** Quality over coverage. Manually QA each destination before exposing it.

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

### 48-hour MVP (minimum)
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
OPENAI_API_KEY
```

### Production additions
```
NEXT_PUBLIC_MAPBOX_TOKEN
MAPBOX_TOKEN
FOURSQUARE_API_KEY
REDDIT_CLIENT_ID
REDDIT_CLIENT_SECRET
REDDIT_USER_AGENT=waypoint/1.0
SENTRY_DSN
NEXT_PUBLIC_POSTHOG_KEY
NEXT_PUBLIC_POSTHOG_HOST
```

---

## Full technical design

See `docs/TechDesign-WayPoint-MVP.md` for architecture diagram, full data schema, API design, pipeline breakdown, and build phase order.
