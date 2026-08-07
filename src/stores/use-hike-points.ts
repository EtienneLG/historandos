import { useMemo } from 'react';
import { computeHikePoints } from '@/lib/geo';
import { HikeDetail, HikePoint } from '@/types/hike-types';

export function useHikePoints(hikeDetail: HikeDetail | null): HikePoint[] {
  return useMemo(
    () => (hikeDetail ? computeHikePoints(hikeDetail.geometry) : []),
    [hikeDetail]
  );
}