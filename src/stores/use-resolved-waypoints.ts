import { useMemo } from 'react';
import { HikePoint, ResolvedWaypoint, Waypoint } from '@/types/hike-types';

/**
 * Resolves each waypoint's `indexFromStart` against the simplified track points
 * to obtain its coordinates, altitude and distance from the start.
 * Waypoints pointing outside the stored geometry are clamped to the last point.
 */
export function useResolvedWaypoints(
  waypoints: Waypoint[],
  hikePoints: HikePoint[]
): ResolvedWaypoint[] {
  return useMemo(() => {
    if (hikePoints.length === 0) return [];

    return waypoints
      .map((waypoint) => {
        const index = Math.min(Math.max(waypoint.indexFromStart, 0), hikePoints.length - 1);
        const point = hikePoints[index];

        return {
          ...waypoint,
          lon: point.lon,
          lat: point.lat,
          elevation: point.elevation,
          distanceFromStartM: point.distanceFromStartM,
        };
      })
      .sort((a, b) => a.indexFromStart - b.indexFromStart);
  }, [waypoints, hikePoints]);
}
