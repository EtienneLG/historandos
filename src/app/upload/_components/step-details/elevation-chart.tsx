'use client';

import { useCallback, useRef, useState } from 'react';
import { ReferenceDot, ReferenceLine } from 'recharts';
import BaseChart from '@/components/base-chart';
import { WaypointChartLine, WaypointChartPin } from '@/components/waypoint-chart';
import { useUploadStore } from '@/stores/upload-store';
import { useResolvedWaypoints } from '@/stores/use-resolved-waypoints';
import { WaypointCategory } from '@/types/hike-types';

/** Waypoint categories whose position on the trace is fixed and cannot be dragged. */
const LOCKED_CATEGORIES: WaypointCategory[] = ['start', 'end'];

interface WaypointNodes {
  line: SVGGElement | null;
  dot: SVGGElement | null;
}

export default function ElevationChart() {
  const hikePoints = useUploadStore((s) => s.hikePoints);
  const waypoints = useUploadStore((s) => s.waypoints);
  const updateWaypoint = useUploadStore((s) => s.updateWaypoint);
  const activeWaypointId = useUploadStore((s) => s.activeWaypointId);
  const setActiveWaypointId = useUploadStore((s) => s.setActiveWaypointId);
  const resolvedWaypoints = useResolvedWaypoints(waypoints, hikePoints);

  const [draggingSplitterId, setDraggingSplitterId] = useState<string | null>(null);
  const lastValidIndexRef = useRef<number | null>(null);
  // Pixel X of the click that started the drag, used to compute how far the cursor has moved.
  const dragStartPixelXRef = useRef<number | null>(null);
  // Every waypoint's rendered <g> nodes, so a drag can mutate only the dragged one directly
  // (via refs, not a global document query) without going through React state/re-render — this
  // keeps mousemove from re-rendering the whole chart on every frame.
  const waypointNodesRef = useRef<Map<string, WaypointNodes>>(new Map());

  const getNodes = (id: string): WaypointNodes => {
    let nodes = waypointNodesRef.current.get(id);
    if (!nodes) {
      nodes = { line: null, dot: null };
      waypointNodesRef.current.set(id, nodes);
    }
    return nodes;
  };

  // Detect if the user clicked a nearby, draggable splitter.
  const handleChartMouseDown = useCallback(
    (nextState: any) => {
      if (!nextState || typeof nextState.activeTooltipIndex === 'undefined') return;

      const clickedIndex = nextState.activeTooltipIndex;

      const hitRadius = 15;
      const matchedWaypoint = waypoints.find(
        (w) =>
          !LOCKED_CATEGORIES.includes(w.category) &&
          Math.abs(w.indexFromStart - clickedIndex) <= hitRadius,
      );

      if (matchedWaypoint) {
        lastValidIndexRef.current = matchedWaypoint.indexFromStart;
        dragStartPixelXRef.current = nextState.activeCoordinate?.x ?? null;
        setDraggingSplitterId(matchedWaypoint.id);
      }
    },
    [waypoints],
  );

  // Persist the dragged waypoint's new position, if any, and release the drag lock.
  const handleCommitDrag = useCallback(() => {
    if (draggingSplitterId) {
      // Clear the imperative preview transform: React never knew about it, so it won't clean it
      // up on its own even once the upcoming state update re-renders with the committed position.
      const nodes = waypointNodesRef.current.get(draggingSplitterId);
      nodes?.line?.removeAttribute('transform');
      nodes?.dot?.removeAttribute('transform');

      if (lastValidIndexRef.current !== null) {
        updateWaypoint(draggingSplitterId, { indexFromStart: Number(lastValidIndexRef.current) });
      }
    }
    setDraggingSplitterId(null);
    dragStartPixelXRef.current = null;
    lastValidIndexRef.current = null;
  }, [draggingSplitterId, updateWaypoint]);

  // Release the drag lock.
  const handleChartMouseUp = useCallback(() => {
    handleCommitDrag();
  }, [handleCommitDrag]);

  // Detect the mouse leaving the chart.
  const handleMouseLeave = useCallback(() => {
    const event = new CustomEvent('trace-point-hover', { detail: null });
    window.dispatchEvent(event);

    handleCommitDrag();
  }, [handleCommitDrag]);

  // Bridge the hovered trace point to the map marker, and move the dragged splitter's pin/line.
  const handleMouseMove = useCallback(
    (nextState: any) => {
      if (!nextState || typeof nextState.activeTooltipIndex === 'undefined') return;
      const currentHoverIndex = nextState.activeTooltipIndex;

      // Detect the current trace point hovering
      const event = new CustomEvent('trace-point-hover', { detail: currentHoverIndex });
      window.dispatchEvent(event);

      if (!draggingSplitterId || dragStartPixelXRef.current === null) return;

      // Safety check: ensure we don't drag a splitter past the ends of the master array
      if (currentHoverIndex > 0 && currentHoverIndex < hikePoints.length - 1) {
        lastValidIndexRef.current = currentHoverIndex;

        const pixelX = nextState.activeCoordinate?.x;
        if (typeof pixelX !== 'number') return;

        // Move the dragged splitter's line/pin directly via a plain SVG transform — no state
        // update, no re-render, so the whole chart isn't recomputed on every mousemove.
        const delta = pixelX - dragStartPixelXRef.current;
        const nodes = waypointNodesRef.current.get(draggingSplitterId);
        const transform = `translate(${delta} 0)`;
        nodes?.line?.setAttribute('transform', transform);
        nodes?.dot?.setAttribute('transform', transform);
      }
    },
    [draggingSplitterId, hikePoints.length],
  );

  return (
    <div
      className={`w-full h-full p-3 flex flex-col select-none [&_*]:select-none justify-between ${
        draggingSplitterId ? 'cursor-ew-resize' : 'cursor-default'
      }`}
    >
      {/* Tiny Header Context */}
      <div className="flex justify-between items-center px-2 mb-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
          Profil d'élévation (km / m)
        </span>
      </div>

      {/* Recharts Container */}
      <div className="flex-1 w-full h-full min-h-0">
        <BaseChart
          data={hikePoints}
          handleMouseDown={handleChartMouseDown}
          handleMouseUp={handleChartMouseUp}
          handleMouseMove={handleMouseMove}
          handleMouseLeave={handleMouseLeave}
        >
          {resolvedWaypoints.map((waypoint) => (
            <ReferenceLine
              key={waypoint.id}
              x={waypoint.distanceFromStartM}
              ifOverflow="visible"
              shape={(props) => (
                <WaypointChartLine
                  {...props}
                  groupRef={(node) => {
                    getNodes(waypoint.id).line = node;
                  }}
                  waypoint={waypoint}
                  isActive={activeWaypointId === waypoint.id}
                  onSelect={setActiveWaypointId}
                />
              )}
            />
          ))}
          {resolvedWaypoints.map((waypoint) => (
            <ReferenceDot
              key={waypoint.id}
              x={waypoint.distanceFromStartM}
              y={waypoint.elevation}
              yAxisId={0}
              ifOverflow="visible"
              shape={(props) => (
                <WaypointChartPin
                  {...props}
                  groupRef={(node) => {
                    getNodes(waypoint.id).dot = node;
                  }}
                  waypoint={waypoint}
                  isActive={activeWaypointId === waypoint.id}
                  onSelect={setActiveWaypointId}
                />
              )}
            />
          ))}
        </BaseChart>
      </div>
    </div>
  );
}
