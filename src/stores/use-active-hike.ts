import { useMemo } from 'react';
import { HikeSummary } from '@/types/hike-types';
import { useUIStore } from './ui-store';

export function useActiveHike(hikes: HikeSummary[]): HikeSummary | null {
  const activeHikeId = useUIStore((s) => s.activeHikeId);

  return useMemo(() => hikes.find((h) => h.id === activeHikeId) ?? null, [hikes, activeHikeId]);
}
