# Technical Design — WayPoint MVP

> **Status: In progress — to be completed in the tech design phase.**

This file will be populated after running the vibe-coding template Step 3 (Technical Design) prompt against the PRD. The sections below mark what needs to be decided.

---

## Guiding constraints

- Low budget — MVP must be buildable and hostable at near-zero cost initially
- Solo/small team — managed services over self-hosted infrastructure
- Web-only (no native mobile in v1)
- Deployment target: Vercel or Cloudflare Pages preferred

---

## Architecture overview

*(To be filled in after tech design session)*

---

## Frontend

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Framework | TBD | |
| UI library | TBD | |
| State management | TBD | |
| Map rendering | TBD | |

---

## Backend

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Runtime | TBD | |
| API style | TBD | |
| Hosting | TBD | |

---

## Database

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Store | TBD | |
| ORM / query layer | TBD | |
| Hosting | TBD | |

---

## Data model (draft)

Core entities to model (schema TBD):

- **Trip** — user inputs, status, created/updated timestamps
- **Place** — name, description, category, coordinates, rationale, sources
- **Itinerary** — linked to a trip, contains ordered days
- **Day** — date, ordered list of place slots with time estimates
- **Source** — label, URL, type (reddit, blog, guidebook, API)

---

## AI / LLM layer

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Model | TBD | |
| Usage scope | TBD | |
| Cost controls | TBD | |

**Principle:** Use LLM for ranking explanation and rationale generation, not as the only source of truth. Apply deterministic rules for scheduling, stop limits, and geographic grouping.

---

## Maps and places

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Maps provider | TBD | |
| Place data | TBD | |
| Routing | TBD | |
| Caching | TBD | |

**Constraint:** Limit route API calls at MVP scale. Cache place lookups and route estimates. Prefer free-tier-friendly providers.

---

## Content / source retrieval

**Principle:** Store summaries, metadata, and links — not full copied content.

| Source type | Approach |
|-------------|---------|
| Reddit | Reddit API (within guidelines and rate limits) |
| Travel blogs | Curated retrieval, summary + link only |
| Structured place data | TBD (Foursquare, OSM, Google Places, etc.) |

---

## Auth

- Required before saving an itinerary? **TBD — open question.**
- If yes, preferred approach: managed (Clerk, Supabase Auth, Auth.js)

---

## Deployment

| Concern | Choice |
|---------|--------|
| Frontend hosting | TBD (Vercel / Cloudflare Pages) |
| Backend/serverless | TBD |
| CI/CD | TBD |
| Secret management | Environment variables, never in source |

---

## Open questions

1. Which data sources power V1 recommendations (structured APIs vs. curated retrieval)?
2. Is sign-in required to save an itinerary?
3. One or two cities supported in first release?
4. Source transparency UX: inline vs. expandable vs. sidebar?
5. Google Maps Platform vs. Mapbox vs. OSM-based alternative for maps and routing?
6. Which LLM provider and model? What are the per-itinerary cost estimates?
