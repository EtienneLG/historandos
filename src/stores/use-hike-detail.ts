import { useEffect, useState } from 'react';
import { useUIStore } from './ui-store';
import { HikeDetail, HikeDetailSchema } from '@/types/hike-types';

export function useHikeDetail() {
  const activeHikeId = useUIStore((s) => s.activeHikeId);
  const [hikeDetail, setHikeDetail] = useState<HikeDetail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!activeHikeId) {
      setHikeDetail(null);
      return;
    }
    let cancelled = false;

    async function loadNewHike() {
      setLoading(true);
      setHikeDetail(null);
      try {
        const response = await fetch(`/api/hikes/${activeHikeId}`);

        if (!response.ok)
          throw new Error('Failed fetching hike details');

        const data = await response.json();
        const detail = HikeDetailSchema.parse(data);
        
        if (!cancelled) setHikeDetail(detail);
      } catch (error) {
        console.error('Error updating GPX track:', error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadNewHike();

    return () => { cancelled = true; };
  }, [activeHikeId]);

  return { hikeDetail, loading };
}