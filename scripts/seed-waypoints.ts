/**
 * seed-waypoints.ts — one-off CLI tool to insert (or clean up) a fixed set of
 * demo waypoints for an existing hike, bypassing the (not-yet-built) upload
 * waypoint editor.
 *
 * This is a throwaway testing aid, not part of the product — it inserts the
 * same seven hard-coded waypoints (start, a point of interest, a logistics
 * stop, an overnight refuge, a hazard, a summit, and the end) spread across
 * a hike's track by `indexFromStart`.
 *
 * Usage:
 *   npm run seed:waypoints -- <hike-id>              seed the demo waypoints
 *   npm run seed:waypoints -- <hike-id> clean         delete all waypoints for that hike
 */

import { eq } from 'drizzle-orm';
import { db } from '../src/db/index';
import { hikeWaypoints } from '../src/db/schema';
import type { NewHikeWaypoint } from '../src/db/schema';

const DEMO_WAYPOINTS: Omit<NewHikeWaypoint, 'hikeId'>[] = [
  {
    category: 'start',
    name: 'Parking du col',
    description: 'Départ tôt le matin, brume dans la vallée.',
    indexFromStart: 0,
    accommodationType: null,
    poiType: null,
  },
  {
    category: 'poi',
    name: 'Lac de la Muzelle',
    description: null,
    indexFromStart: 60,
    accommodationType: null,
    poiType: 'sight',
  },
  {
    category: 'logistics',
    name: 'Source',
    description: "Dernier point d'eau avant la montée.",
    indexFromStart: 110,
    accommodationType: null,
    poiType: null,
  },
  {
    category: 'accommodation',
    name: 'Refuge du Pigeonnier',
    description: 'Nuit au refuge, soupe et dortoir.',
    indexFromStart: 150,
    accommodationType: 'refuge',
    poiType: null,
  },
  {
    category: 'hazard',
    name: 'Passage câblé',
    description: 'Section exposée, prudence par temps humide.',
    indexFromStart: 190,
    accommodationType: null,
    poiType: null,
  },
  {
    category: 'poi',
    name: 'Sommet',
    description: null,
    indexFromStart: 210,
    accommodationType: null,
    poiType: 'peak',
  },
  {
    category: 'end',
    name: 'Retour au parking',
    description: null,
    indexFromStart: 231,
    accommodationType: null,
    poiType: null,
  },
];

async function main() {
  const [hikeId, mode] = process.argv.slice(2);

  if (!hikeId) {
    throw new Error('Missing required argument: <hike-id>');
  }

  if (mode === 'clean') {
    await db.delete(hikeWaypoints).where(eq(hikeWaypoints.hikeId, hikeId));
    console.log(`✅ Deleted all waypoints for hike ${hikeId}`);
    return;
  }

  await db.insert(hikeWaypoints).values(DEMO_WAYPOINTS.map((w) => ({ ...w, hikeId })));
  console.log(`✅ Seeded ${DEMO_WAYPOINTS.length} demo waypoints for hike ${hikeId}`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Failed to seed waypoints:', err.message);
    process.exit(1);
  });
