import { formatDistance } from '@/lib/geo';
import { HikeSummary } from '@/types/hike-types';

interface HikeHeaderProps {
  activeHike: HikeSummary;
}

export function HikeHeader({ activeHike }: HikeHeaderProps) {
  return (
    <div className="shrink-0 bg-parchment-light/95 backdrop-blur-md flex flex-col gap-4">
      {/* Identity */}
      <div className="space-y-1 flex-1">
        <h2 className="font-display text-xl text-pine leading-snug tracking-wide">
          {activeHike.title}
        </h2>

        {activeHike.people.length > 0 && (
          <p className="flex items-center gap-1.5 text-xs text-blaze">
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
            {activeHike.people.join(', ')}
          </p>
        )}

        <p className="text-ink/60 text-sm leading-relaxed">{activeHike.description}</p>

        <p className="font-mono text-trail text-xs tracking-wide uppercase font-medium pt-1">
          {new Date(activeHike.date).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      {/* Minimal Metric Dashboard Row */}
      <div className="flex items-stretch divide-x divide-stone rounded-2xl border border-stone overflow-hidden">
        {/* Distance */}
        <div className="flex-1 flex flex-col items-center justify-center gap-1 py-3">
          <span className="text-[10px] font-bold tracking-wider text-ink/40 uppercase">
            Distance
          </span>
          <span className="font-mono text-lg font-extrabold text-ink leading-none">
            {formatDistance(activeHike.distanceM / 1000)}
            <span className="text-xs font-semibold text-ink/40 ml-0.5">km</span>
          </span>
        </div>

        {/* Elevation Gain */}
        <div className="flex-1 flex flex-col items-center justify-center gap-1 py-3">
          <span className="text-[10px] font-bold tracking-wider text-ink/40 uppercase">
            Dénivelé +
          </span>
          <span className="flex items-center gap-1 font-mono text-lg font-extrabold text-emerald-600 leading-none">
            <svg
              className="w-3 h-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
            </svg>
            {activeHike.elevationGainM}
            <span className="text-xs font-semibold text-emerald-600/70 ml-0.5">m</span>
          </span>
        </div>

        {/* Elevation Loss */}
        <div className="flex-1 flex flex-col items-center justify-center gap-1 py-3">
          <span className="text-[10px] font-bold tracking-wider text-ink/40 uppercase">
            Dénivelé -
          </span>
          <span className="flex items-center gap-1 font-mono text-lg font-extrabold text-red-600 leading-none">
            <svg
              className="w-3 h-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
            {activeHike.elevationLossM}
            <span className="text-xs font-semibold text-red-600/70 ml-0.5">m</span>
          </span>
        </div>
      </div>
    </div>
  );
}
