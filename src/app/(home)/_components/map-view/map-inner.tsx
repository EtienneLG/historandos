'use client';

import { useEffect, useMemo, useRef } from 'react';
import { Source, Layer, Marker, LineLayerSpecification } from 'react-map-gl/mapbox';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { HUDPanel } from './hud-panel';
import { ElevationDock } from './dock/elevation-dock';
import BaseMap from '@/components/base-map';
import { HikeSummary } from '@/types/hike-types';
import {
  DOCK_COLLAPSED_HEIGHT_PX,
  DOCK_HEIGHT_PX,
  PANEL_WIDTH_PX,
  getWaypointVisual,
} from '@/lib/waypoints';
import { WaypointIcon } from '@/components/waypoint-icon';
import { useUIStore } from '@/stores/ui-store';
import { useHikeGeometry } from '@/stores/use-hike-geometry';
import { useActiveHike } from '@/stores/use-active-hike';
import { useHikePoints } from '@/stores/use-hike-points';
import { useResolvedWaypoints } from '@/stores/use-resolved-waypoints';
import { computeDaySegments, buildDayNumberIndex, dayIndexRange } from '@/lib/day-segments';
import { computeHikePointsBbox, hikePointsToLineString, sliceHikePoints } from '@/lib/geo';

interface MapInnerProps {
  hikes: HikeSummary[];
}

