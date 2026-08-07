import distance from '@turf/distance';
import { point } from '@turf/helpers';
import { GeoJSONGeometry } from "zod-geojson"
import { HikePoint } from "@/types/hike-types"

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

export function formatDistance(dist: Number): string {
  return dist.toLocaleString('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  })
}
