import { WaypointIcon } from '@/components/waypoint-icon';
import { formatDistance } from '@/lib/geo';
import { DaySegment } from '@/lib/day-segments';
import { getWaypointVisual } from '@/lib/waypoints';
import { ResolvedWaypoint } from '@/types/hike-types';

interface DaySectionProps {
  day: DaySegment;
  /** Whether the day's boundary already appeared as the last card of the previous day. */
  skipFirstWaypoint: boolean;
  isOpen: boolean;
  activeWaypointId: string | null;
  onToggle: () => void;
  onSelectWaypoint: (id: string) => void;
}

/** One collapsible "Day N" section: header stats + the timeline of that day's waypoints. */
export function DaySection({
  day,
  skipFirstWaypoint,
  isOpen,
  activeWaypointId,
  onToggle,
  onSelectWaypoint,
}: DaySectionProps) {
  const displayedWaypoints = skipFirstWaypoint ? day.waypoints.slice(1) : day.waypoints;

  return (
    <div className="rounded-xl border border-stone overflow-hidden">
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full flex items-center gap-3 px-3 py-3 bg-parchment/60 hover:bg-stone/25 transition-colors duration-150 cursor-pointer"
      >
        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-pine text-parchment-light font-mono text-xs font-bold shrink-0">
          {day.dayNumber}
        </span>

        <span className="font-display text-sm text-pine flex-1 text-left">
          Jour {day.dayNumber}
        </span>

        <span className="flex items-center gap-3 font-mono text-[11px] text-ink/50 shrink-0">
          <span>{formatDistance(day.distanceM / 1000)} km</span>
          {day.gainM > 0 && <span className="text-emerald-600/80">+{Math.round(day.gainM)} m</span>}
          {day.lossM > 0 && <span className="text-red-600/80">-{Math.round(day.lossM)} m</span>}
        </span>

        <svg
          className={`w-4 h-4 text-ink/40 shrink-0 transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <ol className="relative flex flex-col gap-4 px-3 pt-4 pb-2">
          {displayedWaypoints.map((waypoint, index) => {
            const visual = getWaypointVisual(waypoint);
            const isActive = activeWaypointId === waypoint.id;
            const isLast = index === displayedWaypoints.length - 1;

            return (
              <WaypointItem
                key={waypoint.id}
                waypoint={waypoint}
                visual={visual}
                isActive={isActive}
                isLast={isLast}
                onSelect={onSelectWaypoint}
              />
            );
          })}
        </ol>
      )}
    </div>
  );
}

interface WaypointItemProps {
  waypoint: ResolvedWaypoint;
  visual: ReturnType<typeof getWaypointVisual>;
  isActive: boolean;
  isLast: boolean;
  onSelect: (id: string) => void;
}

function WaypointItem({ waypoint, visual, isActive, isLast, onSelect }: WaypointItemProps) {
  return (
    <li className="relative pl-9">
      {/* Vertical rail */}
      {!isLast && (
        <span className="absolute left-[15px] top-8 -bottom-4 w-0.5 bg-stone" aria-hidden="true" />
      )}

      {/* Category node on the rail */}
      <span
        className={`absolute left-0 top-0 flex items-center justify-center w-8 h-8 rounded-full border-2 shadow-sm transition-transform duration-150 ${visual.nodeClass} ${isActive ? 'scale-110 ring-2 ring-blaze/40' : ''}`}
      >
        <WaypointIcon icon={visual.icon} className="w-4 h-4" />
      </span>

      <button
        onClick={() => onSelect(waypoint.id)}
        className={`w-full text-left rounded-xl px-2 pt-1.5 pb-2 transition-colors duration-150 cursor-pointer hover:bg-stone/20 ${
          isActive ? 'bg-stone/30' : ''
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <span
            className={`font-display text-sm leading-snug ${isActive ? 'text-blaze' : 'text-pine'}`}
          >
            {waypoint.name}
          </span>
          <span className="flex items-center gap-1.5 font-mono text-[11px] text-ink/45 tabular-nums shrink-0">
            <span>{formatDistance(waypoint.distanceFromStartM / 1000)} km</span>
            <span className="text-ink/25">·</span>
            <span>{Math.round(waypoint.elevation)} m</span>
          </span>
        </div>

        {waypoint.description && (
          <p className="text-ink/60 text-xs pt-1 leading-relaxed">{waypoint.description}</p>
        )}
      </button>
    </li>
  );
}
