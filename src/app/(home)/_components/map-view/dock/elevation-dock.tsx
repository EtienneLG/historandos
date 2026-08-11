'use client';

import { useMemo } from 'react';
import { ReferenceDot, ReferenceLine } from 'recharts';
import BaseChart from '@/components/base-chart';
import { WaypointChartLine, WaypointChartPin } from '@/components/waypoint-chart';
import { buildDayNumberIndex, DaySegment } from '@/lib/day-segments';
import { downsampleForChart } from '@/lib/geo';
import { DOCK_COLLAPSED_HEIGHT_PX, DOCK_HEIGHT_PX, PANEL_WIDTH_PX } from '@/lib/waypoints';
import { useUIStore } from '@/stores/ui-store';
import { HikePoint, ResolvedWaypoint } from '@/types/hike-types';

/**
 * Max number of points fed to the elevation chart. GPX tracks can hold thousands of
 * raw coordinates; recharts recomputes the full SVG path on every re-render (e.g. on
 * every waypoint/day selection), which becomes very costly at full resolution. This
 * only affects the chart's backing series — map layers, stats and waypoint placement
 * all keep using the full-resolution `hikePoints`.
 */
const CHART_MAX_POINTS = 600;

interface ElevationDockProps {
  hikePoints: HikePoint[];
  waypoints: ResolvedWaypoint[];
  days: DaySegment[];
  loading: boolean;
}

export function ElevationDock({ hikePoints, waypoints, days, loading }: ElevationDockProps) {
  const dockCollapsed = useUIStore((s) => s.dockCollapsed);
  const toggleDockCollapsed = useUIStore((s) => s.toggleDockCollapsed);
  const selectWaypoint = useUIStore((s) => s.selectWaypoint);

  const dayNumberByWaypointId = useMemo(() => buildDayNumberIndex(days), [days]);
  // Computed once per hike (keyed on the stable hikePoints reference), not on every
  // waypoint/day selection re-render.
  const chartPoints = useMemo(() => downsampleForChart(hikePoints, CHART_MAX_POINTS), [hikePoints]);

  const handleSelectWaypoint = (id: string) => {
    selectWaypoint(id, dayNumberByWaypointId.get(id) ?? null);
  };

  // Kept stable across re-renders (only depends on `waypoints`), so recharts doesn't
  // treat these as brand-new children (and redo layout) on every unrelated re-render.
  const waypointLines = useMemo(
    () =>
      waypoints.map((waypoint) => (
        <ReferenceLine
          key={waypoint.id}
          x={waypoint.distanceFromStartM}
          ifOverflow="visible"
          shape={(props) => (
            <WaypointChartLine {...props} waypoint={waypoint} onSelect={handleSelectWaypoint} />
          )}
        />
      )),
    [waypoints],
  );

  const waypointPins = useMemo(
    () =>
      waypoints.map((waypoint) => (
        <ReferenceDot
          key={waypoint.id}
          x={waypoint.distanceFromStartM}
          y={waypoint.elevation}
          yAxisId={0}
          ifOverflow="visible"
          shape={(props) => (
            <WaypointChartPin {...props} waypoint={waypoint} onSelect={handleSelectWaypoint} />
          )}
        />
      )),
    [waypoints],
  );

  // Bridges the chart hover to the map marker (listened to in map-inner). Dispatches the
  // actual hovered point (not its index) since `chartPoints` is a downsampled view of
  // `hikePoints` and indices between the two arrays don't line up.
  const handleMouseMove = (e?: { activeTooltipIndex?: number }) => {
    if (e && e.activeTooltipIndex !== undefined) {
      const point = chartPoints[e.activeTooltipIndex] ?? null;
      window.dispatchEvent(new CustomEvent('trace-point-hover', { detail: point }));
    }
  };

  const handleMouseLeave = () => {
    window.dispatchEvent(new CustomEvent('trace-point-hover', { detail: null }));
  };

  return (
    <div
      className="absolute bottom-0 left-0 z-10 pointer-events-auto bg-parchment-light/95 backdrop-blur-md border-t border-stone shadow-2xl transition-[height] duration-300 ease-out flex flex-col"
      style={{
        right: PANEL_WIDTH_PX,
        height: dockCollapsed ? DOCK_COLLAPSED_HEIGHT_PX : DOCK_HEIGHT_PX,
      }}
    >
      {/* Header strip */}
      <div
        className="flex items-center justify-between px-5 shrink-0"
        style={{ height: DOCK_COLLAPSED_HEIGHT_PX }}
      >
        <h3 className="font-display text-xs uppercase tracking-widest text-pine/60">
          Profil altimétrique
        </h3>

        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] text-ink/40 font-medium">m / km</span>
          <button
            onClick={toggleDockCollapsed}
            className="text-ink/40 hover:text-pine hover:bg-stone/50 p-1 rounded-lg transition-all duration-200 cursor-pointer"
            aria-label={dockCollapsed ? 'Déplier le profil' : 'Replier le profil'}
            aria-expanded={!dockCollapsed}
          >
            <svg
              className={`w-4 h-4 transition-transform duration-300 ${dockCollapsed ? '' : 'rotate-180'}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Chart body */}
      {!dockCollapsed && (
        <div className="flex-1 min-h-0 px-5 pb-3">
          {loading || hikePoints.length === 0 ? (
            <div className="h-full flex items-center justify-center gap-2">
              <div className="h-4 w-4 border-2 border-blaze border-t-transparent rounded-full animate-spin" />
              <p className="text-ink/40 text-sm font-medium">Chargement du tracé...</p>
            </div>
          ) : (
            <div className="h-full w-full bg-stone/20 rounded-2xl p-2 border border-stone">
              <BaseChart
                data={chartPoints}
                handleMouseMove={handleMouseMove}
                handleMouseLeave={handleMouseLeave}
              >
                {waypointLines}
                {waypointPins}
              </BaseChart>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
