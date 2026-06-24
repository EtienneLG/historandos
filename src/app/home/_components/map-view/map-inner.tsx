"use client";

import { useState, useEffect, useRef } from "react";
import Map, { Source, Layer, Marker } from 'react-map-gl/mapbox';
import { gpx } from '@tmcw/togeojson';
import bbox from '@turf/bbox';
import { Trace, TracePoint, TraceMetrics } from '@/types/trace';
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
  const [activePoint, setActivePoint] = useState<TracePoint | null>(null);

  const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  useEffect(() => {
    if (!traceGeoJson || !mapRef.current) return;

    const bounds = bbox(traceGeoJson);
    mapRef.current.fitBounds(bounds, {
      padding: 50,
      duration: 1200,
    });
  }, [traceGeoJson]);

  const lineLayerStyle = {
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
    <div className="w-full h-full flex relative overflow-hidden">

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

          {/* Dynamic Marker */}
          {activePoint && (
            <Marker
              latitude={activePoint.lat}
              longitude={activePoint.lon}
            />
          )}

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
        <HUDPanel
          activeTrace={activeTrace}
          loading={loading}
          metrics={metrics}
          onClose={() => setActiveTrace(null)}
          activePoint={activePoint}
          setActivePoint={setActivePoint}
        />
      )}

    </div>
  );
}