# MEMORY.md — WayPoint Session State

> Update this file at the end of every session.
> Read this at the start of every session after reading AGENTS.md.

---

## Active phase and goal

**Phase 1 — Skeleton**

Goal: Get the full user flow working end-to-end with a stub itinerary, then deploy to Vercel. No real API calls yet.

### Phase 1 checklist
- [ ] Next.js 14 project initialised with Tailwind CSS and shadcn/ui
- [ ] Supabase project created, `trips` table created via SQL editor
- [ ] `.env.local` configured with Supabase keys
- [ ] Trip input form built (all 7 fields, client-side validation)
- [ ] Stub itinerary generator (hardcoded JSON for Tokyo, 3 days)
- [ ] Itinerary view page renders the stub correctly
- [ ] Deployed to Vercel with environment variables set
- [ ] Preview URL tested end-to-end

---

## What was completed

*(Nothing yet — project is ready to start coding.)*

---

## What is in progress

Phase 1 — not started.

---

## What is next

After Phase 1 completes:
→ Phase 2: Replace stub with real GPT-4o call. Build `POST /api/itinerary/generate` route.

---

## Key decisions made this session

*(None yet.)*

---

## Blockers or open questions

*(None yet.)*

---

## Session log

| Date | What happened |
|------|--------------|
| 2026-04-09 | PRD, research, tech design, and all agent docs created. Ready to start Phase 1. |

---

## Context compaction notes

*(If a session gets long, summarise here what the AI needs to remember before starting a fresh chat.)*

Current context to preserve:
- 48-hour MVP uses LLM-first pipeline (single GPT-4o call, no Foursquare/Reddit)
- jsonb storage (no Prisma yet)
- Supabase Auth email only
- rationale is required on every place — enforced in post-processing
- Max 5 places per day
