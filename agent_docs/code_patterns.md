# Code Patterns — WayPoint

> Concrete, reusable patterns for this codebase. Copy-adapt these rather than inventing new structures.
> All patterns use the confirmed 48-hour MVP stack: Next.js 14 App Router + Supabase JS + OpenAI + TypeScript strict.

---

## TypeScript types (shared)

```typescript
// src/types/index.ts

export interface TripInputs {
  destination: string
  startDate: string        // ISO date string 'YYYY-MM-DD'
  endDate: string
  budgetLevel: 'budget' | 'mid' | 'luxury'
  pace: 'relaxed' | 'moderate' | 'packed'
  interests: string[]
  mustDo: string
  mustAvoid: string
}

export interface Place {
  name: string
  category: string
  description: string
  lat: number
  lng: number
  startTime: string          // 'HH:MM'
  durationMinutes: number
  travelTimeToNextMinutes: number | null
  rationale: string          // REQUIRED — never empty
  sourceLabel: string        // REQUIRED — never empty
}

export interface Day {
  dayIndex: number
  date: string               // 'YYYY-MM-DD'
  theme: string
  places: Place[]
}

export interface Itinerary {
  destination: string
  days: Day[]
}

export interface Trip {
  id: string
  userId: string | null
  destination: string
  startDate: string
  endDate: string
  inputs: TripInputs
  itinerary: Itinerary
  status: 'draft' | 'saved'
  createdAt: string
}
```

---

## Supabase client setup

```typescript
// src/lib/supabase/client.ts — browser client (for client components)
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

```typescript
// src/lib/supabase/server.ts — server client (for API routes and server components)
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )
}
```

**Rule:** Never import the server client in a client component. Never import the browser client in an API route. If unsure, look at whether the file has `'use client'` at the top.

---

## API route pattern

```typescript
// src/app/api/itinerary/generate/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { generateItinerary } from '@/lib/openai/generateItinerary'
import { createClient } from '@/lib/supabase/server'
import type { TripInputs } from '@/types'

// Zod schema for runtime validation of request body
const RequestSchema = z.object({
  destination: z.string().min(1),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  budgetLevel: z.enum(['budget', 'mid', 'luxury']),
  pace: z.enum(['relaxed', 'moderate', 'packed']),
  interests: z.array(z.string()).min(1),
  mustDo: z.string(),
  mustAvoid: z.string(),
})

export async function POST(req: NextRequest) {
  try {
    const body: unknown = await req.json()
    const parsed = RequestSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const inputs: TripInputs = parsed.data
    const itinerary = await generateItinerary(inputs)

    // Persist to Supabase
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { data, error } = await supabase
      .from('trips')
      .insert({
        user_id: user?.id ?? null,
        destination: inputs.destination,
        start_date: inputs.startDate,
        end_date: inputs.endDate,
        inputs,
        itinerary,
        status: 'draft',
      })
      .select('id')
      .single()

    if (error) throw error

    return NextResponse.json({ tripId: data.id, itinerary })
  } catch (err) {
    console.error('[generate] error:', err)
    return NextResponse.json(
      { error: 'Failed to generate itinerary. Please try again.' },
      { status: 500 }
    )
  }
}
```

**Pattern rules:**
- Always validate request bodies with Zod before using any field
- Use `safeParse` not `parse` — return 400 instead of throwing on bad input
- Return a consistent error shape: `{ error: string, details?: unknown }`
- Log errors on the server with context, but never expose internal errors to the client

---

## OpenAI call pattern

```typescript
// src/lib/openai/generateItinerary.ts
import OpenAI from 'openai'
import { z } from 'zod'
import type { TripInputs, Itinerary, Day, Place } from '@/types'

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

// Zod schema for LLM output validation
const PlaceSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  description: z.string().min(1),
  lat: z.number(),
  lng: z.number(),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  durationMinutes: z.number().positive(),
  travelTimeToNextMinutes: z.number().nullable(),
  rationale: z.string().min(20),   // enforce meaningful length
  sourceLabel: z.string().min(10),
})

