# Technical Design Document: WayPoint MVP

**Version:** 1.0  
**Date:** April 2026  
**Architecture Pattern:** Full-stack monorepo, serverless-friendly  
**Approach:** Developer/in-between — AI-assisted build in Cursor

---

## Executive Summary

WayPoint is a web app that generates realistic, source-backed international trip itineraries. The MVP targets solo development with a low budget, using managed services where possible and free tiers for the build phase. The system is meaningfully more complex than a simple CRUD app — it has an LLM pipeline, place data retrieval, map routing, and an interactive itinerary editor — so the stack is chosen to minimize infrastructure management while keeping full control over product logic.

**Primary stack:** Next.js 14 (App Router) + Supabase + OpenAI API + Mapbox GL JS + Vercel  
**Estimated monthly cost at MVP scale (0–500 users):** $0–$40  
**Estimated cost at early traction (500–2000 users):** $40–$120

---

## Platform Decision

**Web app only.** This matches the PRD, the target user (comfortable with web tools, desktop research behaviour), and the solo/low-budget constraint. Native mobile adds 4–8x the complexity for the same audience.

---

## Architecture Overview

```
┌──────────────────────────────────────────────────────────┐
│  Browser (Next.js SSR + Client)                          │
│  - Trip input form                                       │
│  - Itinerary editor (drag/remove/replace/regenerate)     │
│  - Map view (Mapbox GL JS)                               │
└─────────────────────┬────────────────────────────────────┘
                      │ HTTPS
┌─────────────────────▼────────────────────────────────────┐
│  Next.js API Routes (Vercel serverless functions)         │
│  - /api/itinerary/generate                               │
│  - /api/itinerary/[id]/day/regenerate                    │
│  - /api/places/search                                    │
│  - /api/trips (CRUD)                                     │
└──────┬──────────────┬──────────────┬─────────────────────┘
       │              │              │
┌──────▼──────┐ ┌─────▼──────┐ ┌────▼──────────────────────┐
│  Supabase   │ │ OpenAI API │ │  Mapbox API               │
│  PostgreSQL │ │  GPT-4o    │ │  - Geocoding              │
│  Auth       │ │  (ranking  │ │  - Directions (travel     │
│  Storage    │ │  + rationale│ │    time estimates)        │
└─────────────┘ └────────────┘ └───────────────────────────┘
                      │
              ┌───────▼───────────┐
              │  Place data layer │
              │  - Foursquare API │
              │  - Reddit API     │
              │  (V1 source set)  │
              └───────────────────┘
```

The architecture is intentionally simple: one Next.js app handles both frontend and backend API routes, deployed as serverless functions on Vercel. No separate backend service to maintain.

---

## Tech Stack Decisions

### Decision table with alternatives

