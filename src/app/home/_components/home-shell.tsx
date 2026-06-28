"use client";

import { useEffect, useRef, useState } from 'react';
import { Trace, TraceMetrics } from '@/types/trace';
import ListView from './list-view';
import MapViewWrapper from './map-view/index';

interface HomeShellProps {
  traces: Trace[];
} 

type TabView = 'list' | 'map';

export default function HomeShell({ traces }: HomeShellProps) {
  const [activeTab, setActiveTab] = useState<TabView>('list');

  const [activeTrace, setActiveTrace] = useState<Trace | null>(null);
  const [traceGeoJson, setTraceGeoJson] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [metrics, setMetrics] = useState<TraceMetrics | null>(null);

  useEffect(() => {
    if (!activeTrace) return;

    async function loadNewTrack() {
      setLoading(true);
      setTraceGeoJson(null);
      try {
        const response = await fetch(`/api/traces/${activeTrace?.gpxFileId}`);
        const data = await response.json();

        setTraceGeoJson(data.geoJson);
        setMetrics(data.metrics);
      } catch (error) {
        console.error('Error updating GPX track:', error);
      } finally {
        setLoading(false);
      }
    }

    loadNewTrack();
  }, [activeTrace]);

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-gray-50">
      
      <div className="flex w-full border-b border-gray-200 bg-white z-10 shrink-0">
        <button
          onClick={() => setActiveTab('list')}
          className={`flex-1 py-4 text-center font-semibold border-b-2 transition-colors ${
            activeTab === 'list' 
              ? 'border-blue-600 text-blue-600 bg-blue-50/30' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          Tile List
        </button>
        <button
          onClick={() => setActiveTab('map')}
          className={`flex-1 py-4 text-center font-semibold border-b-2 transition-colors ${
            activeTab === 'map' 
              ? 'border-blue-600 text-blue-600 bg-blue-50/30' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          Map View
        </button>
      </div>

      <div className="relative flex-1 w-full min-h-0">

        <div className={`w-full h-full overflow-y-auto ${activeTab === 'list' ? 'block' : 'hidden'}`}>
          <ListView 
            traces={traces} 
            activeTrace={activeTrace} 
            setActiveTrace={setActiveTrace}
            metrics={metrics}
          />
        </div>

        <div 
          className={`absolute inset-0 transition-opacity duration-200 ${
            activeTab === 'map' 
              ? 'opacity-100 pointer-events-auto z-10' 
              : 'opacity-0 pointer-events-none -z-10'
          }`}
        >
          <MapViewWrapper
            traces={traces} 
            activeTrace={activeTrace} 
            setActiveTrace={setActiveTrace}
            traceGeoJson={traceGeoJson}
            loading={loading}
            metrics={metrics}
          />
        </div>

      </div>
    </div>
  );
}