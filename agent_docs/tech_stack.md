# Tech Stack — WayPoint MVP

> Confirmed stack. Do not re-debate these decisions.
> For full reasoning and trade-off analysis, see `docs/TechDesign-WayPoint-MVP.md`.

---

## 48-hour MVP stack (use this now)

| Layer | Choice | Notes |
|-------|--------|-------|
| Framework | **Next.js 14 (App Router)** | SSR + client components; API routes as serverless functions |
| Language | **TypeScript strict** | `any` is forbidden |
| Styling | **Tailwind CSS + shadcn/ui** | shadcn/ui for accessible, owned components |
| Database | **Supabase PostgreSQL** | Via Supabase JS client (`@supabase/ssr`) — no Prisma yet |
| Schema | **Single `trips` table + jsonb** | `inputs jsonb`, `itinerary jsonb` columns |
| Auth | **Supabase Auth (email only)** | No Google OAuth in MVP |
| LLM | **OpenAI GPT-4o (JSON mode)** | Full itinerary in one call |
| Place data | **LLM-generated** | No Foursquare in MVP |
| Source labels | **LLM-authored** | Honest community attribution phrasing |
| Maps | **Mapbox Static Images API (optional)** | Simple REST → PNG; skip if time-constrained |
| Deployment | **Vercel** | Auto-deploy from main; preview per branch |
| Runtime validation | **Zod** | All API inputs + LLM output |

## Production additions (v1.1 — after MVP validation)

| Layer | Choice |
|-------|--------|
| ORM | Prisma (after schema stabilises) |
| Place data | Foursquare Places API |
| Community signals | Reddit API (read-only) |
| Maps (interactive) | Mapbox GL JS + react-map-gl |
| Routing | Mapbox Directions API (cached) |
| Auth additions | Google OAuth |
| Error tracking | Sentry (free tier) |
| Analytics | Posthog (free tier) |
| Tests | Vitest + msw + Playwright |

---

## Install commands

```bash
# Initialise project
npx create-next-app@latest waypoint --typescript --tailwind --app --src-dir --import-alias "@/*"

# Supabase
npm install @supabase/supabase-js @supabase/ssr

# OpenAI
npm install openai

# shadcn/ui (initialise, then add components as needed)
npx shadcn@latest init
npx shadcn@latest add button card badge input select label textarea

# Runtime validation
npm install zod

# Icons
npm install lucide-react
```

---

## Environment variables

### 48-hour MVP minimum

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=          # From Supabase project settings
NEXT_PUBLIC_SUPABASE_ANON_KEY=     # From Supabase project settings → API
SUPABASE_SERVICE_ROLE_KEY=         # Server-only. Never expose to browser.
OPENAI_API_KEY=                    # From platform.openai.com — set $20 spending cap
```

### Production additions (add later)

```bash
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

## Key package.json scripts to add

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "typecheck": "tsc --noEmit",
    "lint": "next lint"
  }
}
```

---

## Supabase client pattern

**Two clients — never mix them:**

```typescript
// src/lib/supabase/server.ts — for API routes and server components
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name) => cookieStore.get(name)?.value } }
  )
}
```

```typescript
// src/lib/supabase/client.ts — for browser/client components only
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

---

## OpenAI pattern

```typescript
import OpenAI from 'openai'
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const response = await client.chat.completions.create({
  model: 'gpt-4o',
  response_format: { type: 'json_object' },  // JSON mode
  messages: [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: userPrompt },
  ],
  temperature: 0.7,
})
```

Always validate the parsed output with Zod — LLM can still return wrong shapes even in JSON mode.

---

## Key design decisions (do not re-debate)

1. Anonymous generation allowed; sign-in required to save
2. Single LLM call generates full itinerary — no separate scheduling engine in MVP
3. Zod validates all inputs AND all LLM outputs
4. `rationale` and `sourceLabel` are required on every place — enforced in Zod schema
5. Max 5 places per day — enforced in Zod schema and LLM system prompt
6. jsonb storage — no normalised schema until post-MVP validation
7. One city per trip in v1

---

## Cost guardrails

- Set an OpenAI account spending cap at **$20/month** before starting
- Rate limit `/api/itinerary/generate` to max 3 requests per IP per hour (add Vercel Edge middleware)
- LLM cost per itinerary: ~$0.03–0.06 for a 5-day trip with GPT-4o