| Concern | Recommended | Alternative A | Alternative B | Why recommended |
|---------|------------|---------------|---------------|-----------------|
| Frontend framework | **Next.js 14 (App Router)** | SvelteKit | Remix | Largest AI training corpus, best Vercel integration, SSR + client components in one framework. AI tools like Cursor know it extremely well. |
| Styling | **Tailwind CSS + shadcn/ui** | Chakra UI | Custom CSS | shadcn/ui gives polished, accessible components without a runtime; Tailwind keeps the bundle lean |
| Backend | **Next.js API Routes** | Express on Railway | Fastify on Fly.io | Zero-infrastructure option; co-located with frontend; easy to add background jobs via Vercel Cron |
| Database | **Supabase (PostgreSQL)** | PlanetScale (MySQL) | Firebase Firestore | Relational model fits trip/day/place hierarchy well; Supabase gives auth + storage + real-time out of the box; generous free tier |
| Auth | **Supabase Auth** | Clerk | Auth.js (NextAuth) | Already included in Supabase; no extra service; supports email + OAuth; auth is not a differentiator — don't over-engineer it |
| LLM | **OpenAI GPT-4o** | Anthropic Claude 3.5 Sonnet | Gemini 1.5 Pro | Best balance of quality, latency, structured output support (JSON mode), and pricing at MVP scale. Easy to swap provider later. |
| Place data | **Foursquare Places API** | Google Places API | OpenStreetMap/Overpass | Google Places is expensive at scale; Foursquare has a generous free tier (100k requests/month), good international coverage, and structured place metadata |
| Maps | **Mapbox GL JS** | Google Maps JS API | Leaflet + OSM tiles | Mapbox has a generous free tier (50k map loads/month), excellent custom styling, and clean React integration via react-map-gl |
| Routing / travel time | **Mapbox Directions API** | Google Routes API | OpenRouteService | Same provider as map tiles; cheaper than Google at low scale; returns travel time and polyline |
| Social content sourcing | **Reddit API (read-only)** | Manual curation only | Tavily Search API | Reddit's developer API allows read-only access to travel subreddits within rate limits. Start here; expand later |
| ORM | **Prisma** | Drizzle ORM | Raw SQL via postgres.js | Prisma has the best type safety + migration story for a solo developer; generates TypeScript types from schema automatically |
| Deployment | **Vercel** | Cloudflare Pages | Railway | Native Next.js support; automatic preview deployments per branch; free tier covers MVP scale |
| Monitoring | **Sentry (free tier)** | LogRocket | Datadog | Error tracking is critical; Sentry free tier is sufficient for MVP |
| Analytics | **Posthog (free tier)** | Mixpanel | Google Analytics | Posthog gives product analytics (funnel, session replay) on a generous free tier; self-hostable later |

---

## Frontend Architecture

```
src/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── plan/
│   │   ├── page.tsx                # Trip input form (step 1)
│   │   └── [tripId]/
│   │       ├── page.tsx            # Itinerary view + editor
│   │       └── loading.tsx         # Loading state during generation
│   ├── api/
│   │   ├── itinerary/
│   │   │   ├── generate/route.ts   # POST — generate full itinerary
│   │   │   └── [id]/
│   │   │       └── day/
│   │   │           └── regenerate/route.ts  # POST — regenerate one day
│   │   ├── places/
│   │   │   └── search/route.ts     # GET — search/replace a place
│   │   └── trips/
│   │       └── route.ts            # GET/POST — save/list trips
│   └── layout.tsx
├── components/
│   ├── ui/                         # shadcn/ui primitives (Button, Card, etc.)
│   ├── trip-form/
│   │   ├── TripForm.tsx            # Multi-step trip input
│   │   ├── DestinationStep.tsx
│   │   ├── DatesStep.tsx
│   │   ├── PreferencesStep.tsx
│   │   └── ReviewStep.tsx
│   ├── itinerary/
│   │   ├── ItineraryView.tsx       # Container for the full itinerary
│   │   ├── DayCard.tsx             # One day's plan
│   │   ├── PlaceCard.tsx           # One place with rationale + source
│   │   ├── TravelTimeBadge.tsx     # Time between stops
│   │   └── PlaceEditor.tsx         # Remove/replace/reorder controls
│   └── map/
│       ├── TripMap.tsx             # Mapbox map component
│       └── RouteLayer.tsx          # Polyline overlay between stops
├── lib/
│   ├── supabase/
│   │   ├── client.ts               # Browser Supabase client
│   │   └── server.ts               # Server Supabase client
│   ├── openai/
│   │   ├── generateItinerary.ts    # Core LLM pipeline
│   │   └── generateRationale.ts    # Per-place rationale
│   ├── places/
│   │   ├── foursquare.ts           # Foursquare API wrapper
│   │   └── reddit.ts               # Reddit API wrapper
│   ├── mapbox/
│   │   ├── geocode.ts              # Geocoding utility
│   │   └── directions.ts           # Travel time fetcher
│   ├── itinerary/
│   │   ├── builder.ts              # Deterministic scheduling logic
│   │   └── rules.ts                # Max stops/day, time blocks, buffers
│   └── utils/
│       └── cache.ts                # Simple in-memory + Supabase cache
├── hooks/
│   ├── useItinerary.ts             # Itinerary state + edit actions
│   └── useMap.ts                   # Map state
├── types/
│   └── index.ts                    # Shared TypeScript types
└── styles/
    └── globals.css
```

