# AGENTS.md — WayPoint

> This is the master contract for all AI agents working on this project.
> Read this file first, every session, before touching any code.

---

## Project overview

WayPoint is a web application that generates realistic, source-backed international trip itineraries. It is designed for research-heavy leisure travelers who currently use Reddit, ChatGPT, blogs, and spreadsheets to plan trips. The product differentiates on trust (source-backed recommendations with visible rationale) and realism (map-aware scheduling, genuine travel-time buffers).

**Core promise:** Turn deep travel research into a personalized, editable itinerary users can actually follow.

---

## Key documents

Always load these before making decisions:

| Document | Location | Purpose |
|----------|----------|---------|
| PRD | `docs/PRD-WayPoint-MVP.md` | What to build and why |
| Research | `docs/research-WayPoint.md` | Market context and competitor landscape |
| Tech Design | `docs/TechDesign-WayPoint-MVP.md` | Stack, data model, API decisions (in progress) |
| Project brief | `agent_docs/project_brief.md` | Concise context for new sessions |
| Tech stack | `agent_docs/tech_stack.md` | Confirmed technology choices |
| Testing | `agent_docs/testing.md` | Testing approach and standards |

---

## MVP scope (build within this)

- International city trips: 3–7 days, 1–2 cities
- Web app only
- Trip input form (destination, dates, budget, pace, interests, must-do, must-avoid)
- Recommendation engine generating source-backed candidate places
- Itinerary builder: day-by-day, map-aware, realistic time blocks
- Editor: reorder, remove, replace, regenerate single day
- Map view with estimated travel times between stops
- Save and export itinerary
- Trust layer: each stop shows short rationale and source reference

Do not build anything outside this scope without explicit instruction.

---

## What not to build in MVP

- Hotel or flight booking
- Payment processing for travel inventory
- Visa information
- Social feed or user-to-user collaboration
- Native mobile app
- Coverage of every destination worldwide

---

## Development principles

1. **Smallest working increment first.** Propose a plan, wait for approval, then build one feature at a time.
2. **Prefer simple over clever.** If two approaches work, choose the one with fewer moving parts.
3. **Make the trust layer visible.** Every recommendation must carry a rationale string and at least one source reference. This is a core product differentiator — do not skip or stub it.
4. **Realistic scheduling is non-negotiable.** Itineraries must include travel time buffers and obey a max-stops-per-day rule. Never overpack a day.
5. **No scraping full blog content.** Store metadata, summaries, and links only. Respect content rights.
6. **Cache aggressively.** Map and place API calls are expensive. Cache place lookups and route estimates.
7. **No secrets in code.** All API keys go in environment variables only.

---

## Agent workflow

### Starting a session

1. Read `AGENTS.md` (this file).
2. Read `agent_docs/project_brief.md` for a compact context snapshot.
3. Read the relevant spec in `specs/` if one exists for the current feature.
4. Propose a plan. Wait for approval before writing code.

### Building a feature

```
Plan → Approval → Build (one feature) → Test → Summarize diff → Next
```

After each feature:
- Run tests or lint where applicable.
- Summarize what changed and why.
- Update the relevant spec file in `specs/` if needed.
- Do not proceed to the next feature without confirmation.

### Finishing a session

- Write a short recap to `specs/recap-YYYY-MM-DD.md` so the next session has context.
- Note what was completed, what is in progress, and what is next.

---

## Code standards

- Use TypeScript strictly typed. No `any` unless explicitly justified.
- Keep components small and single-purpose.
- Do not add comments that describe what the code does — only add comments that explain non-obvious intent or constraints.
- Tests should cover happy path and the two most likely failure cases for each feature.
- Prefer server-side rendering for the initial itinerary page to improve performance and shareability.

---

## Naming

| Concept | Name |
|---------|------|
| App | WayPoint |
| Previous working title | TrustTrip |
| Itinerary | itinerary (not "plan" or "trip") |
| Day block | day |
| Place or location | place (not "attraction" or "spot") |
| Recommendation rationale | rationale |
| Source reference | source |

---

## Open questions (resolve before building affected features)

- Which source set to use in V1 (structured APIs vs. curated retrieval)?
- Should users be required to sign in before saving an itinerary?
- One city or two cities supported in first release?
- What level of source transparency is most useful in the UI without clutter?
- Introduce monetization at launch or after value validation?

---

## Contacts and context

- Workflow template: https://github.com/KhazP/vibe-coding-prompt-template
- This is a solo or small-team project with a low-budget MVP constraint.
- Deployment target: web hosting (Vercel or Cloudflare Pages preferred).
