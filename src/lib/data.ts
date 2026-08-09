import { asc, desc, eq } from 'drizzle-orm';
import { cacheLife, cacheTag } from 'next/cache';
import { db } from '@/db/index';
import { hikes, hikeWaypoints } from '@/db/schema';
import { z } from 'zod';
import { HikeGeometry, HikeGeometrySchema, HikeSummary, HikeSummarySchema } from '@/types/hike-types';

export async function getHikes(): Promise<HikeSummary[]> {
  'use cache';
  cacheTag('hikes');
  cacheLife('days');

  const hikeList = await db.select({
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
    bbox: hikes.bbox
  }).from(hikes).orderBy(desc(hikes.date));

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

  const detail = await db.select({
    id: hikes.id,
    geometry: hikes.geometry
  }).from(hikes)
    .where(eq(hikes.id, hikeId));

  if (detail.length === 0) {
    throw new Error(`Hike not found: ${hikeId}`);
  }

  const waypoints = await db.select({
    id: hikeWaypoints.id,
    category: hikeWaypoints.category,
    name: hikeWaypoints.name,
    description: hikeWaypoints.description,
    indexFromStart: hikeWaypoints.indexFromStart,
    accommodationType: hikeWaypoints.accommodationType,
    poiType: hikeWaypoints.poiType,
  }).from(hikeWaypoints)
    .where(eq(hikeWaypoints.hikeId, hikeId))
    .orderBy(asc(hikeWaypoints.indexFromStart));

  const result = HikeGeometrySchema.safeParse({ ...detail[0], waypoints });
  if (!result.success) {
    console.error('Error fetching hikes:', result.error);
    throw new Error('Failed to load hikes: unexpected data shape.');
  }

  return result.data;
}
