import { useCallback, useEffect, useState } from 'react';

/**
 * Approximate device location pulled from the browser's Geolocation API.
 * We deliberately do NOT reverse-geocode to a city name on the client — the
 * AI parser is given the raw coordinates and asked to infer the
 * neighborhood/city in Costa Rica, which avoids an extra HTTP dependency
 * (Nominatim/Google Geocoding) and works offline of any rate limits.
 */
export interface DeviceLocation {
  lat: number;
  lng: number;
  accuracyMeters: number;
  capturedAt: string;
}

export type LocationPermissionStatus =
  | 'idle'
  | 'requesting'
  | 'granted'
  | 'denied'
  | 'unavailable';

const STORAGE_KEY = 'solvo:device-location';
/** Cached coords are reused for 30 minutes before we request a fresh fix. */
const TTL_MS = 30 * 60 * 1000;

function readCache(): DeviceLocation | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as DeviceLocation;
    const ageMs = Date.now() - new Date(parsed.capturedAt).getTime();
    if (!Number.isFinite(ageMs) || ageMs > TTL_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeCache(loc: DeviceLocation): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(loc));
  } catch {
    /* localStorage may be full / unavailable; ignore */
  }
}

export interface UseUserLocationResult {
  location: DeviceLocation | null;
  status: LocationPermissionStatus;
  /**
   * Trigger a browser permission prompt + fix. Safe to call any number of
   * times — if we already have a fresh cached fix it resolves immediately.
   * Returns the location (or null when denied/unavailable).
   */
  request: () => Promise<DeviceLocation | null>;
  clear: () => void;
}

export function useUserLocation(): UseUserLocationResult {
  const [location, setLocation] = useState<DeviceLocation | null>(() =>
    readCache(),
  );
  const [status, setStatus] = useState<LocationPermissionStatus>(() =>
    readCache() ? 'granted' : 'idle',
  );

  // Hydrate from cache once on mount (covers SSR-vs-client mismatch on first paint).
  useEffect(() => {
    const cached = readCache();
    if (cached) {
      setLocation(cached);
      setStatus('granted');
    }
  }, []);

  const request = useCallback(async (): Promise<DeviceLocation | null> => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setStatus('unavailable');
      return null;
    }
    const cached = readCache();
    if (cached) {
      setLocation(cached);
      setStatus('granted');
      return cached;
    }
    setStatus('requesting');
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc: DeviceLocation = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracyMeters: pos.coords.accuracy,
            capturedAt: new Date().toISOString(),
          };
          writeCache(loc);
          setLocation(loc);
          setStatus('granted');
          resolve(loc);
        },
        (err) => {
          setStatus(err.code === err.PERMISSION_DENIED ? 'denied' : 'unavailable');
          resolve(null);
        },
        {
          enableHighAccuracy: false,
          // 10s is enough for a coarse fix; we don't need GPS precision.
          timeout: 10000,
          maximumAge: TTL_MS,
        },
      );
    });
  }, []);

  const clear = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
    setLocation(null);
    setStatus('idle');
  }, []);

  return { location, status, request, clear };
}

export default useUserLocation;
