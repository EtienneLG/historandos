"use client";

import { useState, useEffect, useRef } from "react";
import Map, { Source, Layer, Marker } from 'react-map-gl/mapbox';
import { gpx } from '@tmcw/togeojson';
import bbox from '@turf/bbox';
import { length, lineString } from '@turf/turf';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Trace } from '@/types/trace';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapInnerProps {
  traces: Trace[];
}

interface TrackMetrics {
  distance: number;
  elevationGain: number;
  elevationLoss: number;
  profile?: { distance: number; elevation: number }[];
}

function calculateTrackMetrics(geoJson: any): TrackMetrics {
  let totalDist = 0;
  let gain = 0;
  let loss = 0;

  const coords = geoJson.features[0].geometry.coordinates;
      
  // 1. Total Distance
  totalDist = length(geoJson, { units: 'kilometers' });

  // 2. Elevation Profile
  const profile = coords.map((coord: [number, number, number], i: number) => {
    let distAtPoint = 0;

    if (i > 0) { 
      const subLine = lineString(coords.slice(0, i + 1));
      distAtPoint = i === 0 ? 0 : length(subLine, { units: 'kilometers' });
      
      if (coords[i][2] > coords[i - 1][2]) {
        gain += coords[i][2] - coords[i - 1][2];
      }

      if (coords[i][2] < coords[i - 1][2]) {
        loss += coords[i - 1][2] - coords[i][2];
      }
    }

    return {
      distance: parseFloat(distAtPoint.toFixed(1)), 
      elevation: Math.round(coord[2]), // meters
    };
  });

  return {
    distance: Math.round(totalDist * 1000) / 1000,
    elevationGain: Math.round(gain),
    elevationLoss: Math.round(loss),
    profile: profile,
  };
}

export default function MapInner({ traces }: MapInnerProps) {
  const mapRef = useRef<any>(null);

  const [activeTrace, setActiveTrace] = useState<Trace | null>(null);
  const [trackData, setTrackData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [metrics, setMetrics] = useState<TrackMetrics | null>(null);

  const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  useEffect(() => {
    if (!activeTrace) return;

    async function loadNewTrack() {
      setLoading(true);
      try {
        const response = await fetch(`/api/traces/${activeTrace?.id}`);
        const gpxText = await response.text();

        const parser = new DOMParser();
        const gpxXml = parser.parseFromString(gpxText, 'text/xml');
        const geoJson = gpx(gpxXml);

        setTrackData(geoJson);
        setMetrics(calculateTrackMetrics(geoJson));

        if (mapRef.current) {
          const [minLng, minLat, maxLng, maxLat] = bbox(geoJson);
          mapRef.current.fitBounds([minLng, minLat, maxLng, maxLat], {
            padding: 50,
            duration: 1200,
          });
        }
      } catch (error) {
        console.error('Error updating GPX track:', error);
      } finally {
        setLoading(false);
      }
    }

    loadNewTrack();
  }, [activeTrace]);

  const lineLayerStyle = {
    id: 'gpx-track-layer',
    type: 'line',
    paint: {
      'line-color': '#0070f3', // Next.js blue
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
          style={{width: '100%', height: '100%'}}
          mapStyle="mapbox://styles/mapbox/outdoors-v12"
        >
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
          {trackData && (
            <Source id="dynamic-gpx" type="geojson" data={trackData}>
              <Layer {...lineLayerStyle} />
            </Source>
          )}
        </Map>
      </div>

      {/* HUD Panel */}
      {activeTrace && (
        <div className="w-80 h-full bg-white shadow-lg overflow-y-auto flex flex-col">
          <div className="p-6 flex-1 flex flex-col">
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{activeTrace.title}</h2>
              {activeTrace.description && (
                <p className="text-gray-600 text-sm mb-3">{activeTrace.description}</p>
              )}
              {activeTrace.date && (
                <p className="text-gray-500 text-xs">
                  {new Date(activeTrace.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              )}
            </div>

            {/* Metrics */}
            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading track...</p>
              </div>
            ) : metrics ? (
              <div className="flex flex-col gap-4 flex-1">
                <div className="space-y-3">
                  <MetricCard label="Distance" value={`${metrics.distance} km`} />
                  <MetricCard label="Elevation Gain" value={`${metrics.elevationGain} m`} />
                  <MetricCard label="Elevation Loss" value={`${metrics.elevationLoss} m`} />
                </div>

                {/* Elevation Chart */}
                {metrics.profile && metrics.profile.length > 0 && (
                  <div className="flex-1 min-h-48 border-t pt-4">
                    <p className="text-gray-600 text-sm font-medium mb-2">Elevation Profile</p>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={metrics.profile}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis 
                          dataKey="distance" 
                          tick={{ fontSize: 12 }} 
                          label={{ value: 'Distance (km)', position: 'insideBottomRight', offset: -5 }}
                        />
                        <YAxis 
                          tick={{ fontSize: 12 }} 
                          label={{ value: 'Elevation (m)', angle: -90, position: 'insideLeft' }}
                        />
                        <Tooltip 
                          formatter={(value) => `${value} m`}
                          labelFormatter={(value) => `${value} km`}
                          contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="elevation" 
                          stroke="#0070f3" 
                          dot={false}
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No metrics available</p>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <p className="text-gray-600 text-sm font-medium mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}