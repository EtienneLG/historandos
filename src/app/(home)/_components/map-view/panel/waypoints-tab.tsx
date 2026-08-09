import { useMemo, useState } from 'react';
import { computeDaySegments, findDayNumberForWaypoint } from '@/lib/day-segments';
import { HikePoint, HikeSummary, ResolvedWaypoint } from '@/types/hike-types';
import { DaySection } from './day-section';
import { HikeHeader } from './hike-header';

interface WaypointsTabProps {
  waypoints: ResolvedWaypoint[];
  hikePoints: HikePoint[];
  activeWaypointId: string | null;
  activeHike: HikeSummary;
  loading: boolean;
  onSelect: (id: string) => void;
}

export function WaypointsTab({ waypoints, hikePoints, activeWaypointId, activeHike, loading, onSelect }: WaypointsTabProps) {
  const days = useMemo(() => computeDaySegments(waypoints, hikePoints), [waypoints, hikePoints]);
  const [openDayNumber, setOpenDayNumber] = useState<number | null>(1);

  const [trackedActiveWaypointId, setTrackedActiveWaypointId] = useState(activeWaypointId);
  if (activeWaypointId !== trackedActiveWaypointId) {
    setTrackedActiveWaypointId(activeWaypointId);
    setOpenDayNumber(findDayNumberForWaypoint(days, activeWaypointId) ?? 1);
  }

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-2">
        <div className="h-5 w-5 border-2 border-blaze border-t-transparent rounded-full animate-spin" />
        <p className="text-ink/40 text-sm font-medium">Chargement du parcours...</p>
      </div>
    );
  }

  if (waypoints.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-2 px-10 text-center">
        <svg className="w-8 h-8 text-stone-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.4 2.2V6.8L9 4.6m0 15.4l6-2.2m-6 2.2V4.6m6 13.2l5.4 2.2V4.6L15 6.8m0 11V6.8m0 0L9 4.6" />
        </svg>
        <p className="text-sm text-ink/40">Aucune étape enregistrée pour cette randonnée.</p>
      </div>
    );
  }

  return (
    <div
      className="h-full overflow-y-auto px-5 py-4 flex flex-col gap-4"
      style={{ scrollbarGutter: 'stable' }}
    >
      <HikeHeader activeHike={activeHike}/>

      <div className="flex flex-col gap-3">
        {days.map((day) => (
          <DaySection
            key={day.dayNumber}
            day={day}
            skipFirstWaypoint={day.dayNumber > 1}
            isOpen={openDayNumber === day.dayNumber}
            activeWaypointId={activeWaypointId}
            onToggle={() => setOpenDayNumber(openDayNumber === day.dayNumber ? null : day.dayNumber)}
            onSelectWaypoint={onSelect}
          />
        ))}
      </div>
    </div>
  );
}
