import { z } from 'zod';
import { GeoJSONSchema } from 'zod-geojson';

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

export const HikeSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  description: z.string(),
  date: z.iso.date(),
  isLoop: z.boolean(),

  // Global stats
  totalDistance: z.number(),    // meters
  totalGain: z.number(),        // meters
  totalLoss: z.number(),        // meters
  geoJson: GeoJSONSchema,
  
  // Waypoints in sequence
  waypoints: z.array(WaypointSchema)
})

export type Hike = z.infer<typeof HikeSchema>;
