# Tech Stack — WayPoint

> This file will be completed after the technical design phase (Step 3 in the vibe-coding workflow).
> Leave placeholder sections here for the tech design output.

---

## Status

**Not yet decided.** Tech design is the next planned phase.

The sections below are prompts for what needs to be answered, not final decisions.

---

## Questions to resolve in tech design

### Frontend
- Framework (Next.js, SvelteKit, Remix, Nuxt, plain React)?
- UI component library or hand-rolled?
- State management approach for itinerary editing?

### Backend
- Server-side framework or serverless functions?
- Where does the recommendation engine live?
- API design: REST, tRPC, or GraphQL?

### Database
- What needs to be persisted (trips, places, itineraries, user accounts)?
- SQL vs. document store?
- Managed hosting (Supabase, PlanetScale, Neon, Turso)?

### AI / LLM
- Which model for ranking and rationale generation?
- How to keep LLM usage cost-bounded?
- Deterministic rules vs. LLM for scheduling logic?

### Maps and places
- Google Maps Platform, Mapbox, or OSM-based alternative?
- Which APIs for place data and route estimation?
- Caching strategy to contain costs?

### Content / source retrieval
- How to source candidate places (structured APIs, curated retrieval, or hybrid)?
- Reddit API usage scope and rate limits?
- Blog/web content: link-and-summary only, not full text copying?

### Auth
- Required in v1?
- If yes: managed auth (Clerk, Auth.js, Supabase Auth) or custom?

### Deployment
- Vercel, Cloudflare Pages, Fly.io, or other?
- Environment variable management?
- CI/CD approach?

---

## Guiding constraints

- Low budget: prefer free tiers, avoid APIs that become expensive quickly at low scale
- Solo/small team: prefer managed services over self-hosted infrastructure
- Must be web-deployable (Vercel or Cloudflare Pages preferred)
- Keep architecture simple — MVP is not a platform, it is a focused product
