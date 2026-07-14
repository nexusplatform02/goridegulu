# Grabby

A mobile app (Expo/React Native) backed by an Express API server and PostgreSQL database.

## Run & Operate

- **Mobile app**: workflow `artifacts/mobile: expo` — Expo dev server (scan QR or open web preview)
- **API server**: workflow `artifacts/api-server: API Server` — `pnpm --filter @workspace/api-server run dev` (port assigned via `$PORT`)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes to dev database (dev only)
- Required env: `DATABASE_URL` — provisioned automatically by Replit (no manual setup needed)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- **Mobile**: Expo ~54, React Native 0.81, expo-router, TanStack Query
- **API**: Express 5, pino logging
- **DB**: PostgreSQL + Drizzle ORM + drizzle-zod
- **Validation**: Zod (`zod/v4`)
- **API codegen**: Orval (from OpenAPI spec → `lib/api-spec`)
- **Build**: esbuild (CJS bundle for API server)

## Where things live

- `artifacts/api-server/` — Express API server
- `artifacts/mobile/` — Expo mobile app
- `lib/db/` — Drizzle schema and DB connection (`DATABASE_URL` required)
- `lib/api-spec/` — OpenAPI spec (source of truth for API contract)
- `lib/api-zod/` — generated Zod schemas from OpenAPI spec
- `lib/api-client-react/` — generated TanStack Query hooks for mobile

## Architecture decisions

- API contract is code-generated from the OpenAPI spec in `lib/api-spec`; run codegen after changing the spec.
- DB schema lives in `lib/db/src/schema/`; run `pnpm --filter @workspace/db run push` after adding tables.
- API server bundles to a single ESM file via esbuild before running (`node ./dist/index.mjs`).

## Product

_Describe the high-level user-facing capabilities of this app once they exist._

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- `DATABASE_URL` is runtime-managed by Replit — never set it manually.
- Always run codegen (`pnpm --filter @workspace/api-spec run codegen`) after changing the OpenAPI spec.
- DB schema changes require `pnpm --filter @workspace/db run push` on dev; production schema is applied automatically on Publish.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
