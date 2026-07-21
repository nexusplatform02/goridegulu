import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

export interface Coords {
  lat: number;
  lng: number;
}

export interface PlaceResult {
  lat: number;
  lng: number;
  name: string;
}

// Default: Gulu, Uganda
export const GULU: Coords = { lat: 2.7748, lng: 32.2990 };
const DEFAULT: Coords = GULU;

export function useLocation() {
  const [coords, setCoords] = useState<Coords>(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setError('Location permission denied');
          setLoading(false);
          return;
        }
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        if (!cancelled) {
          setCoords({ lat: loc.coords.latitude, lng: loc.coords.longitude });
        }
      } catch (e) {
        if (!cancelled) setError('Could not get location');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return { coords, loading, error };
}

// Uganda bounding box for Overpass
const UG_BOX = '0.5,29.5,4.5,35.2';

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error('timeout')), ms)),
  ]);
}

/**
 * Search for places using three parallel free sources:
 *  1. Nominatim (OSM addresses + some POIs)
 *  2. Photon by Komoot (OSM with location bias, faster)
 *  3. Overpass API (raw OSM POI name search within Uganda)
 * Results are merged and deduplicated by proximity.
 */
export async function geocodeAddress(
  query: string,
  nearLat: number = GULU.lat,
  nearLng: number = GULU.lng,
): Promise<PlaceResult[]> {
  const q = query.trim();
  if (!q) return [];

  const [nominatimRaw, photonRaw, overpassRaw] = await Promise.allSettled([
    // ── 1. Nominatim — add Uganda context, higher limit ──────────────────
    withTimeout(
      fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q + ' Uganda')}&format=json&limit=8&addressdetails=1&countrycodes=ug&accept-language=en`,
        { headers: { 'User-Agent': 'GrabbyApp/1.0' } },
      ).then(r => r.json()),
      6000,
    ),

    // ── 2. Photon (komoot) — location-biased toward current coords ────────
    withTimeout(
      fetch(
        `https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&lat=${nearLat}&lon=${nearLng}&limit=8&lang=en`,
      ).then(r => r.json()),
      6000,
    ),

    // ── 3. Overpass — name-pattern POI search within Uganda bbox ──────────
    withTimeout(
      fetch(
        `https://overpass-api.de/api/interpreter`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `data=${encodeURIComponent(
            `[out:json][timeout:8];(node["name"~"${q}",i](${UG_BOX});way["name"~"${q}",i](${UG_BOX});relation["name"~"${q}",i](${UG_BOX}););out center 10;`,
          )}`,
        },
      ).then(r => r.json()),
      10000,
    ),
  ]);

  const all: PlaceResult[] = [];

  // Parse Nominatim
  if (nominatimRaw.status === 'fulfilled') {
    for (const r of nominatimRaw.value as any[]) {
      all.push({ lat: parseFloat(r.lat), lng: parseFloat(r.lon), name: r.display_name });
    }
  }

  // Parse Photon (GeoJSON FeatureCollection)
  if (photonRaw.status === 'fulfilled') {
    for (const f of photonRaw.value?.features ?? []) {
      const [lng, lat] = f.geometry?.coordinates ?? [];
      const p = f.properties ?? {};
      const parts = [p.name, p.street, p.city, p.state, p.country].filter(Boolean);
      if (lat && lng && parts.length) {
        all.push({ lat, lng, name: parts.join(', ') });
      }
    }
  }

  // Parse Overpass
  if (overpassRaw.status === 'fulfilled') {
    for (const el of overpassRaw.value?.elements ?? []) {
      const lat: number = el.lat ?? el.center?.lat;
      const lng: number = el.lon ?? el.center?.lon;
      const tags = el.tags ?? {};
      const name: string = tags.name ?? tags['name:en'];
      if (!lat || !lng || !name) continue;
      const addr = [
        tags['addr:street'],
        tags['addr:city'] || tags['addr:town'] || tags['addr:village'],
        'Uganda',
      ].filter(Boolean).join(', ');
      all.push({ lat, lng, name: addr ? `${name}, ${addr}` : name });
    }
  }

  // Deduplicate by proximity (~100 m radius)
  const out: PlaceResult[] = [];
  for (const r of all) {
    if (!r.name?.trim()) continue;
    const dup = out.some(
      d => Math.abs(d.lat - r.lat) < 0.001 && Math.abs(d.lng - r.lng) < 0.001,
    );
    if (!dup) out.push(r);
  }

  return out.slice(0, 12);
}
