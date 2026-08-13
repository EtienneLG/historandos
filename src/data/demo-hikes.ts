import { HikeGeometry, HikeSummary } from '@/types/hike-types';

/**
 * Fake data for the public demo deployment, no real database is queried on
 * this branch (see src/lib/data.ts).
 *
 * `photoDirId` is unused by the demo photo routes (they serve static files
 * from public/demo-photos instead of an Infomaniak folder), so any positive
 * integer works here.
 */

export const demoHikes: HikeSummary[] = [
  {
    id: '00000000-0000-1000-a000-000000000001',
    title: 'Exemple de randonnée',
    description: 'Description de la randonnée.',
    date: '2025-07-12',
    isLoop: true,
    people: ['Personne 1'],
    photoDirId: 1,
    startLat: 45.9237,
    startLon: 6.8694,
    distanceM: 12000,
    elevationGainM: 800,
    elevationLossM: 800,
    bbox: [6.8, 45.9, 6.94, 45.95],
  },
];

const demoGeometries: Record<string, HikeGeometry> = {
  '00000000-0000-1000-a000-000000000001': {
    id: '00000000-0000-1000-a000-000000000001',
    geometry: {
      type: 'LineString',
      coordinates: [
        [6.8694, 45.9237, 1000],
        [6.88, 45.93, 1200],
        [6.9, 45.94, 1400],
      ],
    },
    waypoints: [
      {
        id: '00000000-0000-1000-b000-000000000001',
        category: 'start',
        name: 'Départ',
        description: null,
        indexFromStart: 0,
        accommodationType: null,
        poiType: null,
      },
      {
        id: '00000000-0000-1000-b000-000000000002',
        category: 'end',
        name: 'Arrivée',
        description: null,
        indexFromStart: 2,
        accommodationType: null,
        poiType: null,
      },
    ],
  },
};

export function getDemoHikeGeometry(hikeId: string): HikeGeometry | undefined {
  return demoGeometries[hikeId];
}
