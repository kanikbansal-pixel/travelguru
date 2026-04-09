# AGENTS.md — WayPoint

> **Read this file first. Every session. Before touching any code.**
> This is the master contract for all AI agents working on this project.

---

## Project overview

**WayPoint** — Realistic, source-backed international trip itineraries, built from real traveler signals.

One-line pitch: *Turn deep travel research into a personalized, editable itinerary users can actually follow.*

Target user: International leisure travelers (age 22–40) who currently use Reddit, ChatGPT, blogs, and spreadsheets to plan trips. They don't trust generic AI plans. WayPoint earns trust by showing *why* every place was chosen.

**Differentiators:**
1. Every place shows a specific, personalized rationale — not "a must-visit"
2. Day plans include realistic travel-time buffers, never overpacked
3. Users edit like a document, not a chatbot

---

## Key documents

| Document | Location | Purpose |
|----------|----------|---------|
| PRD | `docs/PRD-WayPoint-MVP.md` | What to build and why |
| Research | `docs/research-WayPoint.md` | Market context, competitor analysis |
| Tech Design | `docs/TechDesign-WayPoint-MVP.md` | Full stack, pipeline, schema, build phases |
| Product requirements | `agent_docs/product_requirements.md` | Features, user stories, success metrics |
| Project brief | `agent_docs/project_brief.md` | Commands, conventions, quality gates |
| Tech stack | `agent_docs/tech_stack.md` | Confirmed stack with code examples |
| Code patterns | `agent_docs/code_patterns.md` | Reusable patterns for this codebase |
| Testing | `agent_docs/testing.md` | Testing strategy and pre-commit hooks |
| Resources | `agent_docs/resources.md` | Reference docs and tooling links |
| Memory | `MEMORY.md` | Active phase, current task, session log |
| Review checklist | `REVIEW-CHECKLIST.md` | Pre-commit and pre-deploy gates |

---

## Active build phase

> **Check `MEMORY.md` for the current task before doing anything else.**

| Phase | Name | Status |
|-------|------|--------|
| 1 | Skeleton: form → stub itinerary → deploy | **⬅ START HERE** |
| 2 | LLM generation: replace stub with live GPT-4o | Pending |
| 3 | Trust layer: PlaceCard with rationale + source | Pending |
| 4 | Editor: remove, reorder, regenerate day | Pending |
| 5 | Save and auth: email sign-in + saved trips | Pending |
| 6 | Map: Mapbox Static Images (optional) | Pending |

---

## How I should think (meta-cognition rules)

1. **Understand intent first.** Before writing code, identify what the user actually needs. Re-read the relevant user story in `agent_docs/product_requirements.md`.
2. **Ask if unsure.** If a critical detail is missing or ambiguous, ask one specific question before proceeding.
3. **Plan before coding.** Propose a brief plan (bullet points, not paragraphs). Wait for approval. Then implement.
4. **One feature at a time.** Complete and verify one feature before starting the next. Do not batch multiple features in one pass.
5. **Verify after changes.** Run `npm run typecheck && npm run lint` after every non-trivial change. Fix failures before moving on.
6. **Explain trade-offs.** When recommending an approach, mention what you are trading off and why this option wins.

---

## Agent workflow

### Session start (required every time)

```
1. Read AGENTS.md (this file)
2. Read MEMORY.md — check active phase and last known state
3. Read agent_docs/project_brief.md — commands and conventions
4. Propose what you plan to do. Wait for approval.
```

### Build loop

```
Plan (propose) → Approval → Build (one feature) → Verify (typecheck + lint) → Summarise diff → Update MEMORY.md → Next
```

### Session end (required)

- Update `MEMORY.md`: mark what was completed, what is in progress, what is next
- If a session ran long, compact context before the next session starts

---

## MVP scope — build within this

**In scope (48-hour MVP):**
- Trip input form (destination, dates, budget, pace, interests, must-do, must-avoid)
- Itinerary generation via single GPT-4o call returning structured JSON
- Day-by-day itinerary view with PlaceCards
- PlaceCard: name, category, rationale, source label, estimated time
- TravelTimeBadge between consecutive stops
- Editor: remove stop, reorder stop (up/down), regenerate one day
- Save itinerary (requires email sign-in)
- Export itinerary as plain text / clipboard copy
- Deploy to Vercel

