import { useRef } from 'react';
import { ElevationChart } from './elevation-chart';
import { Trace, TracePoint, TraceMetrics } from '@/types/trace';
import { ActivityPhoto } from './activity-photo';
import { useScrollingPhotos } from '../_hooks/scrolling-photos';

interface HUDPanelProps {
  activeTrace: Trace;
  loading: boolean;
  metrics: TraceMetrics | null;
  onClose: () => void;
}

export function HUDPanel({ activeTrace, loading, metrics, onClose }: HUDPanelProps) {
  const hudScrollContainerRef = useRef<HTMLDivElement | null>(null);

  const { sentinelRef, visiblePhotoIds, isFetchingPhotos, hasMorePhotos } = useScrollingPhotos(activeTrace, hudScrollContainerRef);

  return (
    <div ref={hudScrollContainerRef} className="pointer-events-auto w-[480px] h-full bg-parchment-light/95 backdrop-blur-md shadow-2xl border-l border-stone overflow-y-auto flex flex-col font-sans text-ink">
      <div className="p-6 flex-1 flex flex-col gap-6">

        {/* Header */}
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-1 flex-1">
            <h2 className="font-display text-xl text-pine leading-snug tracking-wide">{activeTrace.title}</h2>
            {activeTrace.description && (
              <p className="text-ink/60 text-sm leading-relaxed">{activeTrace.description}</p>
            )}
            {activeTrace.date && (
              <p className="font-mono text-blaze text-xs tracking-wide uppercase font-medium pt-1">
                {new Date(activeTrace.date).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            )}
          </div>

          <button
            onClick={onClose}
            className="text-ink/40 hover:text-pine hover:bg-stone/50 p-1.5 rounded-xl transition-all duration-200 shrink-0"
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
            <div className="h-5 w-5 border-2 border-blaze border-t-transparent rounded-full animate-spin" />
            <p className="text-ink/40 text-sm font-medium">Loading track details...</p>
          </div>
        ) : metrics ? (
          <div className="flex flex-col gap-6 flex-1">

            {/* Minimal Metric Dashboard Row */}
            <div className="grid grid-cols-3 gap-2">
              {/* Distance */}
              <div className="bg-stone/30 rounded-2xl p-3 border border-stone text-center transition-all hover:bg-stone/50">
                <span className="block text-[10px] font-bold tracking-wider text-ink/40 uppercase mb-0.5">Distance</span>
                <span className="font-mono text-base font-extrabold text-ink">{metrics.distance}<span className="text-xs font-semibold text-ink/50 ml-0.5">km</span></span>
              </div>

              {/* Elevation Gain */}
              <div className="bg-emerald-50 rounded-2xl p-3 border border-emerald-200 text-center transition-all hover:bg-emerald-100">
                <span className="block text-[10px] font-bold tracking-wider text-emerald-700 uppercase mb-0.5">Gain</span>
                <span className="font-mono text-base font-extrabold text-emerald-700">+{metrics.elevationGain}<span className="text-xs font-semibold text-emerald-600 ml-0.5">m</span></span>
              </div>

              {/* Elevation Loss */}
              <div className="bg-red-50 rounded-2xl p-3 border border-red-200 text-center transition-all hover:bg-red-100">
                <span className="block text-[10px] font-bold tracking-wider text-red-700 uppercase mb-0.5">Loss</span>
                <span className="font-mono text-base font-extrabold text-red-700">-{metrics.elevationLoss}<span className="text-xs font-semibold text-red-600 ml-0.5">m</span></span>
              </div>
            </div>

            {/* Elevation Chart Section */}
            {metrics.profile && metrics.profile.length > 0 && (
              <ElevationChart
                profile={metrics.profile}
              />
            )}

            {/* Photo Gallery Section */}
            {activeTrace.photoDirId ? (
              <div>
                {visiblePhotoIds.length > 0 && (
                  <div className="border-t border-stone pt-5">
                    <h3 className="font-display text-xs uppercase tracking-widest text-pine/60 mb-3">Photos</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {visiblePhotoIds.map((id: number) => (
                        <ActivityPhoto key={id} photoId={id} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Scroll Sentinel Target & Loader */}
                {hasMorePhotos && (
                  <div ref={sentinelRef} className="py-6 flex justify-center items-center min-h-[40px]">
                    {isFetchingPhotos && (
                      <div className="h-4 w-4 border-2 border-stone-dark border-t-blaze rounded-full animate-spin" />
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-ink/40 text-sm font-medium">No photos available</p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-ink/40 text-sm font-medium">No layout metrics available</p>
          </div>
        )}
      </div>
    </div>
  );
}