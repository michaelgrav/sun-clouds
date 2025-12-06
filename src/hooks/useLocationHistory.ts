import { useEffect, useMemo, useState } from 'react';
import { SavedLocation } from '../../types/locations';

const STORAGE_KEY = 'sun-clouds:locations';

const loadLocations = (): SavedLocation[] => {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as SavedLocation[];
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter(
      (entry) =>
        typeof entry?.latitude === 'number' &&
        typeof entry?.longitude === 'number' &&
        typeof entry?.label === 'string'
    );
  } catch (error) {
    return [];
  }
};

const persist = (locations: SavedLocation[]) => {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(locations));
  } catch (error) {
    // ignore persistence errors
  }
};

const coordinateKey = (lat: number, lon: number) => `${lat.toFixed(4)},${lon.toFixed(4)}`;

export const useLocationHistory = () => {
  const [locations, setLocations] = useState<SavedLocation[]>([]);

  useEffect(() => {
    setLocations(loadLocations());
  }, []);

  const addRecent = (payload: { label: string; latitude: number; longitude: number }) => {
    const key = coordinateKey(payload.latitude, payload.longitude);
    setLocations((current) => {
      const existing = current.find((item) => coordinateKey(item.latitude, item.longitude) === key);

      const updated: SavedLocation = {
        label: payload.label,
        latitude: payload.latitude,
        longitude: payload.longitude,
        isFavorite: existing?.isFavorite ?? false,
        updatedAt: Date.now(),
      };

      const next = [
        updated,
        ...current.filter((item) => coordinateKey(item.latitude, item.longitude) !== key),
      ];
      persist(next);
      return next;
    });
  };

  const toggleFavorite = (payload: { latitude: number; longitude: number }) => {
    const key = coordinateKey(payload.latitude, payload.longitude);
    setLocations((current) => {
      const next = current.map((item) =>
        coordinateKey(item.latitude, item.longitude) === key
          ? { ...item, isFavorite: !item.isFavorite, updatedAt: Date.now() }
          : item
      );
      persist(next);
      return next;
    });
  };

  const favorites = useMemo(
    () => locations.filter((item) => item.isFavorite).sort((a, b) => b.updatedAt - a.updatedAt),
    [locations]
  );

  const recents = useMemo(
    () => locations.filter((item) => !item.isFavorite).sort((a, b) => b.updatedAt - a.updatedAt),
    [locations]
  );

  return {
    favorites,
    recents,
    addRecent,
    toggleFavorite,
  } as const;
};
