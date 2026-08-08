"use client";

import { useEffect, useRef } from "react";
import Map, { Source, Layer, Marker, LineLayerSpecification } from 'react-map-gl/mapbox';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { HUDPanel } from "./hud-panel";
import BaseMap from "@/components/base-map";
import { HikeSummary } from "@/types/hike-types";
import { useUIStore } from "@/stores/ui-store";
import { useHikeGeometry } from "@/stores/use-hike-geometry";
import { useActiveHike } from "@/stores/use-active-hike";
import { useHikePoints } from "@/stores/use-hike-points";

interface MapInnerProps {
  hikes: HikeSummary[];
}

export default function MapInner({ hikes }: MapInnerProps) {
  const activeHikeId = useUIStore((s) => s.activeHikeId);
  const setActiveHikeId = useUIStore((s) => s.setActiveHikeId);
  const activeHike = useActiveHike(hikes);
  const { geometry, loading } = useHikeGeometry();
  const hikePoints = useHikePoints(geometry);

  const mapRef = useRef<any>(null);
  const hoverMarkerRef = useRef<mapboxgl.Marker | null>(null);

  const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  const handleMapLoad = () => {
    const rawMap = mapRef.current?.getMap();
    if (!rawMap || hoverMarkerRef.current) return;

    const el = document.createElement('div');
    el.className = 'w-4 h-4 bg-trail border-2 border-parchment-light rounded-full shadow-md shadow-ink/20 pointer-events-none';
    el.id = 'elevation-hover-dot';

    const marker = new mapboxgl.Marker({ element: el })
      .setLngLat([0, 0])
      .addTo(rawMap);

    hoverMarkerRef.current = marker;
  };

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

  useEffect(() => {
    if (!activeHike || !mapRef.current) return;

    mapRef.current.fitBounds(activeHike.bbox, {
      padding: {
        top: 50,
        bottom: 50,
        left: 50,
        right: 400
      },
      duration: 1200,
    });
  }, [activeHike]);

  const lineLayerStyle: Omit<LineLayerSpecification, 'source'> = {
    id: 'gpx-track-layer',
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
        <BaseMap
          mapRef={mapRef}
          handleMapLoad={handleMapLoad}
        >
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
                    className={`relative flex items-center justify-center w-6 h-6 rounded-full border-2 shadow-md transition-all duration-150 ${isActive
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
            <Source id="dynamic-gpx" type="geojson" data={geometry}>
              <Layer {...lineLayerStyle} />
            </Source>
          )}

          {/* End Marker */}
          {activeHike && !activeHike.isLoop && hikePoints &&
            <Marker
              key="end-marker"
              latitude={hikePoints[hikePoints.length - 1].lat}
              longitude={hikePoints[hikePoints.length - 1].lon}
            >
              <span className="group relative flex items-center justify-center cursor-default">
                <span className="relative flex items-center justify-center w-4 h-4 rounded-full border-3 shadow-md transition-all duration-150 bg-pine border-parchment-light" />
              </span>
            </Marker>
          }
        </BaseMap>
      </div>

      {/* HUD Panel */}
      {
        activeHike && (
          <div className="absolute top-0 right-0 z-10 h-full p-0 pointer-events-none">
            <HUDPanel
              activeHike={activeHike}
              loading={loading}
              hikePoints={hikePoints}
              onClose={() => setActiveHikeId(null)}
            />
          </div>
        )
      }
    </div >
  );
}