---

## Backend / API Design

All backend logic runs as Next.js API routes (serverless functions on Vercel).

### Core endpoints

```typescript
// Generate a full itinerary
POST /api/itinerary/generate
Body: {
  destination: string
  startDate: string       // ISO date
  endDate: string
  budgetLevel: 'budget' | 'mid' | 'luxury'
  pace: 'relaxed' | 'moderate' | 'packed'
  interests: string[]
  mustDo: string[]
  mustAvoid: string[]
}
Response: {
  tripId: string
  itinerary: Itinerary
}

// Regenerate one day without touching others
POST /api/itinerary/[tripId]/day/regenerate
Body: { dayIndex: number; reason?: string }
Response: { day: Day }

// Search for a replacement place
GET /api/places/search?destination=Tokyo&category=food&exclude=place_id_1,place_id_2
Response: { places: Place[] }

// Save a trip
POST /api/trips
Body: { tripId: string }
Response: { saved: true }

// List saved trips for authenticated user
GET /api/trips
Response: { trips: TripSummary[] }
```

---

## Data Model

### Prisma schema (PostgreSQL via Supabase)

```prisma
model User {
  id         String   @id @default(uuid())
  email      String   @unique
  createdAt  DateTime @default(now())
  trips      Trip[]
}

model Trip {
  id          String    @id @default(uuid())
  userId      String?   // nullable — allow anonymous trip generation
  destination String
  startDate   DateTime
  endDate     DateTime
  budgetLevel String    // 'budget' | 'mid' | 'luxury'
  pace        String    // 'relaxed' | 'moderate' | 'packed'
  interests   String[]
  mustDo      String[]
  mustAvoid   String[]
  status      String    @default("draft")  // 'draft' | 'saved'
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  itinerary   Itinerary?
  user        User?     @relation(fields: [userId], references: [id])

  @@index([userId])
}

model Itinerary {
  id        String   @id @default(uuid())
  tripId    String   @unique
  days      Day[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  trip      Trip     @relation(fields: [tripId], references: [id])
}

model Day {
  id          String     @id @default(uuid())
  itineraryId String
  dayIndex    Int        // 0-based
  date        DateTime
  placeSlots  PlaceSlot[]
  itinerary   Itinerary  @relation(fields: [itineraryId], references: [id])

  @@index([itineraryId])
}

model PlaceSlot {
  id             String   @id @default(uuid())
  dayId          String
  slotIndex      Int      // order within day
  place          Place    @relation(fields: [placeId], references: [id])
  placeId        String
  rationale      String   // why this place was chosen — required
  travelTimeNext Int?     // minutes to next stop
  day            Day      @relation(fields: [dayId], references: [id])

  @@index([dayId])
}

model Place {
  id          String      @id @default(uuid())
  externalId  String?     // Foursquare place ID
  name        String
  description String
  category    String
  lat         Float
  lng         Float
  address     String?
  city        String
  sources     Source[]
  placeSlots  PlaceSlot[]

  @@index([city])
  @@index([externalId])
}

model Source {
  id      String  @id @default(uuid())
  placeId String
  label   String  // e.g. "r/JapanTravel", "Lonely Planet"
  url     String
  type    String  // 'reddit' | 'blog' | 'guidebook' | 'foursquare'
  place   Place   @relation(fields: [placeId], references: [id])
}
```

