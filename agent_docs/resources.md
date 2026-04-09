# Essential Resources — WayPoint

> Reference links for the stack and patterns used in this project.
> Check these before adding a new library or pattern.

---

## Official documentation

| Technology | Docs URL | Most useful section |
|------------|---------|---------------------|
| Next.js 14 App Router | https://nextjs.org/docs | App Router, Route Handlers, Server vs Client components |
| Supabase JS v2 | https://supabase.com/docs/reference/javascript | Auth, Database queries |
| Supabase SSR (App Router) | https://supabase.com/docs/guides/auth/server-side/nextjs | Server and browser client setup |
| Supabase Auth | https://supabase.com/docs/guides/auth | Email auth, session management |
| OpenAI Node SDK | https://platform.openai.com/docs/api-reference | Chat completions, JSON mode |
| Tailwind CSS | https://tailwindcss.com/docs | Utility classes |
| shadcn/ui | https://ui.shadcn.com/docs | Component installation and usage |
| Zod | https://zod.dev | Schema definitions and validation |
| Vercel | https://vercel.com/docs | Environment variables, deployment |

---

## Key guides for common tasks

### Setting up Supabase with Next.js App Router
https://supabase.com/docs/guides/auth/server-side/nextjs
- Use `@supabase/ssr` (not the legacy `@supabase/auth-helpers-nextjs`)
- Follow the middleware setup for cookie-based session management

### Installing shadcn/ui components
```bash
npx shadcn@latest add button card badge input select
```
Components are copied into `src/components/ui/` — you own them.

### OpenAI JSON mode
https://platform.openai.com/docs/guides/structured-outputs
- Use `response_format: { type: 'json_object' }` for reliable JSON output
- Always validate with Zod after parsing — LLMs can still produce invalid shapes

### Vercel environment variables
https://vercel.com/docs/projects/environment-variables
- Set in Vercel dashboard → Project → Settings → Environment Variables
- Variables prefixed `NEXT_PUBLIC_` are exposed to the browser
- Variables without prefix are server-only

---

## Curated repositories (reference patterns)

| Repository | Purpose |
|------------|---------|
| [PatrickJS/awesome-cursorrules](https://github.com/PatrickJS/awesome-cursorrules) | Anti-vibe rule templates for Cursor |
| [OneRedOak/claude-code-workflows](https://github.com/OneRedOak/claude-code-workflows) | Review workflow packs for Claude Code |
| [modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers) | MCP server implementations |

---

## Useful Supabase SQL snippets

### Create the trips table (run in Supabase SQL editor)
```sql
CREATE TABLE trips (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid REFERENCES auth.users(id),
  destination text NOT NULL,
  start_date  date,
  end_date    date,
  inputs      jsonb NOT NULL,
  itinerary   jsonb NOT NULL,
  status      text DEFAULT 'draft',
  created_at  timestamptz DEFAULT now()
);

CREATE INDEX idx_trips_user_id ON trips(user_id);

ALTER TABLE trips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own trips" ON trips
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Anyone can insert" ON trips
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own trips" ON trips
  FOR UPDATE USING (auth.uid() = user_id);
```

### Verify RLS is working
```sql
-- Run as anon: should return only rows with user_id IS NULL
SELECT id, destination, user_id FROM trips;
```

---

## Community support

| Community | URL |
|-----------|-----|
| Supabase Discord | https://discord.supabase.com |
| Next.js Discord | https://discord.gg/nextjs |
| shadcn/ui GitHub discussions | https://github.com/shadcn-ui/ui/discussions |
| Vercel community | https://vercel.community |

---

## Testing tools (for v1.1)

| Tool | Purpose | Docs |
|------|---------|------|
| Vitest | Unit + integration tests | https://vitest.dev |
| msw | Mock HTTP requests in tests | https://mswjs.io |
| Playwright | E2E browser testing | https://playwright.dev |
