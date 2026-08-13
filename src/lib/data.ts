import { cacheLife, cacheTag } from 'next/cache';
import { z } from 'zod';
import {
  HikeGeometry,
  HikeGeometrySchema,
  HikeSummary,
  HikeSummarySchema,
  NewHikeRequest,
} from '@/types/hike-types';
import { computeHikePoints, computeHikeStats } from '@/lib/geo';
import { demoHikes, getDemoHikeGeometry } from '@/data/demo-hikes';

/**
 * DEMO branch: reads come from the static fixture in src/data/demo-hikes.ts
 * instead of Postgres/Drizzle.
 */

export async function getHikes(): Promise<HikeSummary[]> {
  'use cache';
  cacheTag('hikes');
  cacheLife('days');

  const result = z.array(HikeSummarySchema).safeParse(demoHikes);
  if (!result.success) {
    console.error('Error loading demo hikes:', result.error);
    throw new Error('Failed to load hikes: unexpected data shape.');
  }

  return result.data;
}

export async function getHikeGeometry(hikeId: string): Promise<HikeGeometry> {
  'use cache';
  cacheTag('hikes');
  cacheLife('days');

  const demoGeometry = getDemoHikeGeometry(hikeId);
  if (!demoGeometry) {
    throw new Error(`Hike not found: ${hikeId}`);
  }

  const result = HikeGeometrySchema.safeParse(demoGeometry);
  if (!result.success) {
    console.error('Error loading demo hike geometry:', result.error);
    throw new Error('Failed to load hikes: unexpected data shape.');
  }

  return result.data;
}

/**
 * DEMO branch: no database write ever happens. The client-computed geometry
 * is still validated/recomputed the same way as production (so the upload
 * wizard's parsing/stats logic is exercised end-to-end), but the "insert" is
 * fake.
 */
export async function createHike(input: NewHikeRequest): Promise<string> {
  const { geometry } = input;

  const hikePoints = computeHikePoints(geometry);
  if (hikePoints.length < 2) {
    throw new Error('geometry must resolve to at least 2 points');
  }

  computeHikeStats(hikePoints);

  return crypto.randomUUID();
}
