import { ResolvedWaypoint, HikePoint } from '@/types/hike-types';

export interface WaypointSegment {
  distanceM: number;
  gainM: number;
  lossM: number;
}

export interface DaySegment {
  dayNumber: number;
  waypoints: ResolvedWaypoint[];
  distanceM: number;
  gainM: number;
  lossM: number;
}

/**
 * Distance and elevation gain/loss between two consecutive waypoints.
 *
 * Elevation gain/loss is accumulated over every consecutive pair of the
 * underlying track `hikePoints` between the waypoints (rather than just
 * the two waypoints' own elevations), so intermediate ups and downs along
 * the trail aren't lost to a single endpoint-to-endpoint delta.
 */
function computeSegment(from: ResolvedWaypoint, to: ResolvedWaypoint, hikePoints: HikePoint[]): WaypointSegment {
  const distanceM = to.distanceFromStartM - from.distanceFromStartM;

  const fromIndex = Math.min(from.indexFromStart, to.indexFromStart);
  const toIndex = Math.max(from.indexFromStart, to.indexFromStart);

  let gainM = 0;
  let lossM = 0;

  for (let i = Math.max(fromIndex, 0) + 1; i <= Math.min(toIndex, hikePoints.length - 1); i++) {
    const elevationDelta = hikePoints[i].elevation - hikePoints[i - 1].elevation;
    if (elevationDelta > 0) gainM += elevationDelta;
    else lossM += -elevationDelta;
  }

  return { distanceM, gainM, lossM };
}

/**
 * Splits a hike's waypoints into day segments, using `start`, `accommodation`
 * and `end` waypoints as day boundaries. Every other category (`poi`,
 * `logistics`, `hazard`) is just a waypoint within a day.
 *
 * Single-day hikes (no `accommodation` waypoint) yield a single segment
 * spanning `start` to `end`.
 *
 * `hikePoints` is the hike's full track (as returned by `computeHikePoints`)
 * and is used to compute real elevation gain/loss along the trail, rather
 * than just the delta between waypoints' own elevations.
 */
export function computeDaySegments(waypoints: ResolvedWaypoint[], hikePoints: HikePoint[]): DaySegment[] {
  if (waypoints.length === 0) return [];

  const boundaryIndexes = waypoints.reduce<number[]>((acc, waypoint, index) => {
    if (waypoint.category === 'start' || waypoint.category === 'accommodation' || waypoint.category === 'end') {
      acc.push(index);
    }
    return acc;
  }, []);

  if (boundaryIndexes.length < 2) {
    return [buildDaySegment(1, waypoints, hikePoints)];
  }

  const segments: DaySegment[] = [];

  for (let i = 0; i < boundaryIndexes.length - 1; i++) {
    const from = boundaryIndexes[i];
    const to = boundaryIndexes[i + 1];
    segments.push(buildDaySegment(segments.length + 1, waypoints.slice(from, to + 1), hikePoints));
  }

  return segments;
}

function buildDaySegment(dayNumber: number, waypoints: ResolvedWaypoint[], hikePoints: HikePoint[]): DaySegment {
  let distanceM = 0;
  let gainM = 0;
  let lossM = 0;

  for (let i = 0; i < waypoints.length - 1; i++) {
    const segment = computeSegment(waypoints[i], waypoints[i + 1], hikePoints);
    distanceM += segment.distanceM;
    gainM += segment.gainM;
    lossM += segment.lossM;
  }

  return { dayNumber, waypoints, distanceM, gainM, lossM };
}

/** Builds a `waypointId → dayNumber` lookup index from computed day segments. */
export function buildDayNumberIndex(days: DaySegment[]): Map<string, number> {
  const index = new Map<string, number>();
  for (const day of days) {
    for (const waypoint of day.waypoints) {
      index.set(waypoint.id, day.dayNumber);
    }
  }
  return index;
}

/**
 * The `[fromIndex, toIndex]` range (inclusive, into the hike's `hikePoints`
 * track) covered by a day segment, spanning its first to last waypoint.
 */
export function dayIndexRange(day: DaySegment): [number, number] {
  const indexes = day.waypoints.map((w) => w.indexFromStart);
  return [Math.min(...indexes), Math.max(...indexes)];
}
