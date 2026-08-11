import { useEffect, useState } from 'react';
import { useUIStore } from './ui-store';
import { HikeGeometrySchema, Waypoint } from '@/types/hike-types';
import type { GeoJSONGeometry } from 'zod-geojson';

export function useHikeGeometry() {
  const activeHikeId = useUIStore((s) => s.activeHikeId);
  const [geometry, setGeometry] = useState<GeoJSONGeometry | null>(null);
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!activeHikeId) {
      setGeometry(null);
      setWaypoints([]);
      return;
    }
    let cancelled = false;

    async function loadNewHike() {
      setLoading(true);
      setGeometry(null);
      setWaypoints([]);
      try {
        const response = await fetch(`/api/hikes/${activeHikeId}`);

        if (!response.ok) throw new Error('Failed fetching hike geometry');

        const data = await response.json();
        const parsed = HikeGeometrySchema.parse(data);

        if (!cancelled) {
          setGeometry(parsed.geometry);
          setWaypoints(parsed.waypoints);
        }
      } catch (error) {
        console.error('Error updating GPX track:', error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadNewHike();

    return () => {
      cancelled = true;
    };
  }, [activeHikeId]);

  return { geometry, waypoints, loading };
}
