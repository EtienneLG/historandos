"use client";

import { useEffect, useRef } from "react";
import BaseMap from "@/components/base-map";
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl, { LineLayerSpecification } from "mapbox-gl";
import { Layer, Source, Marker } from "react-map-gl/mapbox";
import { useUploadStore } from "@/stores/upload-store";
import { computeHikePointsBbox } from "@/lib/geo";
import { useResolvedWaypoints } from "@/stores/use-resolved-waypoints";
import { getWaypointVisual } from "@/lib/waypoints";
import { WaypointIcon } from "@/components/waypoint-icon";

interface UploadMapProps {
  handleMapLoad: () => void;
}

export default function UploadMap({ handleMapLoad }: UploadMapProps) {
  const geometry = useUploadStore((s) => s.geometry);
  const hikePoints = useUploadStore((s) => s.hikePoints);
  const waypoints = useUploadStore((s) => s.waypoints);
  const resolvedWaypoints = useResolvedWaypoints(waypoints, hikePoints);

  const mapRef = useRef<any>(null);
  const hoverMarkerRef = useRef<mapboxgl.Marker | null>(null);

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

  const onLoadComplete = () => {
    handleMapLoad();

    const rawMap = mapRef.current?.getMap();
    if (!rawMap || hoverMarkerRef.current) return;

    const el = document.createElement('div');
    el.className = 'w-4 h-4 bg-trail border-2 border-parchment-light rounded-full shadow-md shadow-ink/20 pointer-events-none hidden';
    el.id = 'elevation-hover-dot';

    const marker = new mapboxgl.Marker({ element: el })
      .setLngLat([0, 0])
      .addTo(rawMap);

    hoverMarkerRef.current = marker;

    const bbox = computeHikePointsBbox(hikePoints);
    if (!bbox) return;

    mapRef.current.fitBounds(bbox, {
      padding: {
        top: 50,
        bottom: 220,
        left: 50,
        right: 440
      },
      duration: 1200
    });
  }

  useEffect(() => {
    const handleHoverBridge = (e: Event) => {
      const index = (e as CustomEvent).detail;
      const marker = hoverMarkerRef.current;

      if (!marker || !hikePoints) return;

      if (index === null) {
        document.getElementById('elevation-hover-dot')?.classList.add('hidden');
        return;
      }

      const activePoint = hikePoints[index];
      if (!activePoint) return;

      marker.setLngLat([activePoint.lon, activePoint.lat]);
      document.getElementById('elevation-hover-dot')?.classList.remove('hidden');
    };

    window.addEventListener('trace-point-hover', handleHoverBridge);

    return () => {
      window.removeEventListener('trace-point-hover', handleHoverBridge);
    };
  }, [hikePoints]);

  return (
    <BaseMap
      mapRef={mapRef}
      handleMapLoad={onLoadComplete}
    >
      {geometry && (
        <Source id="active-day-gpx" type="geojson" data={geometry}>
          <Layer {...dayHighlightLayerStyle} />
        </Source>
      )}

      {/* Waypoint Markers */}
      {resolvedWaypoints.map((waypoint) => {
        const visual = getWaypointVisual(waypoint);

        return (
          <Marker
            key={waypoint.id}
            latitude={waypoint.lat}
            longitude={waypoint.lon}
          >
            <button
              className="group relative flex items-center justify-center cursor-pointer"
              aria-label={waypoint.name}
              title={waypoint.name}
            >
              <span
                className={`flex items-center justify-center w-6 h-6 rounded-full border-2 shadow-md transition-all duration-150 group-hover:scale-110 ${visual.nodeClass}`}
              >
                <WaypointIcon icon={visual.icon} className="w-3 h-3" />
              </span>
            </button>
          </Marker>
        );
      })}
    </BaseMap>
  );
}