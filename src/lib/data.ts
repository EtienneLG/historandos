import { desc } from 'drizzle-orm';
import { cacheLife, cacheTag } from 'next/cache';
import { db } from '@/db/index';
import { hikes } from '@/db/schema';
import { z } from 'zod';
import { HikeSummary, HikeSummarySchema } from '@/types/hike-types';

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
    bbox: hikes.bbox,
  }).from(hikes).orderBy(desc(hikes.date));

  const result = z.array(HikeSummarySchema).safeParse(hikeList);
  if (!result.success) {
    console.error('Error fetching hikes:', result.error);
    throw new Error('Failed to load hikes: unexpected data shape.');
  }

  return result.data;
}
