import { useEffect, useState } from 'react';
import { useUIStore } from './ui-store';
import { HikeGeometrySchema } from '@/types/hike-types';
import type { GeoJSONGeometry } from 'zod-geojson';

export function useHikeGeometry() {
  const activeHikeId = useUIStore((s) => s.activeHikeId);
  const [geometry, setGeometry] = useState<GeoJSONGeometry | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!activeHikeId) {
      setGeometry(null);
      return;
    }
    let cancelled = false;

    async function loadNewHike() {
      setLoading(true);
      setGeometry(null);
      try {
        const response = await fetch(`/api/hikes/${activeHikeId}`);

        if (!response.ok)
          throw new Error('Failed fetching hike geometry');

        const data = await response.json();
        const parsed = HikeGeometrySchema.parse(data);

        if (!cancelled) setGeometry(parsed.geometry);
      } catch (error) {
        console.error('Error updating GPX track:', error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadNewHike();

    return () => { cancelled = true; };
  }, [activeHikeId]);

  return { geometry, loading };
}
