import { lineString, length } from '@turf/turf';
import { TraceMetrics } from '@/types/trace';
import { XMLParser } from 'fast-xml-parser';

export function calculateTraceMetrics(geoJson: any): TraceMetrics {
  let totalDist = 0;
  let gain = 0;
  let loss = 0;

  const coords = geoJson.features[0].geometry.coordinates;

  // Total Distance
  totalDist = length(geoJson, { units: 'kilometers' });

  // Elevation Profile
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

export function gpxToGeoJson(gpxXmlText: string) {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '',
    parseAttributeValue: true,
    parseTagValue: true,
    isArray: (tagName) => ['trkseg', 'trkpt'].includes(tagName),
  });
  
  const raw = parser.parse(gpxXmlText);
  const track = raw?.gpx?.trk;
  
  const segments = track?.trkseg || [];

  const coordinates = segments.flatMap((seg: any) =>
    seg.trkpt.map((pt: any) => [
      Number(pt.lon), 
      Number(pt.lat), 
      Number(pt.ele || 0)
    ])
  );

  return {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {
          name: track?.name || 'Sans nom',
          creator: raw?.gpx?.creator || 'Inconnu'
        },
        geometry: {
          type: 'LineString',
          coordinates,
        },
      },
    ],
  };
}