export default function MapInner({ hikes }: MapInnerProps) {
  const activeHikeId = useUIStore((s) => s.activeHikeId);
  const setActiveHikeId = useUIStore((s) => s.setActiveHikeId);
  const activeWaypointId = useUIStore((s) => s.activeWaypointId);
  const selectWaypoint = useUIStore((s) => s.selectWaypoint);
  const activeDayNumber = useUIStore((s) => s.activeDayNumber);
  const dockCollapsed = useUIStore((s) => s.dockCollapsed);
  const activeHike = useActiveHike(hikes);
  const { geometry, waypoints, loading } = useHikeGeometry();
  const hikePoints = useHikePoints(geometry);
  const resolvedWaypoints = useResolvedWaypoints(waypoints, hikePoints);

  const days = useMemo(
    () => computeDaySegments(resolvedWaypoints, hikePoints),
    [resolvedWaypoints, hikePoints],
  );
  const dayNumberByWaypointId = useMemo(() => buildDayNumberIndex(days), [days]);
  const activeDay = useMemo(
    () => days.find((d) => d.dayNumber === activeDayNumber) ?? null,
    [days, activeDayNumber],
  );
  const activeDayPoints = useMemo(() => {
    if (!activeDay || hikePoints.length === 0) return null;
    const [fromIndex, toIndex] = dayIndexRange(activeDay);
    return sliceHikePoints(hikePoints, fromIndex, toIndex);
  }, [activeDay, hikePoints]);
  const activeDayGeometry = useMemo(
    () => (activeDayPoints ? hikePointsToLineString(activeDayPoints) : geometry),
    [activeDayPoints, geometry],
  );

  const mapRef = useRef<any>(null);
  const hoverMarkerRef = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    console.log(activeDay, activeDayPoints, activeDayGeometry);
  }, [activeDayGeometry])

  const handleMapLoad = () => {
    const rawMap = mapRef.current?.getMap();
    if (!rawMap || hoverMarkerRef.current) return;

    const el = document.createElement('div');
    el.className =
      'w-4 h-4 bg-trail border-2 border-parchment-light rounded-full shadow-md shadow-ink/20 pointer-events-none';
    el.id = 'elevation-hover-dot';

    const marker = new mapboxgl.Marker({ element: el }).setLngLat([0, 0]).addTo(rawMap);

    hoverMarkerRef.current = marker;
  };

  useEffect(() => {
    const handleHoverBridge = (e: Event) => {
      const point = (e as CustomEvent).detail as { lon: number; lat: number } | null;
      const marker = hoverMarkerRef.current;

      if (!marker) return;

      if (point === null) {
        document.getElementById('elevation-hover-dot')?.classList.add('hidden');
        return;
      }

      marker.setLngLat([point.lon, point.lat]);
      document.getElementById('elevation-hover-dot')?.classList.remove('hidden');
    };

    window.addEventListener('trace-point-hover', handleHoverBridge);

    return () => {
      window.removeEventListener('trace-point-hover', handleHoverBridge);
    };
  }, []);

  useEffect(() => {
    if (!activeHike || !mapRef.current) return;

    mapRef.current.fitBounds(activeHike.bbox, {
      padding: {
        top: 50,
        bottom: (dockCollapsed ? DOCK_COLLAPSED_HEIGHT_PX : DOCK_HEIGHT_PX) + 30,
        left: 50,
        right: PANEL_WIDTH_PX + 40,
      },
      duration: 1200,
    });
  }, [activeHike]);

  useEffect(() => {
    if (!mapRef.current) return;

    const padding = {
      top: 50,
      bottom: (dockCollapsed ? DOCK_COLLAPSED_HEIGHT_PX : DOCK_HEIGHT_PX) + 30,
      left: 50,
      right: PANEL_WIDTH_PX + 40,
    };

    if (activeDay && activeDayPoints) {
      const bbox = computeHikePointsBbox(activeDayPoints);
      if (!bbox) return;

      mapRef.current.fitBounds(bbox, { padding, duration: 1200 });
      return;
    }

    // Day deselected: restore the full-hike view.
    if (!activeDayNumber && activeHike) {
      mapRef.current.fitBounds(activeHike.bbox, { padding, duration: 1200 });
    }
  }, [activeDayNumber, activeDay, activeDayPoints]);

  useEffect(() => {
    if (!activeWaypointId || !mapRef.current) return;

    const waypoint = resolvedWaypoints.find((w) => w.id === activeWaypointId);
    if (!waypoint) return;

    mapRef.current.flyTo({
      center: [waypoint.lon, waypoint.lat],
      zoom: 14,
      duration: 1000,
    });
  }, [activeWaypointId, resolvedWaypoints]);

  const dottedBaseLayerStyle: Omit<LineLayerSpecification, 'source'> = {
    id: 'gpx-track-base-layer',
    type: 'line',
    paint: {
      'line-color': '#467dca',
      'line-width': 4,
      'line-opacity': 0.7,
      'line-dasharray': [0.7, 1.6],
    },
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
    },
  };

  const dayHighlightLayerStyle: Omit<LineLayerSpecification, 'source'> = {
    id: 'gpx-track-day-layer',
    type: 'line',
    paint: {
      'line-color': '#2563eb',
      'line-width': 5,
      'line-opacity': 0.85,
    },
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
    },
  };

  return (
    <div className="w-full h-full flex relative overflow-hidden bg-pine-dark">
      {/* Map Element Box */}
      <div className="flex-1 h-full w-full z-0">
        <BaseMap mapRef={mapRef} handleMapLoad={handleMapLoad}>
          {/* Trace Markers */}
          {hikes.map((hike) => {
            const isActive = activeHikeId === hike.id;
            return (
              <Marker
                key={hike.id}
                latitude={hike.startLat}
                longitude={hike.startLon}
                onClick={() => setActiveHikeId(hike.id)}
              >
                <button
                  className="group relative flex items-center justify-center cursor-pointer"
                  aria-label={hike.title}
                >
                  <span
                    className={`relative flex items-center justify-center w-6 h-6 rounded-full border-2 shadow-md transition-all duration-150 ${
                      isActive
                        ? 'bg-trail border-parchment-light scale-125 z-10'
                        : 'bg-pine border-parchment-light group-hover:bg-pine-dark group-hover:scale-110'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-parchment-light" />
                  </span>
                </button>
              </Marker>
            );
          })}

          {/* Dynamic Track Layer */}
          {geometry && (
            <Source id="dotted-gpx" type="geojson" data={geometry}>
              <Layer {...dottedBaseLayerStyle} />
            </Source>
          )}

          {/* Active Day Highlight Layer */}
          {geometry && (
            <Source id="active-day-gpx" type="geojson" data={activeDayGeometry ?? geometry}>
              <Layer {...dayHighlightLayerStyle} />
            </Source>
          )}

          {/* Waypoint Markers */}
          {resolvedWaypoints.map((waypoint) => {
            const visual = getWaypointVisual(waypoint);
            const isActive = activeWaypointId === waypoint.id;

            return (
              <Marker
                key={waypoint.id}
                latitude={waypoint.lat}
                longitude={waypoint.lon}
                onClick={() =>
                  selectWaypoint(waypoint.id, dayNumberByWaypointId.get(waypoint.id) ?? null)
                }
              >
                <button
                  className="group relative flex items-center justify-center cursor-pointer"
                  aria-label={waypoint.name}
                  title={waypoint.name}
                >
                  <span
                    className={`flex items-center justify-center w-6 h-6 rounded-full border-2 shadow-md transition-all duration-150 ${visual.nodeClass} ${
                      isActive ? 'scale-125 z-10 ring-2 ring-blaze/50' : 'group-hover:scale-110'
                    }`}
                  >
                    <WaypointIcon icon={visual.icon} className="w-3 h-3" />
                  </span>
                </button>
              </Marker>
            );
          })}

          {/* End Marker */}
          {activeHike && !activeHike.isLoop && hikePoints && (
            <Marker
              key="end-marker"
              latitude={hikePoints[hikePoints.length - 1].lat}
              longitude={hikePoints[hikePoints.length - 1].lon}
            >
              <span className="group relative flex items-center justify-center cursor-default">
                <span className="relative flex items-center justify-center w-4 h-4 rounded-full border-3 shadow-md transition-all duration-150 bg-pine border-parchment-light" />
              </span>
            </Marker>
          )}
        </BaseMap>
      </div>

      {/* Bottom Dock: elevation profile + waypoint pins */}
      {activeHike && (
        <ElevationDock
          hikePoints={hikePoints}
          waypoints={resolvedWaypoints}
          days={days}
          loading={loading}
        />
      )}

      {/* HUD Panel */}
      {activeHike && (
        <div className="absolute top-0 right-0 z-20 h-full p-0 pointer-events-none">
          <HUDPanel
            activeHike={activeHike}
            loading={loading}
            waypoints={resolvedWaypoints}
            hikePoints={hikePoints}
            onClose={() => setActiveHikeId(null)}
          />
        </div>
      )}
    </div>
  );
}
