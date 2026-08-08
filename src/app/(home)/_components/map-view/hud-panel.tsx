import { useRef } from 'react';
import { ElevationChart } from './elevation-chart';
import { ActivityPhoto } from './activity-photo';
import { useScrollingPhotos } from '../_hooks/scrolling-photos';
import { formatDistance } from '@/lib/geo';
import { HikeDetail, HikePoint, HikeSummary } from '@/types/hike-types';

interface HUDPanelProps {
  activeHike: HikeSummary;
  hikeDetail: HikeDetail | null;
  loading: boolean;
  hikePoints: HikePoint[];
  onClose: () => void;
}

export function HUDPanel({ activeHike, hikeDetail, loading, hikePoints, onClose }: HUDPanelProps) {
  const hudScrollContainerRef = useRef<HTMLDivElement | null>(null);

  const {
    sentinelRef,
    visiblePhotoIds,
    isFetchingPhotos,
    hasMorePhotos
  } = useScrollingPhotos(activeHike.photoDirId, hudScrollContainerRef);

  return (
    <div ref={hudScrollContainerRef} className="pointer-events-auto w-[480px] h-full bg-parchment-light/95 backdrop-blur-md shadow-2xl border-l border-stone overflow-y-auto flex flex-col font-sans text-ink">
      <div className="p-6 flex-1 flex flex-col gap-6">

        {/* Header */}
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-1 flex-1">
            <h2 className="font-display text-xl text-pine leading-snug tracking-wide">{activeHike.title}</h2>

            {activeHike.people.length > 0 && (
              <p className="flex items-center gap-1.5 text-xs text-blaze">
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
                {activeHike.people.join(', ')}
              </p>
            )}

            <p className="text-ink/60 text-sm leading-relaxed">{activeHike.description}</p>

            <p className="font-mono text-trail text-xs tracking-wide uppercase font-medium pt-1">
              {new Date(activeHike.date).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>

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
        ) : hikeDetail ? (
          <div className="flex flex-col gap-6 flex-1">

            {/* Minimal Metric Dashboard Row */}
            <div className="flex items-stretch divide-x divide-stone rounded-2xl border border-stone overflow-hidden">
              {/* Distance */}
              <div className="flex-1 flex flex-col items-center justify-center gap-1 py-3">
                <span className="text-[10px] font-bold tracking-wider text-ink/40 uppercase">Distance</span>
                <span className="font-mono text-lg font-extrabold text-ink leading-none">
                  {formatDistance(hikeDetail.distanceM)}<span className="text-xs font-semibold text-ink/40 ml-0.5">km</span>
                </span>
              </div>

              {/* Elevation Gain */}
              <div className="flex-1 flex flex-col items-center justify-center gap-1 py-3">
                <span className="text-[10px] font-bold tracking-wider text-ink/40 uppercase">Dénivelé +</span>
                <span className="flex items-center gap-1 font-mono text-lg font-extrabold text-emerald-600 leading-none">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                  </svg>
                  {hikeDetail.elevationGainM}<span className="text-xs font-semibold text-emerald-600/70 ml-0.5">m</span>
                </span>
              </div>

              {/* Elevation Loss */}
              <div className="flex-1 flex flex-col items-center justify-center gap-1 py-3">
                <span className="text-[10px] font-bold tracking-wider text-ink/40 uppercase">Dénivelé -</span>
                <span className="flex items-center gap-1 font-mono text-lg font-extrabold text-red-600 leading-none">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                  {hikeDetail.elevationLossM}<span className="text-xs font-semibold text-red-600/70 ml-0.5">m</span>
                </span>
              </div>
            </div>

            {/* Elevation Chart Section */}
            {hikePoints && hikePoints.length > 0 && (
              <ElevationChart
                hikePoints={hikePoints}
              />
            )}

            {/* Photo Gallery Section */}
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
            <p className="text-ink/40 text-sm font-medium">No layout metrics available</p>
          </div>
        )}
      </div>
    </div>
  );
}