**Key design decisions:**
- `userId` on Trip is nullable — users can generate an itinerary without signing in. Sign-in is required only to save.
- `rationale` on PlaceSlot is non-nullable in the schema — enforced at the DB level, not just application level.
- `Place` is reusable across trips (cache by `externalId`) to avoid redundant API calls.
- `Source` is a separate table so multiple sources can back a single place.

---

## Itinerary Generation Pipeline

This is the most complex part of the system. It has three stages: **data gathering**, **deterministic scheduling**, and **LLM enrichment**. LLM is used for rationale and ranking only — not for scheduling logic.

```
User input
    │
    ▼
1. PLACE GATHERING
   ├── Foursquare Places API → candidate places by category + location
   ├── Reddit API → subreddit search for destination (read-only, summarised)
   └── Cached places from previous trips to same city
    │
    ▼
2. DETERMINISTIC SCHEDULING (no LLM)
   ├── Filter by user interests and must-avoid
   ├── Score by: source agreement, category match, distance from city centre
   ├── Group by geography (neighbourhood clusters)
   ├── Assign to days: max 4–5 places/day, time-block-aware
   ├── Fetch travel times (Mapbox Directions API) between consecutive stops
   └── Enforce: realistic buffers (30–60 min transit, 1–2 hr visits per type)
    │
    ▼
3. LLM ENRICHMENT (OpenAI GPT-4o, JSON mode)
   ├── Generate rationale string per place: why this fits this user's trip
   ├── Generate day-level summary (2–3 sentences)
   └── Quality check: flag implausible slots for review
    │
    ▼
Itinerary object → persisted to DB → returned to client
```

### LLM prompt pattern (rationale generation)

```typescript
// generateRationale.ts
const prompt = `
You are a travel planning assistant for WayPoint.

User profile:
- Destination: ${destination}
- Interests: ${interests.join(', ')}
- Pace: ${pace}
- Budget: ${budgetLevel}

Place:
- Name: ${place.name}
- Category: ${place.category}
- Description: ${place.description}
- Sources: ${place.sources.map(s => s.label).join(', ')}

Write a 2-sentence rationale explaining specifically why this place suits this traveler.
Do not use generic phrases like "a must-visit" or "popular attraction".
Be specific to their interests.

Respond in JSON: { "rationale": "..." }
`;
```

**Cost control:**
- Rationale is generated once per PlaceSlot and cached. No re-calling for the same place + user-profile combination.
- Budget: at 5 places/day × 6 days = 30 LLM calls per itinerary. GPT-4o at ~$0.01 per call = ~$0.30 per full itinerary generation. Acceptable.

---

## Maps and Routing

**Mapbox GL JS** renders the interactive map. **react-map-gl** is the React wrapper.

