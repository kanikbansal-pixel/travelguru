# Testing Strategy — WayPoint

---

## 48-hour MVP approach (manual verification loop)

Testing frameworks (Vitest, Playwright) are added in v1.1 after the schema stabilises. For the 48-hour build, use a manual verification loop after every feature.

### Manual verification loop

After every feature, run:

```bash
npm run typecheck    # Zero errors required
npm run lint         # Zero errors/warnings required
```

Then manually verify in the browser:
1. Does the feature work as described in `agent_docs/product_requirements.md`?
2. Is the trust layer intact? (every place has rationale + sourceLabel)
3. Does removing or editing a stop crash anything?
4. Does the console show unexpected errors?

---

## Non-negotiable checks (every feature, every time)

These must pass before marking any feature as done:

| Check | How to verify |
|-------|--------------|
| Every place has non-empty `rationale` | Inspect the itinerary JSON in network tab or Supabase dashboard |
| Every place has non-empty `sourceLabel` | Same |
| No day exceeds 5 places | Count places in itinerary view |
| Travel time appears between consecutive stops | Visible TravelTimeBadge in UI |
| Regenerating day N doesn't change day N-1 or N+1 | Compare before/after in UI |
| TypeScript and lint pass | `npm run typecheck && npm run lint` |

---

## Test coverage areas (for when Vitest is added)

### Trip input form
- Valid input produces a request to `/api/itinerary/generate`
- Missing required fields are caught with inline validation messages
- End date before start date is rejected
- Interests multi-select works correctly

### Itinerary generation API (`POST /api/itinerary/generate`)
- Valid request returns `{ tripId, itinerary }` with status 200
- Itinerary has at least one day
- Every place has non-empty `rationale` and `sourceLabel`
- No day has more than 5 places
- Missing required field returns 400
- Invalid date format returns 400

### Day regeneration API
- Regenerating day 2 does not change day 1 or day 3
- Regenerated day still has valid places with rationale + sourceLabel
- Returns the updated day only, not the full itinerary

### Editor actions
- Removing a place renumbers remaining places correctly
- Moving a place up decreases its index by 1
- Moving a place down increases its index by 1
- First place cannot be moved up (button disabled)
- Last place cannot be moved down (button disabled)

### Save and auth
- Anonymous user: save button prompts sign-in
- Authenticated user: save button stores trip with correct user_id
- Saved trip is retrievable from `/trips` page in a new session

### Export
- Copy-to-clipboard produces text including destination, dates, all days, all places with rationale

---

## Pre-commit hooks (add after Phase 1)

```bash
# Setup
npm install --save-dev husky lint-staged
npx husky init

# .husky/pre-commit content:
npx lint-staged

# package.json addition:
"lint-staged": {
  "*.{ts,tsx}": [
    "eslint --fix",
    "prettier --write"
  ]
}
```

Run `npm run typecheck` manually before committing (lint-staged doesn't run tsc by default — too slow).

---

## Tooling (confirmed for v1.1)

| Concern | Tool |
|---------|------|
| Unit + integration tests | **Vitest** |
| HTTP mocking in tests | **msw (Mock Service Worker)** |
| E2E browser tests | **Playwright** |
| Linting | **ESLint (via Next.js config)** |
| Formatting | **Prettier** |
| Type checking | **TypeScript strict (`tsc --noEmit`)** |
| Pre-commit | **Husky + lint-staged** |

---

## Visual verification (for UI changes)

After any significant UI change:
1. Open the app in the browser
2. Check the itinerary view at 375px width (mobile) and 1280px (desktop)
3. Check that PlaceCards, TravelTimeBadges, and DayCards render without overflow or clipping
4. Verify no `[object Object]` or `undefined` visible in the UI (serialisation errors)
