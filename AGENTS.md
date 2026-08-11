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
| ORM | **Drizzle ORM** (relational API, `defineRelations`) + drizzle-kit + `postgres.js` |
| Photo storage | **Infomaniak Drive API** (`src/lib/infomaniak.ts`) — hikes reference a `photoDirId`, photos/thumbnails are proxied server-side, never stored locally |
| Map | **Mapbox GL JS** via `mapbox-gl` + `react-map-gl` |
| Charts | **recharts** (elevation profile) |
| GPX/geo parsing | `@tmcw/togeojson` (GPX → GeoJSON) + `@turf/distance` + `@turf/helpers` (stats) |
| Auth | **jose** (JWT) + password & rotating security question |
| Validation | **Zod** + `zod-geojson` (API input, env, geometry/bbox) |
| Env safety | Hand-rolled `src/env.ts` with Zod (no extra dependency) |
| Client UI state | **Zustand** (client interaction only, not server data) |
| Lint/format | ESLint (next config) + Prettier |
| Package manager | **npm** |

### Additional dependencies
**DO NOT ADD** other dependencies without approval

## Architecture
```
Browser (App Router: Server + Client Components)
  ├─ /login              → answer password + security question → sets HTTP-only JWT cookie
  ├─ /            (prot.) → hikes list + map (route group `(home)`)
  ├─ /upload      (prot.) → GPX upload wizard (parse → review → submit)
  └─ app/api/*    Route Handlers:
        /api/login/qa/question   GET a random QA question (from Infomaniak)
        /api/login/qa/answer     POST password + answer → verify → JWT cookie
        /api/hikes               GET summaries / POST new hike (parsed client-side, JSON body)
        /api/hikes/[id]           GET full geometry + waypoints for one hike
        /api/photos/list             GET Infomaniak Drive file listing for a photoDirId
        /api/photos/random           GET a random photo id for a photoDirId
        /api/photos/[id]/thumbnail   GET proxied Infomaniak thumbnail bytes
                                        └─ Drizzle ──► Supabase Postgres
                                        └─ fetch ──► Infomaniak Drive API (photos only)
```

### Conventions
- **Reads** (`src/lib/data.ts`) go through **Server Components**, using Drizzle with Next's
  `'use cache'` + `cacheTag('hikes')` + `cacheLife('days')`.
- **Mutations** go through **Route Handlers** and call `revalidateTag('hikes', 'days')` after writing.
- **Zustand** stores (`src/stores/`) hold client UI state only: map/list selection, upload wizard
  state, active hike, resolved geometry/waypoints — never server data.
- Route-level UI is colocated under `_components/` folders (e.g. `src/app/(home)/_components/`,
  `src/app/upload/_components/`), not in a shared top-level components dir except truly generic
  pieces (`src/components/`).
- Shared Zod schemas/types live in `src/types/` (`hike-types.ts`, `question.ts`) and are the
  source of truth for both API validation and TS types (`z.infer`).

## Auth model
- No shared single secret. Login (`/login`) requires **both** a password (`LOGIN_PASSWORD`) and
  the correct answer to a **random security question**, fetched via `getQA()` from an
  Infomaniak-hosted QA list (`INFOMANIAK_LOGIN_QA_ID`).
- `POST /api/login/qa/answer` verifies both, then signs a **JWT** (`jose`, HMAC) stored in an
  **HTTP-only cookie** (`authentificated`).
- **`proxy.ts`** verifies the cookie on all routes **except** `/api/login`, static assets, and
  Next internals; redirects unauthenticated requests to `/login`.
- No auth provider, no users table. Secrets live only in Vercel env vars — never commit them.

## GPX handling
**GPX is parsed client-side during upload and never persisted as a file.**
1. The upload wizard parses the `.gpx` (via `@tmcw/togeojson`) and derives geometry, stats
   (distance/elevation gain-loss via `@turf/*`), and waypoints in the browser.
2. `POST /api/hikes` receives the derived **JSON** payload (Zod-validated
   `NewHikeRequestSchema`), recomputes/validates stats server-side, and inserts a `hikes` row
   plus any `hikeWaypoints` rows in one transaction.
3. The raw `.gpx` file itself is **not stored** anywhere — only derived data lives in Postgres.
   (The legacy `gpxPath` column on `hikes` is unused and always `null`.)

## Data model (Drizzle, `src/db/schema.ts`)
- **`hikes`**: `id` uuid (pk), `title`, `description`, `date`, `isLoop` bool, `people` text[],
  `photoDirId` int (Infomaniak folder), `startLat`/`startLon`, derived stats `distanceM` /
  `elevationGainM` / `elevationLossM`, `bbox` jsonb, `geometry` jsonb (GeoJSON LineString),
  `gpxPath` (legacy/unused), `createdAt`.
- **`hikeWaypoints`**: `id` uuid (pk), `hikeId` (fk → `hikes.id`), `category` enum (`start`,
  `end`, `accommodation`, `poi`, `logistics`, `hazard`), `name`, `description`,
  `indexFromStart`, plus category-specific `accommodationType` (`tent`/`refuge`/`hotel`/`other`)
  and `poiType` (`peak`/`sight`/`building`/`other`).
- Relations declared with `defineRelations` (drizzle-orm 1.0 relational API): a hike has many
  waypoints.

## Environment variables
- `DATABASE_URL` — Supabase Postgres connection string (`DIRECT_DATABASE_URL` optional, for
  migrations needing a non-pooled connection)
- `JWT_SECRET_KEY` — signing key for the session JWT
- `LOGIN_PASSWORD` — password entered at `/login`, checked alongside the security question
- `INFOMANIAK_DRIVE_SECRET`, `INFOMANIAK_DRIVE_ID` — Infomaniak Drive API credentials
- `INFOMANIAK_METADATA_ID`, `INFOMANIAK_LOGIN_QA_ID`, `INFOMANIAK_TRACE_DIR_ID` — Drive file/dir
  IDs for metadata, login QA list, and trace storage
- `NEXT_PUBLIC_MAPBOX_TOKEN` — client-side Mapbox GL token

Validate all of the above in `src/env.ts` (Zod) and mirror them in `.env.example`.
