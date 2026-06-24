import { lineString, length } from '@turf/turf';
import { TraceMetrics } from '@/types/trace';

export function calculateTraceMetrics(geoJson: any): TraceMetrics {
  let totalDist = 0;
  let gain = 0;
  let loss = 0;

  const coords = geoJson.features[0].geometry.coordinates;

  // 1. Total Distance
  totalDist = length(geoJson, { units: 'kilometers' });

  // 2. Elevation Profile
  const profile = coords.map((coord: [number, number, number], i: number) => {
    let distAtPoint = 0;

    if (i > 0) {
      const subLine = lineString(coords.slice(0, i + 1));
      distAtPoint = i === 0 ? 0 : length(subLine, { units: 'kilometers' });

      if (coords[i][2] > coords[i - 1][2]) {
        gain += coords[i][2] - coords[i - 1][2];
      }

      if (coords[i][2] < coords[i - 1][2]) {
        loss += coords[i - 1][2] - coords[i][2];
      }
    }

    return {
      distance: parseFloat(distAtPoint.toFixed(1)),
      elevation: Math.round(coord[2]), // meters
      lat: coord[1],
      lon: coord[0],
    };
  });

  return {
    distance: Math.round(totalDist * 1000) / 1000,
    elevationGain: Math.round(gain),
    elevationLoss: Math.round(loss),
    profile: profile,
  };
}