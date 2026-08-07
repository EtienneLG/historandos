import { pgTable, pgEnum, uuid, text, integer, boolean, date, jsonb, timestamp } from 'drizzle-orm/pg-core';
import { defineRelations } from 'drizzle-orm';

export const waypointCategoryEnum = pgEnum('waypoint_category', [
  'start',
  'end',
  'accommodation',
  'poi',
  'logistics',
  'hazard',
]);

export const accommodationTypeEnum = pgEnum('accommodation_type', [
  'tent', 
  'refuge', 
  'hotel', 
  'other'
]);

export const poiTypeEnum = pgEnum('poi_type', [
  'peak', 
  'sight', 
  'building', 
  'other'
]);

export const hikes = pgTable('hikes', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description'),
  date: date('date').notNull(),
  isLoop: boolean('is_loop').notNull(),

  // Derived stats
  distanceM: integer('distance_m').notNull(),
  elevationGainM: integer('elevation_gain_m').notNull(),
  elevationLossM: integer('elevation_loss_m').notNull(),

  // Map data
  bbox: jsonb('bbox').notNull(),
  geometry: jsonb('geometry').notNull(),

  // Raw .gpx object path in Supabase Storage
  gpxPath: text('gpx_path').notNull(),

  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const hikeWaypoints = pgTable('hike_waypoints', {
  id: uuid('id').primaryKey().defaultRandom(),
  hikeId: uuid('hike_id')
    .notNull()
    .references(() => hikes.id),
  category: waypointCategoryEnum('category').notNull(),
  name: text('name').notNull(),
  description: text('description'),
  indexFromStart: integer('index_from_start').notNull(),

  // Metadata based on category.
  accommodationType: accommodationTypeEnum('accommodation_type'),
  poiType: poiTypeEnum('poi_type'),
});
  
export const relations = defineRelations({ hikes, hikeWaypoints }, (r) => ({
  hikeWaypoints: {
    hike: r.one.hikes({
      from: r.hikeWaypoints.hikeId,
      to: r.hikes.id
    })
  },
  hikes: {
    waypoints: r.many.hikeWaypoints()
  }
}))

export type Hike = typeof hikes.$inferSelect;
export type NewHike = typeof hikes.$inferInsert;
export type HikeWaypoint = typeof hikeWaypoints.$inferSelect;
export type NewHikeWaypoint = typeof hikeWaypoints.$inferInsert;
