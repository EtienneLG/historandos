import { asc, desc, eq } from 'drizzle-orm';
import { cacheLife, cacheTag, revalidateTag } from 'next/cache';
import { db } from '@/db/index';
import { hikes, hikeWaypoints } from '@/db/schema';
import { z } from 'zod';
import {
  HikeGeometry,
  HikeGeometrySchema,
  HikeSummary,
  HikeSummarySchema,
  NewHikeRequest,
} from '@/types/hike-types';
import { computeHikePoints, computeHikeStats } from '@/lib/geo';

export async function getHikes(): Promise<HikeSummary[]> {
  'use cache';
  cacheTag('hikes');
  cacheLife('days');

  const hikeList = await db
    .select({
      id: hikes.id,
      title: hikes.title,
      description: hikes.description,
      date: hikes.date,
      isLoop: hikes.isLoop,
      people: hikes.people,
      photoDirId: hikes.photoDirId,
      startLat: hikes.startLat,
      startLon: hikes.startLon,
      distanceM: hikes.distanceM,
      elevationGainM: hikes.elevationGainM,
      elevationLossM: hikes.elevationLossM,
      bbox: hikes.bbox,
    })
    .from(hikes)
    .orderBy(desc(hikes.date));

  const result = z.array(HikeSummarySchema).safeParse(hikeList);
  if (!result.success) {
    console.error('Error fetching hikes:', result.error);
    throw new Error('Failed to load hikes: unexpected data shape.');
  }

  return result.data;
}

export async function getHikeGeometry(hikeId: string): Promise<HikeGeometry> {
  'use cache';
  cacheTag('hikes');
  cacheLife('days');

  const [detail, waypoints] = await Promise.all([
    db
      .select({
        id: hikes.id,
        geometry: hikes.geometry,
      })
      .from(hikes)
      .where(eq(hikes.id, hikeId)),
    db
      .select({
        id: hikeWaypoints.id,
        category: hikeWaypoints.category,
        name: hikeWaypoints.name,
        description: hikeWaypoints.description,
        indexFromStart: hikeWaypoints.indexFromStart,
        accommodationType: hikeWaypoints.accommodationType,
        poiType: hikeWaypoints.poiType,
      })
      .from(hikeWaypoints)
      .where(eq(hikeWaypoints.hikeId, hikeId))
      .orderBy(asc(hikeWaypoints.indexFromStart)),
  ]);

  if (detail.length === 0) {
    throw new Error(`Hike not found: ${hikeId}`);
  }

  const result = HikeGeometrySchema.safeParse({ ...detail[0], waypoints });
  if (!result.success) {
    console.error('Error fetching hikes:', result.error);
    throw new Error('Failed to load hikes: unexpected data shape.');
  }

  return result.data;
}

export async function createHike(input: NewHikeRequest): Promise<string> {
  const { title, description, date, people, photoDirId, geometry, waypoints } = input;

  const hikePoints = computeHikePoints(geometry);
  if (hikePoints.length < 2) {
    throw new Error('geometry must resolve to at least 2 points');
  }

  const stats = computeHikeStats(hikePoints);

  const insertedId = await db.transaction(async (tx) => {
    const [inserted] = await tx
      .insert(hikes)
      .values({
        title,
        description,
        date,
        isLoop: stats.isLoop,
        people,
        photoDirId,
        startLat: stats.startLat,
        startLon: stats.startLon,
        distanceM: stats.distanceM,
        elevationGainM: stats.elevationGainM,
        elevationLossM: stats.elevationLossM,
        bbox: stats.bbox,
        geometry,
        gpxPath: null,
      })
      .returning({ id: hikes.id });

    if (waypoints.length > 0) {
      await tx.insert(hikeWaypoints).values(
        waypoints.map((w) => ({
          hikeId: inserted.id,
          category: w.category,
          name: w.name,
          description: w.description,
          indexFromStart: w.indexFromStart,
          accommodationType: w.accommodationType,
          poiType: w.poiType,
        })),
      );
    }

    return inserted.id;
  });

  revalidateTag('hikes', 'days');

  return insertedId;
}
