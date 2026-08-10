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
