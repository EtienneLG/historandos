"use client";

import { useEffect, useRef } from "react";
import Map, { Source, Layer, Marker, LineLayerSpecification } from 'react-map-gl/mapbox';
import mapboxgl from 'mapbox-gl';
import bbox from '@turf/bbox';
import { Trace, TraceMetrics } from '@/types/trace';
import 'mapbox-gl/dist/mapbox-gl.css';
import { HUDPanel } from "./hud-panel";

interface MapInnerProps {
  traces: Trace[];
  activeTrace: Trace | null;
  setActiveTrace: (trace: Trace | null) => void;
  traceGeoJson: any;
  loading: boolean;
  metrics: TraceMetrics | null;
}

export default function MapInner({ traces, activeTrace, setActiveTrace, traceGeoJson, loading, metrics }: MapInnerProps) {
  const mapRef = useRef<any>(null);
  const hoverMarkerRef = useRef<mapboxgl.Marker | null>(null);

  const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  const handleMapLoad = () => {
    const rawMap = mapRef.current?.getMap();
    if (!rawMap || hoverMarkerRef.current) return;

    const el = document.createElement('div');
    el.className = 'w-4 h-4 bg-blue-600 border-2 border-white rounded-full shadow-md pointer-events-none hidden';
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
            
      if (!marker || !metrics?.profile) return;

      if (index === null) {
        document.getElementById('elevation-hover-dot')?.classList.add('hidden');
        return;
      }

      const activePoint = metrics.profile[index];
      if (!activePoint) return;

      marker.setLngLat([activePoint.lon, activePoint.lat]);
      document.getElementById('elevation-hover-dot')?.classList.remove('hidden');
    };

    window.addEventListener('trace-point-hover', handleHoverBridge);
    
    return () => {
      window.removeEventListener('trace-point-hover', handleHoverBridge);
    };
  }, [metrics]);

  useEffect(() => {
    if (!traceGeoJson || !mapRef.current) return;

    const bounds = bbox(traceGeoJson);
    mapRef.current.fitBounds(bounds, {
      padding: {
        top: 50,
        bottom: 50,
        left: 50,
        right: 400
      },
      duration: 1200,
    });
  }, [traceGeoJson]);

  const lineLayerStyle: Omit<LineLayerSpecification, 'source'> = {
    id: 'gpx-track-layer',
    type: 'line',
    paint: {
      'line-color': '#0070f3',
      'line-width': 5,
      'line-opacity': 0.85,
    },
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
    },
  };

  return (
    <div className="w-full h-full flex relative overflow-hidden bg-slate-950">

      {/* Map Element Box */}
      <div className="flex-1 h-full w-full z-0">
        <Map
          ref={mapRef}
          mapboxAccessToken={MAPBOX_TOKEN}
          initialViewState={{
            longitude: 6.5,
            latitude: 46.5,
            zoom: 7
          }}
          style={{ width: '100%', height: '100%' }}
          mapStyle="mapbox://styles/mapbox/outdoors-v12"
          onLoad={handleMapLoad}
        >
          {/* Trace Markers */}
          {traces.map((trace) => (
            <Marker
              key={trace.id}
              latitude={trace.lat}
              longitude={trace.lon}
              onClick={() => setActiveTrace(trace)}
            >
            </Marker>
          ))}

          {/* Dynamic Track Layer */}
          {traceGeoJson && activeTrace && (
            <Source id="dynamic-gpx" type="geojson" data={traceGeoJson}>
              <Layer {...lineLayerStyle} />
            </Source>
          )}
        </Map>
      </div>      

      {/* HUD Panel */}
      {activeTrace && (
        <div className="absolute top-0 right-0 z-10 h-full p-0 pointer-events-none">
          <HUDPanel
            activeTrace={activeTrace}
            loading={loading}
            metrics={metrics}
            onClose={() => setActiveTrace(null)}
          />
        </div>
      )}

    </div>
  );
}