<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AGENTS.md — Historando

Guidance for AI agents and developers working in this repository.

## What this is
A **private hiking web app** (not public) for the owner and a few friends.
Core features: browse hikes in a **list** and on a **map**, and **upload a GPX** to add a hike.
Priorities: **simple yet robust**, solo-maintainer friendly, **Next.js on Vercel**.

## Tech Stack (core)
| Concern | Choice |
|---|---|
| Framework | Next.js (**App Router**) + React + **TypeScript (strict)** |
| Styling | **Tailwind CSS** (plain — no component library) |
| Database | **Supabase Postgres** |
| ORM | **Drizzle ORM** + drizzle-kit + `postgres.js` |
| File storage | **Supabase Storage** (`@supabase/supabase-js`, server-side) |
| Auth | **jose** (JWT), single shared secret |
| Validation | **Zod** (API input, env, parsed GPX metadata) |
| Env safety | Hand-rolled `src/env.ts` with Zod (no extra dependency) |
| Forms | react-hook-form + zod resolver |
| Client UI state | **Zustand** (client interaction only, not server data) |
| Testing | **Vitest** (unit) |
| Lint/format | ESLint (next config) + Prettier |
| Package manager | **npm** |

### Additional dependencies
**DO NOT ADD** other dependencies without approval

## Architecture
```
Browser (App Router: Server + Client Components)
  ├─ /login              → POST shared secret → sets HTTP-only JWT cookie
  ├─ /            (prot.) → hikes list + map
  ├─ /upload      (prot.) → GPX upload form
  └─ app/api/*    Route Handlers:
        /api/login         POST verify secret → JWT cookie
        /api/hikes         GET list / POST multipart → parse → Storage + Postgres
                                        ├─ Drizzle ──► Supabase Postgres
                                        └─ supabase-js ──► Supabase Storage (raw .gpx)
        /api/hikes/[id]    GET
```

### Conventions
- **Reads** (list, detail) go through **Server Components** via Drizzle — keep server data out of Zustand.
- **Mutations** and client-fetched JSON go through **Route Handlers**.
- **Zustand** holds only shared client UI state (selected/hovered hike, map viewport) shared between list and map.

## Auth model
- One shared secret in env `JWT_SECRET_KEY`, entered at `/login`.
- Exchanged for a signed **JWT** (`jose`, HMAC) stored in an **HTTP-only, Secure, SameSite=Lax cookie**.
- **`proxy.ts`** verifies the cookie on all routes **except** `/login`, `/api/login`, and static assets.
- No auth provider, no users table. Secrets live only in Vercel env vars — never commit them.

## GPX handling
**Parse once on upload — never per request.** On upload:
1. Validate the multipart request (Zod).
2. Parse the GPX (geo lib chosen later) and derive metrics.
3. Store the **raw `.gpx`** in Supabase Storage.
4. Insert a **row in Postgres** with derived fields.

## Data model — `hikes` (Drizzle)
- `id` uuid (pk)
- `title` text
- `description` text (nullable)
- `distance_m` int — derived
- `elevation_gain_m` int — derived
- `elevation_loss_m` int — derived
- `duration_s` int (nullable) — derived if timestamps present
- `bbox` jsonb (minLng,minLat,maxLng,maxLat) — map bounds
- `geometry` jsonb — simplified coordinate array for rendering
- `gpx_path` text — Supabase Storage object path (raw file)
- `created_at` timestamptz (default now)

## Environment variables
- `DATABASE_URL` — Supabase Postgres connection string
- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` — server-side Storage access
- `JWT_SECRET_KEY` — signing key for the session JWT
- `LOGIN_PASSWORD` — shared password entered at `/login`

Validate all of the above in `src/env.ts` (Zod) and mirror them in `.env.example`.

## Build order (high level)
scaffold → core libs → env validation → Drizzle schema/migration → auth (login + middleware) →
Supabase Storage → GPX upload endpoint → list & detail pages → map placeholder (+ Zustand) →
Vitest tests → Vercel deploy.
