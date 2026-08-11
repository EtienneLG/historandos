# Historando

A private hiking web app for the owner and a few friends: browse hikes in a
**list** or on a **map**, and **upload a GPX** to add a new one. See
[`AGENTS.md`](./AGENTS.md) for the full architecture reference, data model,
and conventions.

## Tech stack

Next.js (App Router) + TypeScript, Tailwind CSS, Supabase Postgres via
Drizzle ORM, Mapbox GL for maps, recharts for the elevation profile, and the
Infomaniak Drive API for photo storage. See [`AGENTS.md`](./AGENTS.md#tech-stack-core)
for the full list.

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in the values (see
   [Environment variables](#environment-variables) below):

   ```bash
   cp .env.example .env
   ```

3. Run the dev server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) — you'll be redirected
   to `/login` (password + rotating security question, see
   [`AGENTS.md`](./AGENTS.md#auth-model)).

## Scripts

| Command                  | Description                                                          |
| ------------------------ | -------------------------------------------------------------------- |
| `npm run dev`            | Start the Next.js dev server                                         |
| `npm run build`          | Production build                                                     |
| `npm run start`          | Serve a production build                                             |
| `npm run lint`           | Run ESLint                                                           |
| `npm run format`         | Format the codebase with Prettier                                    |
| `npm run format:check`   | Check formatting without writing                                     |
| `npm run seed:hike`      | Insert a hike from a local `.gpx` file (see script header for flags) |
| `npm run seed:waypoints` | Seed or clean demo waypoints for an existing hike by id              |

Database schema changes go through `drizzle-kit`, configured in
`drizzle.config.ts` (schema at `src/db/schema.ts`, migrations output to
`drizzle/`):

```bash
npx drizzle-kit generate   # create a migration from schema changes
npx drizzle-kit push       # push schema changes directly to the database
```

## Environment variables

All variables are validated at startup in `src/env.ts`. See `.env.example`
for the full list and [`AGENTS.md`](./AGENTS.md#environment-variables) for
what each one is used for:

- `DATABASE_URL`, `DIRECT_DATABASE_URL` — Supabase Postgres connection
- `JWT_SECRET_KEY`, `LOGIN_PASSWORD` — auth
- `INFOMANIAK_DRIVE_SECRET`, `INFOMANIAK_DRIVE_ID`, `INFOMANIAK_LOGIN_QA_ID`, 
  `INFOMANIAK_TRACE_DIR_ID` — Infomaniak Drive API
- `NEXT_PUBLIC_MAPBOX_TOKEN` — client-side Mapbox GL token

## Learn more

- [`AGENTS.md`](./AGENTS.md) — architecture, data model, auth model, GPX
  handling, and conventions for this repo.
- [Next.js Documentation](https://nextjs.org/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team/docs/overview)