```typescript
// mapbox/directions.ts
export async function getTravelTime(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number },
  mode: 'walking' | 'driving' | 'transit' = 'walking'
): Promise<{ minutes: number; polyline: string }> {
  const url = `https://api.mapbox.com/directions/v5/mapbox/${mode}/` +
    `${from.lng},${from.lat};${to.lng},${to.lat}` +
    `?access_token=${process.env.MAPBOX_TOKEN}&geometries=geojson&overview=simplified`;

  // Cache key: from+to+mode — store result in Supabase for 30 days
  const cached = await getCached(cacheKey(from, to, mode));
  if (cached) return cached;

  const res = await fetch(url);
  const data = await res.json();
  const result = {
    minutes: Math.round(data.routes[0].duration / 60),
    polyline: data.routes[0].geometry
  };

  await setCache(cacheKey(from, to, mode), result, 30 * 24 * 60);
  return result;
}
```

**Caching strategy:** Route results between the same two points are cached in Supabase for 30 days. This keeps Mapbox API calls very low — the free tier (100k requests/month) will cover MVP usage comfortably.

---

## Authentication

**Supabase Auth** with two modes:

| Mode | Capability |
|------|-----------|
| Anonymous | Generate + view itinerary, but cannot save |
| Signed in (email / Google OAuth) | Save, access saved trips |

This removes the sign-in gate from the core value proposition. Users can try the product without an account, converting to sign-in only when they want to save — which is a better funnel.

```typescript
// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createSupabaseServerClient() {
  const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name) => cookieStore.get(name)?.value } }
  )
}
```

---

## Place Data — Source Strategy (V1)

V1 uses two sources. More can be added later without changing the architecture.

### Source 1: Foursquare Places API

- Free tier: 100,000 API calls/month
- Provides: name, category, lat/lng, address, tips, rating, hours
- Used for: structured candidate place discovery by category + location

```typescript
// places/foursquare.ts
export async function searchPlaces(params: {
  destination: string
  lat: number
  lng: number
  categories: string[]  // Foursquare category IDs
  limit: number
}): Promise<FoursquarePlace[]> {
  const url = new URL('https://api.foursquare.com/v3/places/search')
  url.searchParams.set('ll', `${params.lat},${params.lng}`)
  url.searchParams.set('categories', params.categories.join(','))
  url.searchParams.set('limit', String(params.limit))
  url.searchParams.set('sort', 'RELEVANCE')

  const res = await fetch(url.toString(), {
    headers: { Authorization: process.env.FOURSQUARE_API_KEY! }
  })
  return res.json().then(d => d.results)
}
```

### Source 2: Reddit API (read-only)

- Used for: sourcing traveler-driven recommendations from travel subreddits
- Subreddits in scope: r/travel, r/solotravel, destination-specific (e.g. r/JapanTravel)
- Approach: search posts mentioning destination + category, extract place names and context, use as source labels on PlaceSlot cards
- **Never store full post text.** Store only: subreddit name, post title, link, and a 1–2 sentence extracted mention.
- Respect Reddit API rate limits and terms.

---

## Caching Architecture

Expensive API calls are cached to contain costs:

| Data | Cache location | TTL |
|------|---------------|-----|
| Place search results (Foursquare) | Supabase table `place_cache` | 7 days |
| Travel time between two points (Mapbox) | Supabase table `route_cache` | 30 days |
| LLM rationale per (place + user profile hash) | Supabase table `rationale_cache` | 14 days |
| Reddit mentions per destination | Supabase table `reddit_cache` | 24 hours |

---

## Environment Variables

```bash
# .env.local — never commit this file
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

OPENAI_API_KEY=

NEXT_PUBLIC_MAPBOX_TOKEN=
MAPBOX_TOKEN=

FOURSQUARE_API_KEY=

REDDIT_CLIENT_ID=
REDDIT_CLIENT_SECRET=
REDDIT_USER_AGENT=waypoint/1.0

SENTRY_DSN=
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

---

## Security

- All API keys in environment variables, never in source code
- Supabase Row Level Security (RLS) enabled on all tables — users can only read/write their own trips
- Rate limiting on `/api/itinerary/generate`: max 3 itinerary generations per IP per hour (Vercel Edge middleware)
- LLM inputs are validated and sanitised before being passed to OpenAI
- User-supplied strings are never interpolated directly into SQL (Prisma parameterised queries)
- `SUPABASE_SERVICE_ROLE_KEY` is server-only — never exposed to the client

### Supabase RLS policy pattern

```sql
-- Trips: users can only read their own
CREATE POLICY "Users can view own trips" ON trips
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

-- Anonymous trips: readable by anyone with the trip ID (shareable link)
CREATE POLICY "Anonymous trips are public by tripId" ON trips
  FOR SELECT USING (user_id IS NULL);
```

---

## Development Workflow

### Git strategy

```
main          ← production (Vercel auto-deploys)
  └── feature/trip-form
  └── feature/itinerary-engine
  └── feature/map-view
  └── fix/place-cache-bug
```

Push to any branch creates a Vercel preview deployment automatically.

### Local setup

