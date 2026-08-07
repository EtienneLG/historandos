"use client";

import { HikeSummary } from '@/types/hike-types';
import ListView from './list-view/index';
import MapViewWrapper from './map-view/index';
import { useUIStore } from '@/stores/ui-store';

interface HomeShellProps {
  hikes: HikeSummary[];
}

export default function HomeShell({ hikes }: HomeShellProps) {
  const activeTab = useUIStore((s) => s.activeTab);
  const setActiveTab = useUIStore((s) => s.setActiveTab);

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
              className={`flex items-center gap-2 px-4 py-1.5 text-sm font-semibold rounded-md transition-all duration-150 ${activeTab === 'list'
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
              className={`flex items-center gap-2 px-4 py-1.5 text-sm font-semibold rounded-md transition-all duration-150 ${activeTab === 'map'
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

        </div>
      </header>

      <div className="relative flex-1 w-full min-h-0">

        {/* ListView Layout Frame */}
        <div className={`w-full h-full overflow-y-auto ${activeTab === 'list' ? 'block' : 'hidden'}`}>
          <ListView
            hikes={hikes}
          />
        </div>

        {/* MapView Canvas Frame */}
        <div
          className={`absolute inset-0 transition-opacity duration-200 ${activeTab === 'map'
              ? 'opacity-100 pointer-events-auto z-10'
              : 'opacity-0 pointer-events-none -z-10'
            }`}
        >
          <MapViewWrapper
            hikes={hikes}
          />
        </div>

      </div>
    </div>
  );
}