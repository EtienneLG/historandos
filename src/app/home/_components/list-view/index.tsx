import { Trace } from '@/types/trace';
import { useEffect } from 'react';
import { TracePhoto } from './trace-photo';

interface ListViewProps {
  traces: Trace[];
  activeTrace: Trace | null;
  setActiveTrace: (trace: Trace | null) => void;
  metrics: any;
}

export default function ListView({ traces, activeTrace, setActiveTrace, metrics }: ListViewProps) {
  const sortedTraces = [...traces].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const timeline: Array<{
    year: string;
    months: Array<{ monthName: string; traces: Trace[] }>;
  }> = [];

  sortedTraces.forEach((trace) => {
    const dateObj = new Date(trace.date);

    const yearStr = dateObj.toLocaleDateString('fr-FR', { year: 'numeric' });
    const monthStr = dateObj.toLocaleDateString('fr-FR', { month: 'long' });

    let yearNode = timeline.find((t) => t.year === yearStr);
    if (!yearNode) {
      yearNode = { year: yearStr, months: [] };
      timeline.push(yearNode);
    }

    let monthNode = yearNode.months.find((m) => m.monthName === monthStr);
    if (!monthNode) {
      monthNode = { monthName: monthStr, traces: [] };
      yearNode.months.push(monthNode);
    }

    monthNode.traces.push(trace);
  });

  return (
    <div className="w-full h-full overflow-y-auto bg-parchment p-6 md:p-8">
      {timeline.map(({ year, months }) => (
        <section key={year} className="mb-12 last:mb-0">

          {/* Year Group Separator Heading */}
          <div className="flex items-center gap-4 mb-7">
            <h2 className="font-display text-3xl text-pine shrink-0 tracking-wide">{year}</h2>
            <div className="h-px w-full bg-gradient-to-r from-stone-dark to-transparent"></div>
          </div>

          {months.map(({ monthName, traces: monthTraces }) => (
            <div key={year + monthName} className="mb-9 last:mb-0">

              {/* Month Group Separator Heading */}
              <div className="flex items-center gap-3 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-blaze shrink-0" />
                <h3 className="font-display text-sm text-pine/70 uppercase tracking-[0.15em] shrink-0">
                  {monthName}
                </h3>
                <div className="h-px w-full bg-stone"></div>
              </div>

              {/* Grid Layout: Allows multiple items on the same row (1 on mobile, 2 on desktop) */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                {monthTraces.map((trace) => (
                  <div
                    key={trace.id}
                    className="group flex border border-stone bg-parchment-light rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:border-pine/30 transition-all duration-200 h-44"
                  >
                    {/* Photo to the left */}
                    {trace.photoDirId ? (
                      <TracePhoto photoDirId={trace.photoDirId} />
                    ) : (
                      <div className="w-1/3 md:w-1/4 bg-stone relative shrink-0 flex flex-col items-center justify-center gap-1.5 text-pine/40 rounded-xl border border-stone">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 19l6.5-11L14 15l2.5-3.5L21 19H3z" />
                        </svg>
                        <span className="text-[10px] font-semibold uppercase tracking-wide">No photo</span>
                      </div>
                    )}

                    {/* Content copy block to the right */}
                    <div className="w-2/3 md:w-3/4 p-4 flex flex-col">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-display text-base md:text-lg text-ink line-clamp-1 tracking-wide group-hover:text-pine transition-colors">
                          {trace.title}
                        </h4>
                        <span className="font-mono text-xs font-semibold text-trail shrink-0 pt-0.5">
                          {new Date(trace.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                        </span>
                      </div>

                      <p className="text-ink/55 text-xs md:text-sm mt-1.5 leading-relaxed line-clamp-2 md:line-clamp-3">
                        {trace.description}
                      </p>

                      {/* Quick Stats Row */}
                      {trace.metrics && (
                        <div className="flex items-center gap-3 mt-auto pt-2 font-mono text-[11px] font-semibold">
                          {trace.metrics.distance != null && (
                            <span className="flex items-center gap-1 text-ink/60">
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                              </svg>
                              {trace.metrics.distance}km
                            </span>
                          )}
                          {trace.metrics.elevationGain != null && (
                            <span className="flex items-center gap-1 text-emerald-700">
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                              </svg>
                              {trace.metrics.elevationGain}m
                            </span>
                          )}
                          {trace.metrics.elevationLoss != null && (
                            <span className="flex items-center gap-1 text-red-700">
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                              </svg>
                              {trace.metrics.elevationLoss}m
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      ))}

      {/* Empty State Fallback Handling */}
      {traces.length === 0 && (
        <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-pine/40">
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 19l6.5-11L14 15l2.5-3.5L21 19H3z" />
          </svg>
          <span className="font-medium text-sm">No traces mapped to this timeline yet.</span>
        </div>
      )}
    </div>
  );
}