**Not in scope for 48-hour MVP:**
- Hotel or flight booking
- Payments for travel inventory
- Visa information
- Social feed or collaboration
- Native mobile app
- Interactive Mapbox GL JS map (optional Static Images only)
- Foursquare API integration (v1.1)
- Reddit API integration (v1.1)
- Google OAuth (v1.1)
- Drag-and-drop reordering (v1.1)

Do not build anything outside this scope without explicit instruction.

---

## What NOT to do

- Do NOT delete files without explicit confirmation
- Do NOT modify the `trips` table schema without noting it in `MEMORY.md`
- Do NOT add features not in the current phase
- Do NOT skip the verify step (typecheck + lint) for "simple" changes
- Do NOT add `any` types — use `unknown` with type guards or proper interfaces
- Do NOT put secrets or API keys in source code — use `.env.local` only
- Do NOT apologise for errors — fix them immediately and explain what changed
- Do NOT generate filler text before providing a solution
- Do NOT call OpenAI without checking the current spending cap is set ($20/month limit)

---

## Engineering constraints

### Type safety (no compromises)
- `any` is forbidden. Use `unknown` with type guards, or define proper interfaces.
- All function parameters and return types must be explicitly typed.
- Use Zod for runtime validation of LLM output and API request bodies.

### Architecture rules
- API route handlers (`app/api/**/route.ts`) handle request/response only — no business logic inside them.
- All business logic lives in `src/lib/` services.
- No direct Supabase calls from React components — all data access goes through API routes or server actions.

### Library governance
- Check `package.json` before suggesting a new dependency.
- Prefer native fetch over axios.
- Prefer `@supabase/ssr` over the legacy `@supabase/auth-helpers-nextjs`.

### Workflow discipline
- Commit after each completed, working phase — not mid-feature.
- Pre-commit hooks must pass before committing.
- If a verify step fails, fix it before continuing. Do not suppress errors.

---

## Code standards

- **TypeScript strict mode** across all files
- **Components:** small and single-purpose. One component per file.
- **Comments:** only for non-obvious intent or constraints — never narrate what the code does
- **Imports:** use path aliases (`@/components`, `@/lib`) — no relative `../../` chains
- **Server vs. client:** mark client components with `'use client'` only when required. Default to server components.

---

## Naming conventions

| Concept | Term to use |
|---------|-------------|
| App name | WayPoint |
| Previous working title | TrustTrip (do not use) |
| An itinerary | itinerary |
| A block of one day | day |
| A location / recommendation | place (not "attraction", "spot", "item") |
| The explanation for a place | rationale |
| A content reference | source |
| A slot within a day | slot |

---

## Confirmed technical decisions (do not re-debate)

### 48-hour MVP stack
| Layer | Choice |
|-------|--------|
| Framework | Next.js 14, App Router |
| Language | TypeScript strict |
| Styling | Tailwind CSS + shadcn/ui |
| Database | Supabase PostgreSQL (Supabase JS client — no Prisma yet) |
| Schema | Single `trips` table with `jsonb` columns for inputs + itinerary |
| Auth | Supabase Auth, email only |
| LLM | OpenAI GPT-4o, JSON mode, single call per itinerary |
| Place data | LLM-generated (no Foursquare) |
| Source labels | LLM-authored (no Reddit API) |
| Maps | Mapbox Static Images API (optional) or deferred |
| Deployment | Vercel, auto-deploy from main |

### Design decisions that don't change
- Anonymous generation allowed; sign-in required to save
- One city per trip in v1 (two-city deferred)
- `rationale` is required on every place — never skip it
- Source label is required on every place — LLM-authored for MVP
- Max 5 places per day — enforced in post-processing after LLM call

---

## Contacts and references

- GitHub repo: https://github.com/kanikbansal-pixel/travelguru
- Workflow template: https://github.com/KhazP/vibe-coding-prompt-template
- Deployment target: Vercel
- Budget constraint: free tiers + OpenAI (cap at $20/month during development)