const DaySchema = z.object({
  dayIndex: z.number(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  theme: z.string().min(1),
  places: z.array(PlaceSchema).max(5),  // enforce max 5 places/day
})

const ItinerarySchema = z.object({
  destination: z.string(),
  days: z.array(DaySchema),
})

const SYSTEM_PROMPT = `You are WayPoint, a realistic and trustworthy international trip planner.
Your job is to generate a day-by-day itinerary that feels grounded in real traveler experience.

Rules:
- Maximum 5 places per day. For a relaxed pace, use 3-4. For packed, use 5.
- Group nearby places on the same day — minimise backtracking.
- Include realistic travel time estimates between consecutive stops.
- Every place MUST have a specific rationale explaining why it fits this traveler's interests.
  Do NOT use generic phrases like "a must-visit" or "popular tourist spot".
  Reference the user's specific interests in the rationale.
- Include a sourceLabel for each place citing the type of community or content that recommends it.
  Be honest: say "Frequently recommended in budget travel communities" not "From r/Specific subreddit"
  unless you are certain.
- Times: morning starts at 9am, allow 1-2 hours per cultural site, 45min-1hr for food stops.
- Day themes should be short and evocative: "East Side Art and Coffee" not "Day 1".

Respond ONLY with valid JSON. No text before or after the JSON.`

export async function generateItinerary(inputs: TripInputs): Promise<Itinerary> {
  const numDays = Math.round(
    (new Date(inputs.endDate).getTime() - new Date(inputs.startDate).getTime())
    / (1000 * 60 * 60 * 24)
  ) + 1

  const userPrompt = `Plan a ${numDays}-day trip to ${inputs.destination}.
Start date: ${inputs.startDate}
Budget: ${inputs.budgetLevel}
Pace: ${inputs.pace}
Interests: ${inputs.interests.join(', ')}
Must include: ${inputs.mustDo || 'nothing specific'}
Must avoid: ${inputs.mustAvoid || 'nothing specific'}

Return JSON matching this exact shape:
{
  "destination": string,
  "days": [
    {
      "dayIndex": number (0-based),
      "date": "YYYY-MM-DD",
      "theme": string,
      "places": [
        {
          "name": string,
          "category": string,
          "description": string,
          "lat": number,
          "lng": number,
          "startTime": "HH:MM",
          "durationMinutes": number,
          "travelTimeToNextMinutes": number | null (null for last place),
          "rationale": string (2 sentences, specific to this traveler),
          "sourceLabel": string (honest community/content attribution)
        }
      ]
    }
  ]
}`

  const response = await client.chat.completions.create({
    model: 'gpt-4o',
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.7,
  })

  const content = response.choices[0].message.content
  if (!content) throw new Error('OpenAI returned empty content')

  const raw: unknown = JSON.parse(content)
  const validated = ItinerarySchema.safeParse(raw)

  if (!validated.success) {
    console.error('[generateItinerary] LLM output failed validation:', validated.error.flatten())
    throw new Error('Itinerary validation failed')
  }

  return validated.data
}
```

---

## React component patterns

### Server component (default — no `'use client'`)

```typescript
// src/app/plan/[tripId]/page.tsx
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ItineraryView } from '@/components/itinerary/ItineraryView'
import type { Trip } from '@/types'

interface Props {
  params: { tripId: string }
}

export default async function TripPage({ params }: Props) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('trips')
    .select('*')
    .eq('id', params.tripId)
    .single()

  if (error || !data) notFound()

  const trip = data as Trip

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <ItineraryView itinerary={trip.itinerary} tripId={trip.id} />
    </main>
  )
}
```

### Client component (only when needed — event handlers, state, hooks)

```typescript
// src/components/itinerary/PlaceCard.tsx
'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChevronDown, ChevronUp } from 'lucide-react'
import type { Place } from '@/types'

interface Props {
  place: Place
  onRemove: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  isFirst: boolean
  isLast: boolean
}

export function PlaceCard({ place, onRemove, onMoveUp, onMoveDown, isFirst, isLast }: Props) {
  const [rationaleOpen, setRationaleOpen] = useState(true)

  return (
    <Card className="border border-stone-200">
      <CardContent className="pt-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-semibold text-stone-900">{place.name}</p>
            <div className="flex gap-2 mt-1">
              <Badge variant="secondary">{place.category}</Badge>
              <span className="text-xs text-stone-500">
                {place.startTime} · ~{place.durationMinutes} min
              </span>
            </div>
          </div>
          <div className="flex gap-1 shrink-0">
            <button
              onClick={onMoveUp}
              disabled={isFirst}
              className="p-1 text-stone-400 hover:text-stone-700 disabled:opacity-30"
              aria-label="Move up"
            >
              <ChevronUp size={16} />
            </button>
            <button
              onClick={onMoveDown}
              disabled={isLast}
              className="p-1 text-stone-400 hover:text-stone-700 disabled:opacity-30"
              aria-label="Move down"
            >
              <ChevronDown size={16} />
            </button>
            <button
              onClick={onRemove}
              className="p-1 text-stone-400 hover:text-red-600"
              aria-label="Remove place"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Trust layer — always visible by default */}
        <p className="text-sm text-stone-700">{place.rationale}</p>
        <p className="text-xs text-stone-400 italic">{place.sourceLabel}</p>
      </CardContent>
    </Card>
  )
}
```

---

## Error handling pattern

```typescript
// In API routes — always return consistent shape
return NextResponse.json(
  { error: 'Human-readable message for the user' },
  { status: 500 }
)

// In client components — show error state, not a crash
const [error, setError] = useState<string | null>(null)

const handleGenerate = async () => {
  try {
    setLoading(true)
    setError(null)
    const res = await fetch('/api/itinerary/generate', { ... })
    if (!res.ok) {
      const body = await res.json()
      setError(body.error ?? 'Something went wrong. Please try again.')
      return
    }
    // success path
  } catch {
    setError('Network error. Please check your connection and try again.')
  } finally {
    setLoading(false)
  }
}
```

---

## Naming conventions

| Item | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `PlaceCard.tsx`, `TravelTimeBadge.tsx` |
| Hooks | camelCase with `use` prefix | `useItinerary.ts` |
| Utilities | camelCase | `generateItinerary.ts` |
| API routes | kebab-case directories | `app/api/itinerary/generate/route.ts` |
| Types | PascalCase interfaces | `interface Place`, `interface Day` |
| CSS classes | Tailwind only (no custom CSS classes unless essential) | |
| Env vars | SCREAMING_SNAKE_CASE | `OPENAI_API_KEY` |
| Database columns | snake_case | `user_id`, `start_date`, `created_at` |

---

## Import alias setup

Always use path aliases. Configure in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

Use `@/components/...`, `@/lib/...`, `@/types` — never `../../components/...`.
