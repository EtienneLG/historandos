import distance from '@turf/distance';
import { point } from '@turf/helpers';
import { gpx } from '@tmcw/togeojson';
import { GeoJSONGeometry } from "zod-geojson"
import { HikePoint } from "@/types/hike-types"

/** Parses raw GPX XML text into a single `LineString` geometry (all tracks/segments merged in order). */
export function gpxToGeoJson(gpxXmlText: string): GeoJSONGeometry | null {
  const dom = new DOMParser().parseFromString(gpxXmlText, 'text/xml');
  const featureCollection = gpx(dom);

  const coordinates = featureCollection.features
    .filter((feature) => feature.geometry.type === 'LineString')
    .flatMap((feature) => (feature.geometry as GeoJSON.LineString).coordinates);

  if (coordinates.length === 0) return null;

  return {
    type: 'LineString',
    coordinates: coordinates.map(([lon, lat, elevation = 0]) => [lon, lat, elevation]),
  };
}

/** Convert a GeoJSON geometry to an array of HikePoint */
export function computeHikePoints(geometry: GeoJSONGeometry): HikePoint[] {
  if (geometry.type !== 'LineString') return [];

  const coordinates = geometry.coordinates;
  let distanceFromStartM = 0;

  return coordinates.map((coord, i) => {
    const [lon, lat, elevation = 0] = coord;

    if (i > 0) {
      const [prevLon, prevLat] = coordinates[i - 1];
      distanceFromStartM += distance(point([prevLon, prevLat]), point([lon, lat]), { units: 'meters' });
    }

    return { lon, lat, elevation, distanceFromStartM };
  });
}

/**
 * Downsamples a `HikePoint[]` for chart display using the Largest-Triangle-Three-Buckets
 * (LTTB) algorithm. Unlike naive fixed-stride decimation, LTTB preserves visually
 * significant points (summits, sharp drops) instead of averaging them away.
 * The first and last points are always kept so the chart's start/end (distance, elevation)
 * stay exact. No-op if `points` already has `maxPoints` or fewer entries.
 */
export function downsampleForChart(points: HikePoint[], maxPoints: number): HikePoint[] {
  const n = points.length;
  if (maxPoints >= n || maxPoints <= 2) return points;

  const sampled: HikePoint[] = [points[0]];
  // Buckets exclude the first and last points, which are always kept as-is.
  const bucketSize = (n - 2) / (maxPoints - 2);
  let previousSelectedIndex = 0;

  for (let i = 0; i < maxPoints - 2; i++) {
    // Average point of the next bucket, used as one vertex of the triangle.
    const nextBucketStart = Math.floor((i + 1) * bucketSize) + 1;
    const nextBucketEnd = Math.min(Math.floor((i + 2) * bucketSize) + 1, n);

    let avgDistance = 0;
    let avgElevation = 0;
    const nextBucketLength = nextBucketEnd - nextBucketStart;
    for (let j = nextBucketStart; j < nextBucketEnd; j++) {
      avgDistance += points[j].distanceFromStartM;
      avgElevation += points[j].elevation;
    }
    avgDistance /= nextBucketLength;
    avgElevation /= nextBucketLength;

    // Current bucket range to pick the point maximizing the triangle area from.
    const currentBucketStart = Math.floor(i * bucketSize) + 1;
    const currentBucketEnd = Math.floor((i + 1) * bucketSize) + 1;

    const prevPoint = points[previousSelectedIndex];
    let maxArea = -1;
    let maxAreaIndex = currentBucketStart;

    for (let j = currentBucketStart; j < currentBucketEnd; j++) {
      const area = Math.abs(
        (prevPoint.distanceFromStartM - avgDistance) * (points[j].elevation - prevPoint.elevation) -
        (prevPoint.distanceFromStartM - points[j].distanceFromStartM) * (avgElevation - prevPoint.elevation)
      );
      if (area > maxArea) {
        maxArea = area;
        maxAreaIndex = j;
      }
    }

    sampled.push(points[maxAreaIndex]);
    previousSelectedIndex = maxAreaIndex;
  }

  sampled.push(points[n - 1]);
  return sampled;
}

/** Format a number to the french format */
export function formatDistance(dist: Number): string {
  return dist.toLocaleString('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  })
}

/** Extracts the (inclusive) `[fromIndex, toIndex]` slice of an ordered `HikePoint[]` track. */
export function sliceHikePoints(hikePoints: HikePoint[], fromIndex: number, toIndex: number): HikePoint[] {
  const from = Math.max(0, Math.min(fromIndex, toIndex));
  const to = Math.min(hikePoints.length - 1, Math.max(fromIndex, toIndex));

  return hikePoints.slice(from, to + 1);
}

/** Builds a GeoJSON `LineString` feature from an ordered list of `HikePoint`s. */
export function hikePointsToLineString(points: HikePoint[]): GeoJSONGeometry {
  return {
    type: 'LineString',
    coordinates: points.map((p) => [p.lon, p.lat, p.elevation]),
  };
}

/** Computes the `[minLon, minLat, maxLon, maxLat]` bounding box of a list of `HikePoint`s. */
export function computeHikePointsBbox(points: HikePoint[]): [number, number, number, number] | null {
  if (points.length === 0) return null;

  let minLon = Infinity, minLat = Infinity, maxLon = -Infinity, maxLat = -Infinity;

  for (const p of points) {
    if (p.lon < minLon) minLon = p.lon;
    if (p.lon > maxLon) maxLon = p.lon;
    if (p.lat < minLat) minLat = p.lat;
    if (p.lat > maxLat) maxLat = p.lat;
  }

  return [minLon, minLat, maxLon, maxLat];
}

export interface HikeStats {
  distanceM: number;
  elevationGainM: number;
  elevationLossM: number;
  bbox: [number, number, number, number];
  startLat: number;
  startLon: number;
  isLoop: boolean;
}

/** Below this start/end distance (in meters), a track is considered a loop. */
const LOOP_DISTANCE_THRESHOLD_M = 50;

/** Computes the hike's derived stats */
export function computeHikeStats(hikePoints: HikePoint[]): HikeStats {
  if (hikePoints.length < 2) {
    throw new Error('computeHikeStats requires at least 2 points');
  }

  let elevationGainM = 0;
  let elevationLossM = 0;

  for (let i = 1; i < hikePoints.length; i++) {
    const delta = hikePoints[i].elevation - hikePoints[i - 1].elevation;
    if (delta > 0) elevationGainM += delta;
    else elevationLossM += -delta;
  }

  const bbox = computeHikePointsBbox(hikePoints)!;

  const first = hikePoints[0];
  const last = hikePoints[hikePoints.length - 1];
  const startEndDistanceM = distance(point([first.lon, first.lat]), point([last.lon, last.lat]), { units: 'meters' });

  return {
    distanceM: Math.round(last.distanceFromStartM),
    elevationGainM: Math.round(elevationGainM),
    elevationLossM: Math.round(elevationLossM),
    bbox,
    startLat: first.lat,
    startLon: first.lon,
    isLoop: startEndDistanceM < LOOP_DISTANCE_THRESHOLD_M,
  };
}
