"use client";

import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { Trace } from '@/types/trace';

// Fix for missing default Leaflet marker icons in Next.js
import "leaflet/dist/leaflet.css";
L.Marker.prototype.options.icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface MapInnerProps {
  traces: Trace[];
}

interface TraceData {
  id: number;
  title: string;
  date: string;
  description: string;
  distance: string;
  elevationGain: string;
  elevationLoss: string;
  elevationProfile: number[];
}

function GpxLayerEngine({ 
  selectedTrace,
  onTraceLoaded
}: { 
  selectedTrace: Trace | null; 
  onTraceLoaded: (data: Partial<TraceData> | null) => void;
}) {
  const map = useMap();
  const layerRef = useRef<any>(null);

  useEffect(() => {
    if (!selectedTrace) return;

    // 1. Dynamic import of leaflet-gpx ONLY in the browser to prevent node server crashes
    import("leaflet-gpx").then(() => {
      
      // Clean up any previously drawn trail layer before drawing a new one
      if (layerRef.current) {
        map.removeLayer(layerRef.current);
      }

      const gpxUrl = `/api/traces/${selectedTrace as any}`;

      // 2. Initialize L.GPX using the plugin's native builder
      const gpxLayer = new (L as any).GPX(gpxUrl, {
        async: true,
        markers: {
          startIcon: null,
          endIcon: null,
          wptIcons: {},
        },
        polyline_options: {
          color: "#2563eb",
          weight: 2,
          opacity: 0.85,
        }
      });

      // 3. Add layer to map
      gpxLayer.addTo(map);
      layerRef.current = gpxLayer;

      // 4. Listen for the plugin to finish loading and parsing data
      gpxLayer.on("loaded", (e: any) => {
        const gpx = e.target;
        
        // Auto-zoom the camera bounding box perfectly around the trail track
        map.fitBounds(gpx.getBounds(), { padding: [40, 140] });

        // Extract raw elevation profile points directly out of leaflet-gpx tracks
        const elevationPoints: number[] = [];
        gpx.get_elevation_data().forEach((wpt: [number, number]) => {
          elevationPoints.push(wpt[1]);
        });
        
        onTraceLoaded({
          distance: (gpx.get_distance() / 1000).toFixed(1) + " km",
          elevationGain: Math.round(gpx.get_elevation_gain()) + " m",
          elevationLoss: Math.round(gpx.get_elevation_loss()) + " m",
          elevationProfile: elevationPoints
        });
      });
    });

    // Clean up layer when component unmounts
    return () => {
      if (layerRef.current && map) {
        map.removeLayer(layerRef.current);
      }
    };
  }, [selectedTrace, map]);

  return null;
}

export default function MapInner({ traces }: MapInnerProps) {
  const [activeTrace, setActiveTrace] = useState<Trace | null>(null);
  const [hudMetrics, setHudMetrics] = useState<Partial<TraceData> | null>(null);
  const [selectedGpxId, setSelectedGpxId] = useState<string | null>(null);
  
  const handleMarkerSelection = (trace: Trace) => {
    setActiveTrace(trace);
    setHudMetrics(null);
  };

  return (
    <div className="w-full h-full flex relative overflow-hidden">

      {/* Map Element Box */}
      <div className="flex-1 h-full z-0">
        <MapContainer center={[46.5, 6.5]} zoom={7} className="w-full h-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <GpxLayerEngine selectedTrace={activeTrace} onTraceLoaded={setHudMetrics} />

          {traces.map((trace) => (
            <Marker 
              key={trace.id} 
              position={[trace.lat, trace.lng]}
              eventHandlers={{ click: () => handleMarkerSelection(trace) }}
            >
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Floating Right HUD Panel */}
      {activeTrace && (
        <div className="absolute top-6 right-6 bottom-6 w-80 md:w-96 bg-white/95 backdrop-blur-md shadow-2xl border border-gray-100 rounded-2xl p-6 z-[1000] flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
          
          {/* Header Copy Info section */}
          <div>
            <div className="flex justify-between items-start gap-4 mb-2">
              <h3 className="font-black text-xl text-gray-900 tracking-tight leading-tight">{activeTrace.title}</h3>
              <button 
                onClick={() => setActiveTrace(null)}
                className="text-gray-400 hover:text-gray-600 font-medium text-lg p-1 transition-colors"
              >
                ✕
              </button>
            </div>
            
            <span className="inline-block text-[11px] font-bold tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md uppercase mb-4">
              {new Date(activeTrace.date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>

            <p className="text-gray-600 text-sm leading-relaxed mb-6 border-b pb-4 border-gray-100">
              {(activeTrace as any).description || "Aucune description fournie pour ce tracé."}
            </p>
          </div>

          {/* Metrics Data Section */}
          <div className="mt-auto space-y-5">
            {hudMetrics ? (
              <>
                {/* Textual Metrics Row */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-gray-50/80 p-2.5 rounded-xl border border-gray-100">
                    <span className="block text-[10px] uppercase font-bold tracking-wider text-gray-400 mb-0.5">Distance</span>
                    <span className="font-extrabold text-sm text-gray-800">{hudMetrics.distance}</span>
                  </div>
                  <div className="bg-green-50/40 p-2.5 rounded-xl border border-green-100/60">
                    <span className="block text-[10px] uppercase font-bold tracking-wider text-green-600/70 mb-0.5">Dénivelé +</span>
                    <span className="font-extrabold text-sm text-green-700">+{hudMetrics.elevationGain}</span>
                  </div>
                  <div className="bg-red-50/40 p-2.5 rounded-xl border border-red-100/60">
                    <span className="block text-[10px] uppercase font-bold tracking-wider text-red-600/70 mb-0.5">Dénivelé -</span>
                    <span className="font-extrabold text-sm text-red-700">-{hudMetrics.elevationLoss}</span>
                  </div>
                </div>
              </>
            ) : (
              // Loading State Shimmer inside HUD
              <div className="w-full flex flex-col items-center justify-center py-12 space-y-3">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs font-semibold text-gray-400 tracking-wide">Analyse du fichier GPX en cours...</p>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}