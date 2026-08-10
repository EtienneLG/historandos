'use client';

import { ReferenceDot, ReferenceLine } from 'recharts';
import BaseChart from '@/components/base-chart';
import { WaypointChartLine, WaypointChartPin } from '@/components/waypoint-chart';
import { useRef, useState } from 'react';
import { useUploadStore } from '@/stores/upload-store';
import { useResolvedWaypoints } from '@/stores/use-resolved-waypoints';

export default function ElevationChart() {
  const geometry = useUploadStore((s) => s.geometry);
  const hikePoints = useUploadStore((s) => s.hikePoints);
  const waypoints = useUploadStore((s) => s.waypoints);
  const resolvedWaypoints = useResolvedWaypoints(waypoints, hikePoints);

  const [draggingSplitterId, setDraggingSplitterId] = useState<string | null>(null);
  const lastValidIndexRef = useRef<number | null>(null);

  // Detect if the user clicked a close splitter
  const handleChartMouseDown = (nextSate: any, event: any) => {
    if (!nextSate || typeof nextSate.activeTooltipIndex === 'undefined') return;

    const clickedIndex = nextSate.activeTooltipIndex;

    const hitRadius = 15;
    const matchedWaypoint = waypoints.find(
      (s) => Math.abs(s.indexFromStart - clickedIndex) <= hitRadius
    );

    if (matchedWaypoint) {
      lastValidIndexRef.current = matchedWaypoint.indexFromStart;
      setDraggingSplitterId(matchedWaypoint.id);
    }
  };

  const handleCommitDrag = () => {
    if (!draggingSplitterId) return;

    if (lastValidIndexRef.current !== null) {
      //onUpdateSplitIndex(draggingSplitterId, Number(lastValidIndexRef.current));
      console.log("UPDATED");
    }
    setDraggingSplitterId(null);
    lastValidIndexRef.current = null;
  }

  // Release the drag lock
  const handleChartMouseUp = () => {
    handleCommitDrag();
  };

  // Detect the mouse leaving the chart
  const handleMouseLeave = () => {
    const event = new CustomEvent('trace-point-hover', { detail: null });
    window.dispatchEvent(event);

    handleCommitDrag();
  };

  // Detect point and update splitter location
  const handleMouseMove = (nextState: any) => {
    if (!nextState || typeof nextState.activeTooltipIndex === 'undefined') return;
    const currentHoverIndex = nextState.activeTooltipIndex;

    // Detect the current trace point hovering
    const event = new CustomEvent('trace-point-hover', { detail: currentHoverIndex });
    window.dispatchEvent(event);

    // Update the splitter location as the mouse moves
    if (!draggingSplitterId) return;

    // Safety check: ensure we don't drag a splitter past the ends of the master array
    if (currentHoverIndex > 0 && currentHoverIndex < hikePoints.length - 1) {
      lastValidIndexRef.current = currentHoverIndex;

      const pixelX = nextState.activeCoordinate.x;
      const lineElement = document.querySelector(`.splitter-line-${draggingSplitterId} line`);
      if (lineElement) {
        lineElement.setAttribute('x1', pixelX.toString());
        lineElement.setAttribute('x2', pixelX.toString());
      }
      const labelElement = document.querySelector(`.splitter-line-${draggingSplitterId} text`);
      if (labelElement) {
        labelElement.setAttribute('x', pixelX.toString());
      }

      const event = new CustomEvent('trace-splitter-move', {
        detail: {
          id: draggingSplitterId,
          currentHoverIndex
        }
      });
      window.dispatchEvent(event);
    }
  };

  return (
    <div className={`w-full h-full p-3 flex flex-col select-none [&_*]:select-none justify-between ${draggingSplitterId ? 'cursor-ew-resize' : 'cursor-default'
      }`}>
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
                  waypoint={waypoint}
                  isActive={false}
                  onSelect={() => { }}
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
                  waypoint={waypoint}
                  isActive={false}
                  onSelect={() => { }}
                />
              )}
            />
          ))}
        </BaseChart>
      </div>
    </div>
  );
}
