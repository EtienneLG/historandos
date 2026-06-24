import { ElevationChart } from './elevation-chart';
import { Trace, TracePoint, TraceMetrics } from '@/types/trace';

interface HUDPanelProps {
    activeTrace: Trace;
    loading: boolean;
    metrics: TraceMetrics | null;
    onClose: () => void;
    activePoint: TracePoint | null;
    setActivePoint: (point: TracePoint | null) => void;
}

export function HUDPanel({ activeTrace, loading, metrics, onClose, activePoint, setActivePoint }: HUDPanelProps) {
    return (
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
                onClick={onClose}
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
                  <ElevationChart 
                    profile={metrics.profile} 
                    setActivePoint={setActivePoint}
                  />
                )}

                {/* Photo Gallery Section */}
                {/* {visiblePhotos.length > 0 && (
                  <div className="border-t border-slate-100 pt-5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Photos from the Trail</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {visiblePhotos.map((photoUrl: string, index: number) => (
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
                          <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors duration-300" />
                        </div>
                      ))}
                    </div>
                  </div>
                )} */}

                {/* Scroll Sentinel Target & Loader */}
                {/*hasMorePhotos && (
                  <div ref={sentinelRef} className="py-6 flex justify-center items-center min-h-[40px]">
                    {isFetchingPhotos && (
                      <div className="h-4 w-4 border-2 border-slate-300 border-t-indigo-500 rounded-full animate-spin" />
                    )}
                  </div>
                )} */}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-slate-400 text-sm font-medium">No layout metrics available</p>
              </div>
            )}
          </div>
        </div>
    );
}