# Grabby

A mobile-first Expo/React Native app — no backend or API server. All data is static/local.

## Run & Operate

- **Mobile app**: workflow `artifacts/mobile: expo` — `pnpm --filter @workspace/mobile run dev`
- `pnpm run typecheck` — typecheck the mobile app

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- **Mobile**: Expo ~54, React Native 0.81, expo-router, TanStack Query
- No backend, no database — fully client-side

## Where things live

- `artifacts/mobile/app/(tabs)/` — main tab screens (Home, Activity, Orders, Chat)
- `artifacts/mobile/app/(tabs)/_layout.tsx` — custom animated tab bar
- `artifacts/mobile/app/index.tsx` — splash screen (redirects to tabs)
- `artifacts/mobile/app/onboarding/` — onboarding flow (native only)
- `artifacts/mobile/assets/images/` — local image assets
- `artifacts/mobile/constants/colors.ts` — design tokens

## Navigation bar

Custom animated floating pill bar — matches the Grab-style design reference:
- Active tab: green elongated pill (#00B14F) with white icon + label
- Inactive tabs: gray circles (#EFEFEF) with gray icons, inside a rounded gray container (#E2E2E2)
- Defined in `artifacts/mobile/app/(tabs)/_layout.tsx`

## Architecture decisions

- Pure client-side — no Express server, no Drizzle/PostgreSQL, no API codegen.
- Web preview skips the native splash screen and goes straight to tabs (`<Redirect href="/(tabs)" />`).
- Tab bar uses `Animated.Value` springs to morph inactive circles into the active green pill.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- On web, `app/index.tsx` renders `<Redirect href="/(tabs)" />` immediately (no timer).
- On native, the splash shows for 2.2 s then checks `AsyncStorage` for `onboardingDone`.