```bash
# 1. Clone
git clone https://github.com/kanikbansal-pixel/travelguru
cd travelguru

# 2. Install
npm install

# 3. Copy env and fill in keys
cp .env.example .env.local

# 4. Run Prisma migrations against Supabase
npx prisma migrate dev

# 5. Start dev server
npm run dev
# → http://localhost:3000
```

### CI/CD

```yaml
# .github/workflows/ci.yml
name: CI
on:
  push:
    branches: ['**']
  pull_request:

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: npm run typecheck
      - run: npm run lint
      - run: npm test
```

Vercel handles deployment automatically on merge to main. No separate deploy step needed.

---

## Testing Strategy

| Layer | Tool | Focus |
|-------|------|-------|
| Unit | Vitest | Scheduling logic in `lib/itinerary/builder.ts`, cache utilities |
| Integration | Vitest + msw | API routes with mocked Foursquare, Mapbox, OpenAI |
| E2E | Playwright | Trip form → generation → itinerary view → edit flow |
| Type checking | TypeScript strict | Catch shape errors before runtime |

**Non-negotiable test cases:**
- Itinerary builder never produces more than 5 places in a day
- Every PlaceSlot has a non-empty `rationale` and at least one `source`
- Regenerating day N does not mutate days N-1 or N+1
- Travel time is included between every consecutive stop pair

---

## Cost Breakdown

### Development phase (building the MVP)

| Service | Free tier | What you'll use |
|---------|-----------|----------------|
| Vercel | Hobby (free) | Free — preview + production deployments |
| Supabase | Free (500 MB DB, 50k MAU) | Free — easily covers MVP |
| OpenAI GPT-4o | Pay-as-you-go | ~$0.30/itinerary — set a $20 spending cap to be safe |
| Mapbox | 50k free map loads/month | Free at dev and early traction |
| Foursquare Places | 100k req/month free | Free — well within MVP usage |
| Reddit API | Free (developer tier) | Free |
| Sentry | 5k errors/month free | Free |
| Posthog | 1M events/month free | Free |
| **Total** | | **~$0 + OpenAI usage** |

### Production estimates

| Scale | Monthly estimate |
|-------|----------------|
| 0–500 users | $0–$15 (OpenAI is the only real cost) |
| 500–2000 users | $30–$80 (Supabase Pro if hitting limits, OpenAI scales) |
| 2000–10000 users | $100–$300 (Vercel Pro, Supabase Pro, OpenAI) |

**Setting guardrails:** Set an OpenAI spending cap at $20/month while building. Rate limit itinerary generation (3/hour/IP) to prevent runaway costs.

---

## Feature Build Order

Build in this sequence — each phase is independently testable and valuable:

### Phase 1 — Skeleton (validate flow end-to-end)
- [ ] Next.js project with Supabase connection
- [ ] Trip input form (all fields, validation)
- [ ] Stub itinerary generator (return hardcoded Tokyo itinerary)
- [ ] Basic itinerary view page (display the stub)
- [ ] Deploy to Vercel

### Phase 2 — Real data (replace stubs with live APIs)
- [ ] Foursquare place search integration
- [ ] Mapbox geocoding (destination → lat/lng)
- [ ] Mapbox Directions (travel time between stops)
- [ ] Deterministic scheduling engine (max stops/day, time blocks, geographic grouping)
- [ ] Map view with place markers and route polyline

### Phase 3 — Trust layer (the differentiator)
- [ ] OpenAI rationale generation per place
- [ ] Reddit API source mentions
- [ ] Source labels on PlaceCard
- [ ] Rationale text displayed in UI

### Phase 4 — Editor
- [ ] Remove a stop
- [ ] Reorder stops within a day (drag or up/down buttons)
- [ ] Replace a stop (search → pick alternative)
- [ ] Regenerate one day

### Phase 5 — Save and auth
- [ ] Supabase Auth (email + Google)
- [ ] Save itinerary (requires sign-in)
- [ ] List saved trips
- [ ] Export itinerary as plain text / copy to clipboard

