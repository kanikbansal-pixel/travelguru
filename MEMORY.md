# MEMORY.md — WayPoint Session State

> Update this file at the end of every session.
> Read this at the start of every session after reading AGENTS.md.

---

## Active phase and goal

**Phase 2 — Real LLM generation**

Goal: Replace the stub itinerary with a real GPT-4o call. Build and wire up `src/lib/openai/generateItinerary.ts`.

### Phase 2 checklist
- [ ] `OPENAI_API_KEY` added to `.env.local` and Vercel dashboard
- [ ] `src/lib/openai/generateItinerary.ts` built with Zod-validated output
- [ ] `POST /api/itinerary/generate` updated to call real LLM (remove stub)
- [ ] Loading state verified: spinner shows during 5–15 second LLM call
- [ ] Error state verified: friendly message on LLM failure
- [ ] Test with at least 3 different destinations

---

## What was completed

### Phase 1 — Skeleton ✅ (2026-04-09)

All Phase 1 checklist items complete:

- [x] Next.js 14 project with Tailwind CSS, shadcn/ui, TypeScript strict
- [x] Shared types (`src/types/index.ts`): TripInputs, Place, Day, Itinerary, Trip
- [x] Supabase clients: `src/lib/supabase/server.ts` + `src/lib/supabase/client.ts` (using `@supabase/ssr`)
- [x] Stub itinerary: `src/lib/itinerary/stub.ts` — hardcoded 3-day Tokyo itinerary, all fields populated (rationale + sourceLabel on every place)
- [x] API route: `POST /api/itinerary/generate` — Zod validation, stub call, Supabase insert, returns `{ tripId, itinerary }`
- [x] Trip input form: all 7 fields, client-side validation, redirects to `/plan/[tripId]` on success
- [x] Itinerary view: ItineraryView, DayCard, PlaceCard, TravelTimeBadge — trust layer always visible
- [x] Landing page with hero and CTA
- [x] `npm run typecheck` — passes (zero errors)
- [x] `npm run lint` — passes (zero warnings)
- [x] Committed and pushed to `cursor/phase1-skeleton-a739`

**Waiting on user:** Supabase project setup + env vars before deploy and end-to-end test.

---

## What is in progress

Phase 2 — not started. Waiting for Supabase to be set up and `.env.local` filled in.

---

## What is next

1. User fills in `.env.local` with Supabase values (guide provided in session)
2. Test locally: `npm run dev` → fill form → see stub Tokyo itinerary
3. Deploy to Vercel with same env vars set in dashboard
4. Start Phase 2: wire up real OpenAI GPT-4o call

---

## Key decisions made this session

- Used `@supabase/ssr` v0.10.x which requires `async cookies()` — server client is now `async function createClient()`
- Lint script uses `eslint src --ext .ts,.tsx --max-warnings 0` (Next.js 16's `next lint` has path resolution issues)
- Stub itinerary contains full Tokyo 3-day plan with authentic rationale text — good demo even before real LLM

---

## Blockers or open questions

- User needs to: create Supabase project, run SQL, fill in `.env.local`, then deploy to Vercel
- OpenAI API key + $20 spending cap needed before Phase 2

---

## Context compaction notes

Key facts to preserve in next session:
- 48-hour MVP uses LLM-first pipeline (single GPT-4o call, no Foursquare/Reddit)
- jsonb storage in `trips` table — no Prisma yet
- Supabase Auth email only
- `rationale` and `sourceLabel` required on every place
- Max 5 places per day
- Server client is `async function createClient()` (required by Next.js 15+ with `await cookies()`)
- Lint: `eslint src --ext .ts,.tsx --max-warnings 0`

## Session log

| Date | What happened |
|------|--------------|
| 2026-04-09 | PRD, research, tech design, and all agent docs created. Ready to start Phase 1. |
| 2026-04-09 | Phase 1 skeleton built. Typecheck and lint pass. Awaiting Supabase setup from user. |
