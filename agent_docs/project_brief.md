# Project Brief — WayPoint

> Load this at the start of every new session for compact context.

---

## What is WayPoint?

A web app that generates realistic, source-backed international trip itineraries for research-heavy leisure travelers. Users enter their destination, dates, budget, pace, and interests — and get an editable day-by-day plan with map-aware routing and visible rationale for every recommended place.

**Differentiators:**
- Every recommendation shows *why* it was chosen and which source it came from
- Day plans include realistic travel-time buffers (not just a list of places)
- Users edit like a document, not a chatbot

---

## Current phase

Research, PRD, and technical design are done. Next step is generating `AGENTS.md` agent-specific configs and starting the MVP build (Phase 1: skeleton).

---

## MVP constraints

- International city trips only: 3–7 days, 1–2 cities
- Web only (no mobile app in v1)
- Low budget — avoid APIs that get expensive fast at low scale
- Solo or small team — keep architecture simple

---

## Core features (MVP only)

1. Trip input form
2. Recommendation engine with source-backed candidate places
3. Day-by-day itinerary builder (map-aware, time-buffer-aware)
4. Inline editor (reorder, remove, replace, regenerate single day)
5. Map view with travel time estimates between stops
6. Trust layer: rationale + source link per place
7. Save and export

---

## Non-goals for MVP

Flight booking, hotel booking, payments, visa support, social features, mobile app, full global destination coverage.

---

## Confirmed stack

Next.js 14 (App Router) + Supabase + OpenAI GPT-4o + Mapbox + Foursquare Places API + Reddit API + Vercel

## Key files

| File | Purpose |
|------|---------|
| `AGENTS.md` | Master AI instructions — read first |
| `docs/PRD-WayPoint-MVP.md` | Full product requirements |
| `docs/research-WayPoint.md` | Market research and competitor analysis |
| `docs/TechDesign-WayPoint-MVP.md` | Full technical design — stack, schema, pipeline, build phases |
| `agent_docs/tech_stack.md` | Quick reference for confirmed stack decisions |
