# Review Checklist — WayPoint

> Run through this before every commit and before every deploy.
> Fix any failing item before continuing. Do not merge or deploy with outstanding items.

---

## Pre-commit checklist (run after every feature)

### Code quality
- [ ] `npm run typecheck` passes with zero errors
- [ ] `npm run lint` passes with zero errors or warnings
- [ ] No `any` types introduced — use `unknown` with type guards or proper interfaces
- [ ] No hardcoded secrets, API keys, or credentials in any file
- [ ] No `console.log` left in production paths (debug logs are okay in dev-only branches)

### Feature correctness
- [ ] The feature works as described in `agent_docs/product_requirements.md`
- [ ] The trust layer is intact: every place has a non-empty `rationale` and `sourceLabel`
- [ ] Travel time values are present between consecutive stops
- [ ] No day exceeds 5 places

### Data safety
- [ ] No database schema changes made without noting them in `MEMORY.md`
- [ ] RLS policies still active on the `trips` table after any schema change
- [ ] No user data visible to other users (verify RLS with a second test account if auth was changed)

---

## Pre-deploy checklist (run before merging to main / deploying to production)

### Environment
- [ ] All required environment variables are set in Vercel dashboard
- [ ] `.env.local` is in `.gitignore` and NOT committed
- [ ] OpenAI spending cap is set on the account ($20/month during development)
- [ ] Vercel build passes (`npm run build` locally or in preview)

### User-facing quality
- [ ] Trip form submits and reaches the itinerary view without errors
- [ ] Itinerary view renders at least one full day with places, rationale, and travel times
- [ ] Remove-stop and regenerate-day work without crashing the page
- [ ] Save button requires sign-in (prompt appears for anonymous users)
- [ ] Export/copy produces readable plain text with all days and places

### Security pass
- [ ] No API keys in source code — confirmed with `grep -r "sk-" src/`
- [ ] All API route handlers validate input before processing
- [ ] LLM output is validated (rationale non-empty, lat/lng in range) before writing to DB
- [ ] Rate limiting is in place on `/api/itinerary/generate`

### Mobile (before first real user)
- [ ] Itinerary view is readable on a 375px-wide screen
- [ ] Trip form is usable on mobile without horizontal scroll
- [ ] No touch targets smaller than 44px

---

## Phase completion gates

### Phase 1 done when:
- Deployed Vercel URL loads the trip form
- Form submits and shows a stub itinerary
- No TypeScript or lint errors

### Phase 2 done when:
- Real GPT-4o call replaces the stub
- Output is validated (rationale on every place, max 5/day)
- Loading state works; error state shows a friendly message

### Phase 3 done when:
- PlaceCard renders name, category, rationale, and source label
- TravelTimeBadge renders between every consecutive stop pair
- Export produces plain text with all data

### Phase 4 done when:
- Remove stop removes it from the day without crashing
- Reorder (up/down) changes slot order and re-renders correctly
- Regenerate day replaces only that day's places without touching others

### Phase 5 done when:
- Email sign-in works (sign up, sign in, sign out)
- Saving requires sign-in; anonymous users see a prompt
- Saved itinerary retrieves correctly in a new session

### Phase 6 done when (optional):
- Mapbox Static Images map renders the correct city with place markers
- Map loads without blocking the itinerary view if it fails
