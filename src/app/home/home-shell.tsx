"use client";

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Trace, TraceMetrics } from '@/types/trace';
import ListView from './_components/list-view/index';
import MapViewWrapper from './_components/map-view/index';

interface HomeShellProps {
  traces: Trace[];
}

const UploadDrawer = dynamic(() => import('./_components/upload-drawer'), {
  ssr: false,
});

export default function HomeShell({ traces }: HomeShellProps) {
  const [activeTab, setActiveTab] = useState<'list' | 'map'>('list');
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
    <div className="relative flex flex-col h-screen w-full overflow-hidden bg-parchment font-sans text-ink topo-texture">

      <header className="flex items-center justify-between px-6 h-16 border-b border-stone bg-parchment-light/80 backdrop-blur-sm z-20 shrink-0">

        {/* Left Side: Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-pine shadow-sm shadow-pine/20">
            {/* mountain / peak glyph */}
            <svg className="w-5 h-5 text-parchment-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 19l6.5-11L14 15l2.5-3.5L21 19H3z" />
              <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
            </svg>
          </div>
          <span className="font-display text-2xl tracking-wide text-pine uppercase">
            Histo'<span className="text-blaze">Randos</span>
          </span>
        </div>

        {/* Right Side: Tab Controls + Actions */}
        <div className="flex items-center gap-4">

          {/* Segmented Pill Switcher */}
          <nav className="flex items-center bg-stone/40 p-1 rounded-lg border border-stone">
            <button
              onClick={() => setActiveTab('list')}
              className={`flex items-center gap-2 px-4 py-1.5 text-sm font-semibold rounded-md transition-all duration-150 ${
                activeTab === 'list'
                  ? 'bg-parchment-light text-pine shadow-sm'
                  : 'text-ink/50 hover:text-ink'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
              </svg>
              Journal
            </button>
            <button
              onClick={() => setActiveTab('map')}
              className={`flex items-center gap-2 px-4 py-1.5 text-sm font-semibold rounded-md transition-all duration-150 ${
                activeTab === 'map'
                  ? 'bg-parchment-light text-pine shadow-sm'
                  : 'text-ink/50 hover:text-ink'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Carte
            </button>
          </nav>

          <div className="h-6 w-px bg-stone" />

          {/* Action Upload Button — the one accent moment */}
          <button
            onClick={() => setIsUploadOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blaze hover:bg-blaze-dark text-parchment-light text-sm font-semibold rounded-lg shadow-sm shadow-blaze/30 transition-all active:scale-[0.98]"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Ajouter une rando 
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
            setActiveTab={setActiveTab}
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