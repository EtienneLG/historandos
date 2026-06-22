"use client";

import { useState, useEffect, useRef } from "react";
import Map, { Source, Layer, Marker } from 'react-map-gl/mapbox';
import { gpx } from '@tmcw/togeojson';
import bbox from '@turf/bbox';
import { length, lineString } from '@turf/turf';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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

const CleanTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 backdrop-blur-md text-white px-3 py-2 rounded-xl text-xs shadow-xl border border-slate-800 flex flex-col gap-0.5 animate-in fade-in duration-200">
        <span className="font-semibold text-slate-200">{payload[0].value} m elevation</span>
        <span className="text-slate-400 text-[10px]">At {payload[0].payload.distance} km</span>
      </div>
    );
  }
  return null;
};

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
          {trackData && activeTrace && (
            <Source id="dynamic-gpx" type="geojson" data={trackData}>
              <Layer {...lineLayerStyle} />
            </Source>
          )}
        </Map>
      </div>

      {/* HUD Panel */}
      {activeTrace && (
        <div className="w-[480px] h-full bg-white/90 backdrop-blur-md shadow-2xl border-l border-slate-100 overflow-y-auto flex flex-col font-sans text-slate-800">
          <div className="p-6 flex-1 flex flex-col gap-6">
            
            {/* Header */}
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-1 flex-1">
                <h2 className="text-xl font-bold tracking-tight text-slate-900 leading-snug">{activeTrace.title}</h2>
                {activeTrace.description && (
                  <p className="text-slate-500 text-sm leading-relaxed">{activeTrace.description}</p>
                )}
                {activeTrace.date && (
                  <p className="text-slate-400 text-xs tracking-wide uppercase font-medium pt-1">
                    {new Date(activeTrace.date).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                )}
              </div>
              
              <button 
                onClick={() => { setActiveTrace(null) }}
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-xl transition-all duration-200 shrink-0"
                aria-label="Close panel"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Main Content Area */}
            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center py-12 gap-2">
                <div className="h-5 w-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-slate-400 text-sm font-medium">Loading track details...</p>
              </div>
            ) : metrics ? (
              <div className="flex flex-col gap-6 flex-1">
                
                {/* Minimal Metric Dashboard Row */}
                <div className="grid grid-cols-3 gap-2">
                  {/* Distance */}
                  <div className="bg-slate-50/70 rounded-2xl p-3 border border-slate-100 text-center transition-all hover:bg-slate-50">
                    <span className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase mb-0.5">Distance</span>
                    <span className="text-base font-extrabold text-slate-800">{metrics.distance}<span className="text-xs font-semibold text-slate-500 ml-0.5">km</span></span>
                  </div>
                  
                  {/* Elevation Gain */}
                  <div className="bg-emerald-50/50 rounded-2xl p-3 border border-emerald-100/50 text-center transition-all hover:bg-emerald-50">
                    <span className="block text-[10px] font-bold tracking-wider text-emerald-600 uppercase mb-0.5">Gain</span>
                    <span className="text-base font-extrabold text-emerald-700">+ {metrics.elevationGain}<span className="text-xs font-semibold text-emerald-600 ml-0.5">m</span></span>
                  </div>

                  {/* Elevation Loss */}
                  <div className="bg-rose-50/50 rounded-2xl p-3 border border-rose-100/50 text-center transition-all hover:bg-rose-50">
                    <span className="block text-[10px] font-bold tracking-wider text-rose-600 uppercase mb-0.5">Loss</span>
                    <span className="text-base font-extrabold text-rose-700">- {metrics.elevationLoss}<span className="text-xs font-semibold text-rose-600 ml-0.5">m</span></span>
                  </div>
                </div>

                {/* Elevation Chart Section */}
                {metrics.profile && metrics.profile.length > 0 && (
                  <div className="flex flex-col border-t border-slate-100 pt-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Elevation Profile</h3>
                      <span className="text-[11px] text-slate-400 font-medium">m / km</span>
                    </div>
                    
                    {/* Fixed height wrapper makes sure chart scales correctly inside scrolling container */}
                    <div className="h-56 w-full bg-slate-50/40 rounded-2xl p-2 border border-slate-100/60">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={metrics.profile} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                          <CartesianGrid vertical={false} stroke="#f1f5f9" strokeDasharray="4" />
                          <XAxis 
                            dataKey="distance" 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 500 }}
                            dy={8}
                          />
                          <YAxis 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 500 }}
                            domain={['dataMin - 20', 'dataMax + 20']}
                          />
                          <Tooltip content={<CleanTooltip />} cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }} />
                          <Line 
                            type="monotone" 
                            dataKey="elevation" 
                            stroke="#6366f1" 
                            strokeWidth={2.5}
                            dot={false}
                            activeDot={{ r: 5, strokeWidth: 0, fill: '#4f46e5' }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                {/* Photo Gallery Section */}
                {activeTrace.photos && activeTrace.photos.length > 0 && (
                  <div className="border-t border-slate-100 pt-5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Photos from the Trail</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {activeTrace.photos.map((photoUrl: string, index: number) => (
                        <div 
                          key={index} 
                          className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/40 shadow-sm"
                        >
                          <img 
                            src={photoUrl} 
                            alt={`Trail snapshot ${index + 1}`} 
                            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                            loading="lazy"
                          />
                          {/* Subtle hover overlay */}
                          <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors duration-300" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-slate-400 text-sm font-medium">No layout metrics available</p>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}