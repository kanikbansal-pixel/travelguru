# Testing Approach — WayPoint

> To be expanded after the technical design phase defines the stack.

---

## Principles

- Test the happy path and the two most likely failure cases for each feature.
- Do not write tests that only test the framework or library.
- Prefer integration tests over unit tests for the itinerary builder — the output depends on multiple coordinated inputs.
- The trust layer (rationale + source on each place) must be covered in every itinerary generation test: never return a place without these fields.

---

## Test areas (to flesh out after tech design)

### Trip input form
- Valid input produces a generation request
- Missing required fields are caught with clear errors
- Boundary values for dates and budget levels behave correctly

### Recommendation engine
- Returns relevant places for a given destination and preference set
- Does not return places with missing rationale or source fields
- Handles low-result or zero-result gracefully

### Itinerary builder
- Generated days do not exceed max-stops limit
- Travel time buffers are included between stops
- Geographic grouping keeps nearby places on the same day where possible
- Regenerating one day does not mutate other days

### Editor
- Reordering a stop updates order without losing place data
- Removing a stop does not break adjacent stops
- Replace operation substitutes one place with another without resetting the day

### Map and routing
- Travel time estimates are present for all consecutive stop pairs
- Map renders all places for the current itinerary

### Save and export
- Saved itinerary is retrievable in the same state
- Export output contains all days, places, rationale, and sources

---

## Tooling (TBD after stack decision)

| Concern | Likely tool |
|---------|-------------|
| Unit and integration tests | Vitest or Jest |
| End-to-end tests | Playwright |
| Linting | ESLint + Prettier |
| Type checking | TypeScript strict mode |
