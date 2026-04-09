# Product Requirements — WayPoint

> Extracted from `docs/PRD-WayPoint-MVP.md`.
> Use this as the reference for acceptance criteria when building each feature.

---

## Product definition

**Name:** WayPoint (working title was TrustTrip)

**One-line description:** A website that creates realistic, editable international trip itineraries using traveler-driven recommendations and map-aware planning.

**Core promise:** Turn deep travel research into a personalized, editable itinerary users can actually follow.

---

## Target user

International leisure travelers, age 22–40, who:
- Plans international city trips of 3–7 days
- Uses Reddit, blogs, YouTube, or travel forums to find real recommendations
- Wants personalized plans, not generic tourist lists
- Values hidden gems, realistic pacing, and convenience
- Does **not** fully trust AI-generated travel plans unless recommendations feel grounded in real traveler experience

**User mindset:** "I trust research. I don't trust AI lists. Show me why."

---

## User stories (acceptance criteria)

These are the exact stories the MVP must satisfy. Use them to define done.

| # | As a traveler... | Acceptance criteria |
|---|-----------------|---------------------|
| US-1 | I want to enter my destination, travel dates, budget, and interests so I can get a customized plan | Form accepts all 7 inputs; submitting triggers generation; validation prevents empty destination or invalid dates |
| US-2 | I want recommendations to feel grounded in real travel advice so I trust the output | Every PlaceCard shows a non-generic, specific rationale AND a source label |
| US-3 | I want to see a day-by-day itinerary so I can understand my trip structure | Itinerary view shows days in order, each day showing its date and ordered list of places |
| US-4 | I want to edit the plan easily so I can adapt it to my preferences | Can remove a stop, reorder stops, or regenerate a single day without resetting the whole trip |
| US-5 | I want to see travel times between places so my plan feels realistic | TravelTimeBadge appears between every consecutive stop pair, showing estimated minutes |
| US-6 | I want to know why a place was recommended so I can decide whether to keep it | Each PlaceCard has a specific 2-sentence rationale and a source label (e.g. "Popular on r/JapanTravel") |

---

## Must-have features (MVP)

These must work before the MVP can be called complete.

### F1 — Trip input form
- Destination city (text, required)
- Start date and end date (date pickers, required, must be in the future, max 7 days apart)
- Budget level (select: Budget / Mid-range / Luxury)
- Travel pace (select: Relaxed / Moderate / Packed)
- Interests (multi-select or tag input: e.g. food, culture, art, nightlife, nature, shopping, history)
- Must-do items (free text, optional)
- Must-avoid items (free text, optional)
- Validation: all required fields must be filled; end date must be after start date

### F2 — Itinerary generation
- On form submit, call `POST /api/itinerary/generate`
- Display a loading state while generation is in progress (LLM call takes 5–15 seconds)
- If generation fails, show a friendly error message with a retry option
- Generated itinerary is stored in Supabase `trips` table
- User is redirected to `/plan/[tripId]`

### F3 — Itinerary view
- Day-by-day layout, one section per day with the date shown
- Each day shows its places in order
- Between consecutive places, show a TravelTimeBadge with estimated minutes
- Each place shows: name, category badge, rationale (2 sentences), source label

### F4 — PlaceCard (trust layer — core differentiator)
- Place name (prominent)
- Category label (e.g. "Museum", "Restaurant", "Neighbourhood")
- Start time estimate (e.g. "9:00 AM")
- Duration estimate (e.g. "~1.5 hrs")
- Rationale text — specific to the user's trip profile, never generic
- Source label (e.g. "Commonly recommended on r/JapanTravel")
- This is the most important component. Do not stub it.

### F5 — Editor
- Remove a stop: removes it from the day and renumbers remaining stops
- Reorder within a day: up/down arrow buttons (drag-and-drop is v1.1)
- Regenerate a single day: re-calls LLM for that day only, keeps all other days untouched

### F6 — Save and auth
- Anonymous users can generate and view itineraries
- Clicking "Save" prompts sign-in if not authenticated
- Auth: Supabase Auth, email only (no Google OAuth in MVP)
- After sign-in, the trip is linked to the user's account
- Saved trips are listed on a `/trips` page

### F7 — Export
- "Copy to clipboard" button exports the full itinerary as plain text
- Format: destination, dates, then each day with date header, places with rationale, travel times

---

## Nice-to-have features (after MVP validation)

These are NOT in the 48-hour build. Add only after core flow is validated.

- Mapbox GL JS interactive map with route polyline (current plan: Static Images API only)
- Google OAuth sign-in
- Drag-and-drop reorder within a day
- Replace a stop (search for alternatives)
- Share a read-only trip link
- Foursquare-backed place data (real coordinates, ratings, hours)
- Reddit API source mentions (real post links)
- Multi-city support (two cities per trip)
- PDF export

---

## Not in MVP (ever)

- Hotel or flight booking
- Payment processing for travel inventory
- Visa information
- Social feed or user-to-user collaboration
- Native mobile app
- Full global destination coverage with equal quality

---

## Experience requirements

The product must feel:
- **Trustworthy** — every recommendation has a reason
- **Structured** — clear day-by-day layout, nothing crammed
- **Editable** — users control the plan, AI doesn't lock it
- **Not overwhelming** — one action at a time, clean interface

The interface must emphasise:
- Confidence in recommendations (rationale visible by default, not hidden)
- Easy onboarding (form is the first thing, short and clear)
- Smooth flow from form → loading → itinerary
- Editing controls that are obvious without explanation

---

## Success metrics

### Primary metric
Percentage of users who say the itinerary meaningfully reduced their manual research time.

### Secondary metrics (to track from day 1)
- Itinerary completion rate (form submitted → itinerary viewed)
- Average time from form to first itinerary shown
- Number of manual edits per itinerary
- Percentage of generated stops retained after editing
- Export or save rate
- Repeat planning rate (same user generates a second itinerary)

---

## MVP launch criteria

The MVP is successful if:
- Users can generate a personalized itinerary in one session
- The itinerary includes meaningful and relevant places (not generic lists)
- The plan feels realistic (not overpacked, with travel time shown)
- Users can edit day plans quickly
- Source-backed rationale improves reported trust in recommendations

---

## Content policy (for the LLM prompt and storage)

- Link to sources instead of copying long-form content
- Store lightweight summaries and source labels only
- Never store full Reddit posts or blog articles
- Distinguish system-generated summaries from original sources
- LLM-authored source labels must be honest — do not claim Reddit sourcing if we haven't verified it
  - Correct: "Popular among travelers on community travel forums"
  - Correct: "Frequently mentioned in travel blogs for budget travelers"
  - Incorrect: "From r/JapanTravel" (if we haven't actually retrieved that post)
