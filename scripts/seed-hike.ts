/**
 * seed-hike.ts — one-off CLI tool to insert a hike directly into Postgres
 * from a local .gpx file, bypassing the (not-yet-built) upload feature.
 *
 * This is a throwaway testing aid, not part of the product. It parses a
 * GPX <trk>/<trkpt> track with a small regex-based extractor (no new
 * dependencies), computes the same derived fields the real upload flow
 * will eventually compute, and inserts one row into the `hikes` table.
 *
 * Usage:
 *   npm run seed:hike -- <path-to-gpx-file> --photo-dir-id <id> [options]
 *
 * Required:
 *   --photo-dir-id <int>       Infomaniak Drive folder ID for this hike's photos
 *
 * Optional (defaults shown):
 *   --people "Alice,Bob"       comma-separated hiker names          (default: none)
 *   --title "My hike"         (default: GPX <metadata><name>, or file name)
 *   --description "..."       (default: empty string)
 *   --date 2026-06-21          ISO date                             (default: first <trkpt><time>, or today)
 *   --is-loop true|false       (default: auto-detected from start/end distance)
 *
 * Example:
 *   npm run seed:hike -- ./trail-aux-monts-d-or.gpx --photo-dir-id 12345 --people "Etienne,Marie"
 */

import { readFileSync } from 'node:fs';
import { basename } from 'node:path';
import distance from '@turf/distance';
import { point } from '@turf/helpers';
import { db } from '../src/db/index';
import { hikes } from '../src/db/schema';

interface TrackPoint {
  lon: number;
  lat: number;
  ele: number;
}

function parseArgs(argv: string[]) {
  const [gpxPath, ...rest] = argv;
  if (!gpxPath) {
    throw new Error('Missing required argument: <path-to-gpx-file>');
  }

  const flags: Record<string, string> = {};
  for (let i = 0; i < rest.length; i++) {
    const arg = rest[i];
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const value = rest[i + 1];
      flags[key] = value;
      i++;
    }
  }

  return { gpxPath, flags };
}

function parseGpx(xml: string) {
  const nameMatch = xml.match(/<metadata>[\s\S]*?<name>([\s\S]*?)<\/name>/);
  const metadataName = nameMatch ? decodeXmlEntities(nameMatch[1].trim()) : null;

  const trkptRegex = /<trkpt\s+lat="([\d.-]+)"\s+lon="([\d.-]+)">([\s\S]*?)<\/trkpt>/g;
  const points: TrackPoint[] = [];
  const times: string[] = [];

  let match: RegExpExecArray | null;
  while ((match = trkptRegex.exec(xml)) !== null) {
    const lat = parseFloat(match[1]);
    const lon = parseFloat(match[2]);
    const body = match[3];

    const eleMatch = body.match(/<ele>([\d.-]+)<\/ele>/);
    const ele = eleMatch ? parseFloat(eleMatch[1]) : 0;

    const timeMatch = body.match(/<time>([^<]+)<\/time>/);
    if (timeMatch) times.push(timeMatch[1]);

    points.push({ lon, lat, ele });
  }

  if (points.length < 2) {
    throw new Error('GPX file has fewer than 2 <trkpt> points; cannot build a track.');
  }

  return { metadataName, points, times };
}

function decodeXmlEntities(str: string): string {
  return str
    .replace(/&amp;#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'");
}

function computeStats(points: TrackPoint[]) {
  let distanceM = 0;
  let elevationGainM = 0;
  let elevationLossM = 0;

  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];

    distanceM += distance(point([prev.lon, prev.lat]), point([curr.lon, curr.lat]), { units: 'meters' });

    const delta = curr.ele - prev.ele;
    if (delta > 0) elevationGainM += delta;
    else elevationLossM += Math.abs(delta);
  }

  const lons = points.map((p) => p.lon);
  const lats = points.map((p) => p.lat);
  const bbox = [Math.min(...lons), Math.min(...lats), Math.max(...lons), Math.max(...lats)];

  const first = points[0];
  const last = points[points.length - 1];
  const startEndDistanceM = distance(point([first.lon, first.lat]), point([last.lon, last.lat]), { units: 'meters' });

  return {
    distanceM: Math.round(distanceM),
    elevationGainM: Math.round(elevationGainM),
    elevationLossM: Math.round(elevationLossM),
    bbox,
    startLat: first.lat,
    startLon: first.lon,
    isLoopGuess: startEndDistanceM < 50,
  };
}

async function main() {
  const { gpxPath, flags } = parseArgs(process.argv.slice(2));

  if (!flags['photo-dir-id']) {
    throw new Error('Missing required flag: --photo-dir-id <int>');
  }
  const photoDirId = parseInt(flags['photo-dir-id'], 10);
  if (Number.isNaN(photoDirId)) {
    throw new Error(`--photo-dir-id must be an integer, got "${flags['photo-dir-id']}"`);
  }

  const xml = readFileSync(gpxPath, 'utf-8');
  const { metadataName, points, times } = parseGpx(xml);
  const stats = computeStats(points);

  const title = flags.title ?? metadataName ?? basename(gpxPath, '.gpx');
  const description = flags.description ?? '';
  const date = flags.date ?? (times[0] ? times[0].slice(0, 10) : new Date().toISOString().slice(0, 10));
  const isLoop = flags['is-loop'] !== undefined ? flags['is-loop'] === 'true' : stats.isLoopGuess;
  const people = flags.people ? flags.people.split(',').map((s) => s.trim()).filter(Boolean) : [];

  const geometry = {
    type: 'LineString' as const,
    coordinates: points.map((p) => [p.lon, p.lat, p.ele]),
  };

  const [inserted] = await db
    .insert(hikes)
    .values({
      title,
      description,
      date,
      isLoop,
      people,
      photoDirId,
      startLat: stats.startLat,
      startLon: stats.startLon,
      distanceM: stats.distanceM,
      elevationGainM: stats.elevationGainM,
      elevationLossM: stats.elevationLossM,
      bbox: stats.bbox,
      geometry,
      gpxPath: `manual-seed/${basename(gpxPath)}`,
    })
    .returning({ id: hikes.id, title: hikes.title });

  console.log(`✅ Inserted hike "${inserted.title}" (id: ${inserted.id})`);
  console.log(`   distance: ${stats.distanceM}m, gain: ${stats.elevationGainM}m, loss: ${stats.elevationLossM}m, loop: ${isLoop}`);

  process.exit(0);
}

main().catch((err) => {
  console.error('❌ Failed to seed hike:', err.message);
  process.exit(1);
});
