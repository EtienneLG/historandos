import { z } from 'zod';
import { GeoJSONGeometrySchema } from 'zod-geojson';

export const WaypointCategorySchema = z.enum([
  'start',          // Departure point
  'end',            // Arrival point
  'accommodation',  // Refuge, Tent/Bivouac, Hotel, Gîte
  'poi',            // Viewpoint, Peak, Lake, Heritage
  'logistics',      // Water point, Resupply, Parking, Bus stop
  'hazard'          // Technical pass, exposed section
])

export const AccommodationTypeSchema = z.enum(['tent', 'refuge', 'hotel', 'other']);

export const PoiTypeSchema = z.enum(['peak', 'sight', 'building', 'other']);

export const WaypointSchema = z.object({
  id: z.uuid(),
  category: WaypointCategorySchema,
  name: z.string(),
  description: z.string().nullable(),
  indexFromStart: z.int().positive(),

  // Metadata based on category
  accommodationType: AccommodationTypeSchema.nullable(),
  poiType: PoiTypeSchema.nullable()
})

// Map viewport bounds, matches the `bbox` jsonb column on the `hikes` table.
export const BBoxSchema = z.object({
  minLng: z.number(),
  minLat: z.number(),
  maxLng: z.number(),
  maxLat: z.number(),
})

// Lightweight shape for the list & map views — no geometry/waypoints, so it
// maps directly to a lean column-subset query on the `hikes` table.
export const HikeSummarySchema = z.object({
  id: z.uuid(),
  title: z.string(),
  description: z.string(),
  date: z.iso.date(),
  isLoop: z.boolean(),

  // Global stats
  distanceM: z.number(),
  elevationGainM: z.number(),
  elevationLossM: z.number(),

  // Map data
  bbox: BBoxSchema,
})

// Full shape for the single-hike detail view, fetched only once a hike is
// selected — assembled by joining `hikes` + `hike_waypoints`.
export const HikeDetailSchema = HikeSummarySchema.extend({
  geometry: GeoJSONGeometrySchema,
  
  // Waypoints in sequence
  waypoints: z.array(WaypointSchema)
})

export type HikeSummary = z.infer<typeof HikeSummarySchema>;
export type HikeDetail = z.infer<typeof HikeDetailSchema>;
