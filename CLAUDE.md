# CLAUDE.md — Claude Code Configuration for WayPoint

## Project context

**App:** WayPoint  
**Stack:** Next.js 14 App Router + Supabase + OpenAI GPT-4o + Vercel  
**Stage:** MVP — Phase 1 (Skeleton)  
**Repo:** https://github.com/kanikbansal-pixel/travelguru

## Session start (required every time)

1. Read `AGENTS.md` — master contract, confirmed decisions, what NOT to do
2. Read `MEMORY.md` — active phase and last known state
3. Read `agent_docs/project_brief.md` — commands and quality gates
4. Propose what you plan to do. Wait for approval before coding.

## Directives

1. **Plan first.** Propose a brief approach before writing any code. Wait for approval.
2. **One feature at a time.** Complete and verify before moving to the next.
3. **Verify after every change.** Run `npm run typecheck && npm run lint`. Fix failures before continuing.
4. **Trust layer is non-negotiable.** Every place must have `rationale` and `sourceLabel`. Never stub these.
5. **No `any` types.** Use `unknown` with type guards or define proper interfaces.
6. **Secrets in env only.** Never write API keys into source files.
7. **Update MEMORY.md** at the end of every session.
8. **Be concise.** No apologies, no filler. Fix errors immediately and explain what changed.

## Commands

```bash
npm run dev          # Start dev server on localhost:3000
npm run build        # Production build
npm run typecheck    # TypeScript type check (no emit)
npm run lint         # ESLint
npm test             # Run tests (Vitest, added in v1.1)
```

## What NOT to do

- Do NOT add features outside the current phase
- Do NOT skip typecheck/lint for "simple" changes
- Do NOT use `any` types
- Do NOT commit secrets or API keys
- Do NOT modify the DB schema without noting it in MEMORY.md
- Do NOT generate long filler text — fix and explain concisely

## Context files (load in this order if context resets)

1. `AGENTS.md`
2. `MEMORY.md`
3. `agent_docs/project_brief.md`
4. `agent_docs/code_patterns.md` (if building components)
5. `agent_docs/product_requirements.md` (if checking acceptance criteria)

## First prompt to use

```
Read CLAUDE.md, then AGENTS.md, then MEMORY.md.
Summarise: (1) what phase we are on, (2) what was last completed, (3) what you plan to build next.
Wait for my approval before writing any code.
```
