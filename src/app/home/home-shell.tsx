"use client";

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Trace, TraceMetrics } from '@/types/trace';
import ListView from './_components/list-view/index';
import MapViewWrapper from './_components/map-view/index';

interface HomeShellProps {
  traces: Trace[];
} 

type TabView = 'list' | 'map';

const UploadDrawer = dynamic(() => import('./_components/upload-drawer'), {
  ssr: false,
});

export default function HomeShell({ traces }: HomeShellProps) {
  const [activeTab, setActiveTab] = useState<TabView>('list');
  const [isUploadOpen, setIsUploadOpen] = useState(false);

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
        
        if (!response.ok)
          throw new Error('Failed fetching GPX track');
        
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
      
      <header className="flex items-center justify-between px-6 h-16 border-b border-gray-200 bg-white z-20 shrink-0">
        
        {/* Left Side: Brand Logo & Name */}
        <div className="flex items-center gap-3">
          {/* Logo Icon Placeholder */}
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-sm shadow-blue-200">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          <span className="font-bold text-lg tracking-tight text-gray-900">
            One<span className="text-blue-600">Two</span>
          </span>
        </div>

        {/* Right Side: Tab Controls + Actions */}
        <div className="flex items-center gap-4">
          
          {/* Segmented Pill Switcher */}
          <nav className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200/50">
            <button
              onClick={() => setActiveTab('list')}
              className={`flex items-center gap-2 px-4 py-1.5 text-sm font-semibold rounded-lg transition-all duration-150 ${
                activeTab === 'list'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
              </svg>
              Tile List
            </button>
            <button
              onClick={() => setActiveTab('map')}
              className={`flex items-center gap-2 px-4 py-1.5 text-sm font-semibold rounded-lg transition-all duration-150 ${
                activeTab === 'map'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Map View
            </button>
          </nav>

          <div className="h-6 w-px bg-gray-200 mx-1" />

          {/* Action Upload Button */}
          <button
            onClick={() => setIsUploadOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm shadow-blue-100 transition-all active:scale-[0.98]"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Upload Trace
          </button>
        </div>
      </header>

      <div className="relative flex-1 w-full min-h-0">
        
        {/* ListView Layout Frame */}
        <div className={`w-full h-full overflow-y-auto ${activeTab === 'list' ? 'block' : 'hidden'}`}>
          <ListView 
            traces={traces} 
            activeTrace={activeTrace} 
            setActiveTrace={setActiveTrace}
            metrics={metrics}
          />
        </div>

        {/* MapView Canvas Frame */}
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

      {/* Inline Upload Interface Overlays */}
      {isUploadOpen && 
        <UploadDrawer 
          onClose={() => setIsUploadOpen(false)} 
        />
      }
    </div>
  );
}