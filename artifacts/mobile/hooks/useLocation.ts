import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

export interface Coords {
  lat: number;
  lng: number;
}

// Default: Kampala, Uganda
const DEFAULT: Coords = { lat: 0.3476, lng: 32.5825 };

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

/** Geocode an address string → { lat, lng, name } using Nominatim */
export async function geocodeAddress(query: string): Promise<{ lat: number; lng: number; name: string }[]> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&addressdetails=1`;
    const res = await fetch(url, { headers: { 'Accept-Language': 'en' } });
    const data = await res.json();
    return (data as any[]).map((r) => ({
      lat: parseFloat(r.lat),
      lng: parseFloat(r.lon),
      name: r.display_name as string,
    }));
  } catch {
    return [];
  }
}
