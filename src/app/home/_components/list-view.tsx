import { Trace } from '@/types/trace';

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
    <div className="w-full h-full overflow-y-auto bg-gray-50 p-6 md:p-8">
      {timeline.map(({ year, months }) => (
        <section key={year} className="mb-10 last:mb-0">
          
          {/* Year Group Separator Heading */}
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-2xl font-black text-gray-900 shrink-0">{year}</h2>
            <div className="h-[2px] w-full bg-gray-300"></div>
          </div>

          {months.map(({ monthName, traces: monthTraces }) => (
            <div key={year + monthName} className="mb-10 last:mb-0">
            
              {/* Month Group Separator Heading */}
              <div className="flex items-center gap-3 mb-4">
                <h3 className="text-lg font-bold text-gray-700 capitalize shrink-0">{monthName}</h3>
                <div className="h-[1px] w-full bg-gray-200"></div>
              </div>

              {/* Grid Layout: Allows multiple items on the same row (1 on mobile, 2 on desktop) */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {monthTraces.map((trace) => (
                  <div 
                    key={trace.id} 
                    className="flex border border-gray-200 bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 h-44"
                  >
                    {/* Photo to the left */}
                    <div className="w-1/3 md:w-1/4 bg-gray-200 relative shrink-0">
                      {trace.thumbnailUrl ? (
                        <img 
                          src={``}
                          alt={trace.title} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-400 text-xs font-medium">
                          Pas de photo
                        </div>
                      )}
                    </div>

                    {/* Content copy block to the right */}
                    <div className="w-2/3 md:w-3/4 p-4 flex flex-col">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-bold text-base md:text-lg text-gray-900 line-clamp-1">
                          {trace.title}
                        </h4>
                        <span className="text-sm font-semibold text-blue-600 shrink-0">
                          {new Date(trace.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                        </span>
                      </div>
                      <p className="text-gray-500 text-xs md:text-sm mt-1 line-clamp-2 md:line-clamp-3">
                        {trace.description}
                      </p>
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
        <div className="w-full h-full flex items-center justify-center text-gray-400 font-medium">
          No traces mapped to this timeline.
        </div>
      )}
    </div>
  );
}