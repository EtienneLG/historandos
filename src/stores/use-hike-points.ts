import { useMemo } from 'react';
import { computeHikePoints } from '@/lib/geo';
import { HikePoint } from '@/types/hike-types';
import type { GeoJSONGeometry } from 'zod-geojson';

export function useHikePoints(geometry: GeoJSONGeometry | null): HikePoint[] {
  return useMemo(
    () => (geometry ? computeHikePoints(geometry) : []),
    [geometry]
  );
}