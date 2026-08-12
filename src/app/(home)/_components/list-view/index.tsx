import { formatDistance } from '@/lib/geo';
import { TracePhoto } from './trace-photo';
import { HikeSummary } from '@/types/hike-types';
import { useUIStore } from '@/stores/ui-store';

interface ListViewProps {
  hikes: HikeSummary[];
}

export default function ListView({ hikes }: ListViewProps) {
  const setActiveTab = useUIStore((s) => s.setActiveTab);
  const setActiveHikeId = useUIStore((s) => s.setActiveHikeId);

  const timeline: Array<{
    year: string;
    months: Array<{ monthName: string; hikes: HikeSummary[] }>;
  }> = [];

  hikes.forEach((hike) => {
    const dateObj = new Date(hike.date);

    const yearStr = dateObj.toLocaleDateString('fr-FR', { year: 'numeric' });
    const monthStr = dateObj.toLocaleDateString('fr-FR', { month: 'long' });

    let yearNode = timeline.find((t) => t.year === yearStr);
    if (!yearNode) {
      yearNode = { year: yearStr, months: [] };
      timeline.push(yearNode);
    }

    let monthNode = yearNode.months.find((m) => m.monthName === monthStr);
    if (!monthNode) {
      monthNode = { monthName: monthStr, hikes: [] };
      yearNode.months.push(monthNode);
    }

    monthNode.hikes.push(hike);
  });

  const handleTraceClick = (hikeId: string) => {
    setActiveHikeId(hikeId);
    setActiveTab('map');
  };

  return (
    <div className="w-full h-full overflow-y-auto bg-parchment p-6 md:p-8">
      {timeline.map(({ year, months }) => (
        <section key={year} className="mb-12 last:mb-0">
          {/* Year Group Separator Heading */}
          <div className="flex items-center gap-4 mb-7">
            <h2 className="font-display text-3xl text-blaze shrink-0 tracking-wide">{year}</h2>
            <div className="h-px w-full bg-gradient-to-r from-stone-dark to-transparent"></div>
          </div>

          {months.map(({ monthName, hikes: monthTraces }) => (
            <div key={year + monthName} className="mb-9 last:mb-0">
              {/* Month Group Separator Heading */}
              <div className="flex items-center gap-3 mb-4">
                <span className="w-2 h-2 rounded-full bg-blaze shrink-0" />
                <h3 className="font-display text-base text-pine/70 uppercase tracking-[0.15em] shrink-0">
                  {monthName}
                </h3>
                <div className="h-px w-full bg-stone"></div>
              </div>

              {/* Grid Layout: Allows multiple items on the same row (1 on mobile, 2 on desktop) */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                {monthTraces.map((hike) => (
                  <button
                    key={hike.id}
                    onClick={() => handleTraceClick(hike.id)}
                    className="group flex text-left bg-parchment-light rounded-xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer h-50"
                  >
                    {/* Photo to the left */}
                    {hike.photoDirId ? (
                      <TracePhoto photoDirId={hike.photoDirId} />
                    ) : (
                      <div className="w-1/3 md:w-1/3 aspect-square bg-stone relative shrink-0 flex flex-col items-center justify-center gap-1.5 text-pine/40 rounded-xl border border-stone">
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 19l6.5-11L14 15l2.5-3.5L21 19H3z"
                          />
                        </svg>
                        <span className="text-[10px] font-semibold uppercase tracking-wide">
                          Aucune photo
                        </span>
                      </div>
                    )}

                    {/* Content: title/stats on the left, date centered on the right */}
                    <div className="flex-1 flex items-stretch gap-3 p-4 min-w-0">
                      {/* Left column: title top, description, stats bottom */}
                      <div className="flex-1 flex flex-col justify-between min-w-0 py-0.5">
                        <div>
                          <h4 className="font-display text-xl text-ink tracking-wide truncate group-hover:text-pine transition-colors">
                            {hike.title}
                          </h4>

                          {hike.people?.length > 0 && (
                            <p className="flex items-center gap-1.5 text-xs text-blaze mt-1">
                              <svg
                                className="w-3.5 h-3.5 shrink-0"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                                />
                              </svg>
                              {hike.people.join(', ')}
                            </p>
                          )}

                          <p className="text-ink/50 text-sm mt-1.5 leading-relaxed line-clamp-3">
                            {hike.description}
                          </p>
                        </div>

                        {/* Quick Stats Row */}
                        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-stone font-mono text-sm font-semibold">
                          <span className="flex items-center text-ink/60">
                            <svg
                              className="w-3 h-3 mr-0.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                              />
                            </svg>
                            {formatDistance(hike.distanceM / 1000)}
                            <span className="text-ink/40 ml-0.5">km</span>
                          </span>

                          <span className="flex items-center text-emerald-600">
                            <svg
                              className="w-3.5 h-3.5 mr-0.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={3}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 15l7-7 7 7"
                              />
                            </svg>
                            {hike.elevationGainM}
                            <span className="text-emerald-600/60 ml-0.5">m</span>
                          </span>

                          <span className="flex items-center text-red-600">
                            <svg
                              className="w-3.5 h-3.5 mr-0.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={3}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                            {hike.elevationLossM}
                            <span className="text-red-600/60 ml-0.5">m</span>
                          </span>
                        </div>
                      </div>

                      {/* Right column: date, vertically centered */}
                      <div className="flex items-center shrink-0 pl-3">
                        <span className="font-display text-2xl text-trail leading-none text-center">
                          {new Date(hike.date).getDate()}
                          <span className="block text-xs font-sans font-semibold text-trail/60 uppercase mt-0.5">
                            {new Date(hike.date).toLocaleDateString('fr-FR', { month: 'short' })}
                          </span>
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </section>
      ))}

      {/* Empty State Fallback Handling */}
      {hikes.length === 0 && (
        <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-pine/40">
          <svg
            className="w-10 h-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 19l6.5-11L14 15l2.5-3.5L21 19H3z"
            />
          </svg>
          <span className="font-medium text-sm">No traces mapped to this timeline yet.</span>
        </div>
      )}
    </div>
  );
}
