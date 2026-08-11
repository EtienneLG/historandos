import type { Ref } from 'react';
import { getWaypointVisual } from '@/lib/waypoints';
import { useUIStore } from '@/stores/ui-store';
import { ResolvedWaypoint } from '@/types/hike-types';

interface WaypointChartPinProps {
  cx?: number;
  cy?: number;
  waypoint: ResolvedWaypoint;
  onSelect: (id: string) => void;
  /**
   * Optional override for the active state (e.g. the upload wizard, which tracks its own
   * `activeWaypointId` in a separate `useUploadStore` rather than `useUIStore`). When omitted,
   * falls back to reading `useUIStore` directly so a selection change only re-renders the (at
   * most two) pins/lines whose active flag actually flips, instead of the whole chart tree.
   */
  isActive?: boolean;
  /** Exposes the underlying `<g>` node so a drag interaction can mutate its position directly (no re-render). */
  groupRef?: Ref<SVGGElement>;
}

/** Small colored dot marking a waypoint's position on the elevation chart. */
export function WaypointChartPin({ cx, cy, waypoint, onSelect, groupRef, isActive: isActiveProp }: WaypointChartPinProps) {
  const isActiveFromStore = useUIStore((s) => s.activeWaypointId === waypoint.id);
  const isActive = isActiveProp ?? isActiveFromStore;

  if (cx === undefined || cy === undefined) return null;

  const visual = getWaypointVisual(waypoint);

  return (
    <g
      ref={groupRef}
      className="cursor-pointer"
      onClick={() => onSelect(waypoint.id)}
    >
      <title>{waypoint.name}</title>
      {/* Larger transparent hit area, easier to click/hover than the small dot itself. */}
      <circle cx={cx} cy={cy} r={10} fill="transparent" />
      <circle
        cx={cx}
        cy={cy}
        r={isActive ? 6 : 4.5}
        fill={visual.color}
        stroke="#faf7ef"
        strokeWidth={isActive ? 2.5 : 1.5}
      />
    </g>
  );
}

interface WaypointChartLineProps {
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  waypoint: ResolvedWaypoint;
  onSelect: (id: string) => void;
  /** See `WaypointChartPinProps.isActive`. */
  isActive?: boolean;
  /** Exposes the underlying `<g>` node so a drag interaction can mutate its position directly (no re-render). */
  groupRef?: Ref<SVGGElement>;
}

/** Thin dotted vertical line marking a waypoint's position along the elevation chart. */
export function WaypointChartLine({ x1, y1, y2, waypoint, onSelect, groupRef, isActive: isActiveProp }: WaypointChartLineProps) {
  const isActiveFromStore = useUIStore((s) => s.activeWaypointId === waypoint.id);
  const isActive = isActiveProp ?? isActiveFromStore;

  if (x1 === undefined || y1 === undefined || y2 === undefined) return null;

  const visual = getWaypointVisual(waypoint);

  return (
    <g ref={groupRef} className="cursor-pointer" onClick={() => onSelect(waypoint.id)}>
      <title>{waypoint.name}</title>
      {/* Wider transparent line, easier to click/hover than the thin dotted one. */}
      <line x1={x1} y1={y1} x2={x1} y2={y2} stroke="transparent" strokeWidth={10} />
      <line
        x1={x1}
        y1={y1}
        x2={x1}
        y2={y2}
        stroke={visual.color}
        strokeWidth={isActive ? 1.5 : 1}
        strokeDasharray="3 3"
        strokeOpacity={1}
      />
    </g>
  );
}