### Phase 6 — Polish
- [ ] Error states and loading states
- [ ] Mobile responsive layout
- [ ] Sentry error tracking
- [ ] Posthog analytics
- [ ] Rate limiting middleware

---

## Scaling Path

### 0–1,000 users (MVP)
Current architecture handles this comfortably. No changes needed.

### 1,000–10,000 users
- Add Redis (Upstash, pay-per-use) as a faster cache layer for hot routes
- Consider Supabase Pro for connection pooling
- Review OpenAI cost — may benefit from batching rationale calls

### 10,000+ users
- Separate the recommendation pipeline into a background job (Vercel Cron or a queue)
- Add CDN caching for map tiles
- Evaluate switching to a cheaper/faster LLM for rationale generation (e.g. GPT-4o mini)

---

## Risk Mitigation

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| OpenAI cost overrun | Medium | Medium | Spending cap + rate limiting |
| Foursquare place data quality gaps | Medium | Medium | Cache good results; allow manual replace |
| Reddit API changes or access revoked | Low | Low | Reddit is source enrichment only, not primary data — remove if needed |
| Mapbox cost growth | Low | Medium | Cache all route results aggressively; consider OSM fallback |
| Itinerary quality variance | High | High | Constrain to top 10 destinations at launch; manual QA each |
| Supabase free tier limits | Low | Low | 500 MB and 50k MAU are generous for MVP; upgrade path is clear |

---

## AI Assistance Strategy

| Task | Primary tool | Notes |
|------|-------------|-------|
| Architecture decisions | Claude / Cursor | Load AGENTS.md + PRD first |
| Component generation | Cursor | Reference the component structure above |
| LLM prompt iteration | Claude.ai | Iterate prompts outside the codebase |
| Debugging | Claude / ChatGPT | Paste error + relevant code |
| Schema design | Cursor + Prisma docs | Prisma schema language is well-understood by AI |
| E2E test writing | Cursor + Playwright docs | Generate from user story descriptions |

**Session start ritual for Cursor:**
> "Read AGENTS.md and agent_docs/project_brief.md. Summarise the WayPoint MVP scope and the current phase. Then propose a plan for [today's feature] before writing any code."

---

## Self-Verification Checklist

| Required section | Present |
|----------------|---------|
| Platform clearly decided | Yes — web only |
| Alternatives compared with pros/cons | Yes — decision table above |
| Full tech stack specified | Yes |
| Trade-offs honestly acknowledged | Yes — per-service |
| Cost breakdown included | Yes — dev and production |
| Feature build order defined | Yes — 6 phases |
| AI assistance strategy defined | Yes |
| Security approach outlined | Yes |
| Testing approach outlined | Yes |

---

## Open Questions (resolved)

| Question | Decision |
|----------|---------|
| One city or two cities in V1? | **One city to start.** Two-city support is a Phase 2 addition — lower scope risk. |
| Sign-in required to save? | **No for generate, yes for save.** Anonymous generation removes friction from the core value prop. |
| Which source set in V1? | **Foursquare (structured) + Reddit (community signals).** Two sources are enough to show the trust layer without over-engineering content retrieval. |
| Source transparency UX | **Inline, compact.** Each PlaceCard shows source label(s) as a small badge. Expandable on click for the full rationale. Avoids cluttering the primary view. |
| Monetise at launch? | **Not at launch.** Validate that users trust the output and reduce their research time first. Add freemium (1 free itinerary, paid for more/export) after 50–100 user sessions. |

---

*Technical Design for: WayPoint MVP*  
*Stack: Next.js 14 + Supabase + OpenAI GPT-4o + Mapbox + Foursquare + Vercel*  
*Estimated time to working MVP: 3–5 focused build sessions*  
*Estimated monthly cost at MVP scale: $0–$40*
