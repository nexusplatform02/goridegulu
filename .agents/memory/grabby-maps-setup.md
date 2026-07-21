---
name: Grabby maps & transport setup
description: How maps, GPS and transport screens are wired in the Grabby mobile app
---

## Map approach
- Real Google Maps via WebView embed: `https://maps.google.com/maps?q={lat},{lng}&z=15&output=embed`
- Route mode: `https://maps.google.com/maps?saddr={lat1},{lng1}&daddr={lat2},{lng2}&output=embed`
- No API key required; free for reasonable usage (shows watermark at high volume)
- Component: `artifacts/mobile/components/GoogleMap.tsx` — handles web (iframe) and native (react-native-webview) separately

## GPS
- `artifacts/mobile/hooks/useLocation.ts` — wraps expo-location, returns `{ coords, loading, error }`
- Default fallback: Kampala, Uganda (0.3476, 32.5825)
- Also exports `geocodeAddress(query)` using Nominatim API for address → lat/lng

## Transport flow data
- Coordinates are passed as router params between screens: `destLat`, `destLng`, `destName`, `originLat`, `originLng`
- `transport/location.tsx` → `transport/confirm.tsx` → `transport/searching.tsx`
- Real Haversine distance calculated in confirm.tsx from origin/dest coords

## Back navigation
- food/tracking.tsx and mart/tracking.tsx: changed `router.push('/food')` → `router.back()`
- All transport screens already had `router.back()` correctly wired

## Pre-existing issue
- `artifacts/mobile/tsconfig.json` references `../../lib/api-client-react` which doesn't exist → typecheck fails
- This is NOT related to maps work; was broken before

**Why:** Google Maps embed approach was chosen because it requires no API key, no server side, not OpenStreetMap tiles, and works identically on web and native via WebView.
