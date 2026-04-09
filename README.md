# WayPoint

> **Realistic, source-backed international trip itineraries — built from real traveler signals, not generic AI lists.**

WayPoint is a web application that helps international leisure travelers plan city trips by combining structured itinerary generation with research-backed recommendations drawn from real traveler discussions and trusted travel content. Every recommendation shows *why* it was chosen, and every plan accounts for realistic routing and travel time.

---

## The problem

Planning an international trip is fragmented. Travelers bounce between Reddit, ChatGPT, blogs, Google Maps, and spreadsheets. Current AI tools generate plans, but users still have to verify everything themselves. WayPoint closes that gap by turning the research-heavy workflow into a trusted, editable day-by-day itinerary.

---

## Product positioning

**Not just itinerary generation. Verified trip reasoning.**

- Built from real traveler recommendations, not generic top-10 lists
- Plans days you can actually do
- See why each stop was chosen
- Edit your trip like a document, not a chatbot

---

## Project status

| Phase | Status |
|-------|--------|
| Market research | Done |
| Product requirements (PRD) | Done |
| Technical design | Next |
| AGENTS.md + agent docs | Pending |
| MVP build | Pending |

---

## Repository structure

```
waypoint/
├── docs/
│   ├── research-WayPoint.md          # Market research and competitor analysis
│   ├── PRD-WayPoint-MVP.md           # Product requirements document
│   └── TechDesign-WayPoint-MVP.md    # Technical design (in progress)
├── agent_docs/
│   ├── project_brief.md              # Project context for AI agents
│   ├── tech_stack.md                 # Stack decisions and rationale
│   └── testing.md                    # Testing approach
├── specs/                            # Agent handoff artifacts per feature
├── .cursor/rules/                    # Cursor-specific agent rules
├── src/                              # Application source code
├── AGENTS.md                         # Master AI agent instructions
└── README.md
```

---

## MVP scope

- International city trips: 3–7 days, 1–2 cities
- Web app only (no native mobile in v1)
- Personalized itinerary generation based on user preferences
- Source-backed recommendation cards with rationale
- Editable day-by-day plan (remove, reorder, replace, regenerate single day)
- Map and travel-time aware scheduling

---

## What is not in MVP

- Hotel or flight booking
- Payments for travel inventory
- Visa support
- Social networking or collaboration
- Native mobile apps
- Full automation of live opening hours

---

## Next steps

1. Complete technical design (stack selection, data model, API choices)
2. Generate `AGENTS.md` and `agent_docs/` from PRD + tech design
3. Build MVP in small reviewable phases
4. Validate with 10 real travelers planning an international trip
5. Measure: did it replace their Reddit + spreadsheet workflow?

---

## Workflow

This project follows the [vibe-coding prompt template](https://github.com/KhazP/vibe-coding-prompt-template) workflow:

```
Idea → Research → PRD → Tech Design → AGENTS.md → MVP Build
```

---

## Name note

Working title was **TrustTrip**. Renamed to **WayPoint** — shorter, cleaner, and less literal while still evoking navigation and purposeful travel. Other candidates considered: *Itinera*, *Wayfound*, *Pathlo*, *Roamly*.
