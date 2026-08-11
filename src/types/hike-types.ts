import { z } from 'zod';
import { GeoJSONGeometrySchema, GeoJSONBBoxSchema } from 'zod-geojson';

export const WaypointCategorySchema = z.enum([
  'start', // Departure point
  'end', // Arrival point
  'accommodation', // Refuge, Tent/Bivouac, Hotel, Gîte
  'poi', // Viewpoint, Peak, Lake, Heritage
  'logistics', // Water point, Resupply, Parking, Bus stop
  'hazard', // Technical pass, exposed section
]);

export const AccommodationTypeSchema = z.enum(['tent', 'refuge', 'hotel', 'other']);

export const PoiTypeSchema = z.enum(['peak', 'sight', 'building', 'other']);

export const WaypointSchema = z.object({
  id: z.uuid(),
  category: WaypointCategorySchema,
  name: z.string(),
  description: z.string().nullable(),
  indexFromStart: z.int().nonnegative(),

  // Metadata based on category
  accommodationType: AccommodationTypeSchema.nullable(),
  poiType: PoiTypeSchema.nullable(),
});

export const HikeSummarySchema = z.object({
  id: z.uuid(),
  title: z.string(),
  description: z.string(),
  date: z.iso.date(),
  isLoop: z.boolean(),
  people: z.array(z.string()),
  photoDirId: z.int().positive(),
  startLat: z.number(),
  startLon: z.number(),

  // Global stats
  distanceM: z.number(),
  elevationGainM: z.number(),
  elevationLossM: z.number(),

  // Map data
  bbox: GeoJSONBBoxSchema,
});

export const HikeGeometrySchema = z.object({
  id: z.uuid(),
  geometry: GeoJSONGeometrySchema,

  // Waypoints in sequence
  waypoints: z.array(WaypointSchema),
});

/** Waypoint payload as sent by the upload client — no DB id yet, the server assigns one. */
export const NewWaypointSchema = WaypointSchema.omit({ id: true });

/** Body of `POST /api/hikes` */
export const NewHikeRequestSchema = z.object({
  title: z.string().min(1),
  description: z.string(),
  date: z.iso.date(),
  people: z.array(z.string()),
  photoDirId: z.int().positive(),
  geometry: GeoJSONGeometrySchema.refine(
    (g) => g.type === 'LineString' && g.coordinates.length >= 2,
    { message: 'geometry must be a LineString with at least 2 points' },
  ),
  waypoints: z.array(NewWaypointSchema),
});

export interface HikePoint {
  lon: number;
  lat: number;
  elevation: number;
  distanceFromStartM: number;
}

export type HikeSummary = z.infer<typeof HikeSummarySchema>;
export type HikeGeometry = z.infer<typeof HikeGeometrySchema>;
export type NewHikeRequest = z.infer<typeof NewHikeRequestSchema>;
export type NewWaypointInput = z.infer<typeof NewWaypointSchema>;
export type Waypoint = z.infer<typeof WaypointSchema>;
export type WaypointCategory = z.infer<typeof WaypointCategorySchema>;
export type AccommodationType = z.infer<typeof AccommodationTypeSchema>;
export type PoiType = z.infer<typeof PoiTypeSchema>;

export interface ResolvedWaypoint extends Waypoint {
  lon: number;
  lat: number;
  elevation: number;
  indexFromStart: number;
  distanceFromStartM: number;
}
