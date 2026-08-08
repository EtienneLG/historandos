// src/app/upload/_components/ElevationChart.tsx
'use client';

import { formatDistance } from '@/lib/geo';
import { HikePoint } from '@/types/hike-types';
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface ElevationChartProps {
  data: HikePoint[];
  handleMouseMove?: (e?: any) => void;
  handleMouseLeave?: (e?: any) => void;
  handleMouseDown?: (e?: any) => void;
  handleMouseUp?: (e?: any) => void;
  children?: React.ReactNode;
}

const CleanTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-pine-dark/95 backdrop-blur-md text-parchment-light px-3 py-2 rounded-xl text-xs shadow-xl border border-pine flex flex-col gap-0.5 animate-in fade-in duration-200">
        <span className="font-mono font-semibold text-parchment">{payload[0].value} m d'altitude</span>
        <span className="font-mono text-stone text-[10px]">À {payload[0].payload.distance} km</span>
      </div>
    );
  }
  return null;
};

export default function BaseChart({
  data,
  handleMouseMove,
  handleMouseLeave,
  handleMouseDown,
  handleMouseUp,
  children
}: ElevationChartProps) {
  // The total distance of the trace
  const maxDistance = data.length > 0
    ? Math.ceil(data[data.length - 1].distanceFromStartM)
    : 0;

  // Create the tick array
  const step = maxDistance > 30000 ? (maxDistance > 60000 ? 2000 : 1000) : 500;
  const kilometerTicks = [];
  for (let i = 0; i <= maxDistance; i += step) {
    kilometerTicks.push(i);
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        data={data}
        margin={{ top: 5, right: 10, left: -35, bottom: -15 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        <defs>
          {/* Clean gradient fill for the mountain area */}
          <linearGradient id="elevationGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
          </linearGradient>
        </defs>

        {/* X-Axis: Distance */}
        <XAxis
          dataKey="distanceFromStartM"
          tickLine={false}
          axisLine={false}
          type="number"
          domain={[0, 'dataMax']}
          ticks={kilometerTicks}
          interval={0}
          tick={{ fontSize: 10, fill: '#78716c' }}
          tickFormatter={(value: number) => formatDistance(Math.ceil(value / 100) / 10)}
        />

        {/* Y-Axis: Altitude */}
        <YAxis
          domain={['dataMin - 20', 'dataMax + 20']}
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 10, fill: '#78716c' }}
        />

        {/* Clean Minimal Tooltip */}
        <Tooltip content={<CleanTooltip />} cursor={{ stroke: '#bfb6a0', strokeWidth: 1, strokeDasharray: '4 4' }} />

        {/*
          The fill is rendered statically (no animation): Recharts animates Area via a
          per-frame clipPath resize, which forces an expensive repaint of the whole
          gradient region every frame. That gets starved under main-thread contention
          (e.g. photos loading), making it "snap" instead of animating smoothly.
        */}
        <Area
          type="monotone"
          dataKey="elevation"
          stroke="none"
          fillOpacity={1}
          fill="url(#elevationGradient)"
          isAnimationActive={false}
          legendType="none"
          tooltipType="none"
          activeDot={false}
        />

        {/*
          The line does the animated "drawing in" reveal via strokeDasharray, which is
          cheap to repaint and stays smooth/continuous even if frames are dropped.
        */}
        <Line
          type="monotone"
          dataKey="elevation"
          stroke="#2563eb"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 5, strokeWidth: 2, stroke: '#faf7ef', fill: '#2563eb' }}
          legendType="none"
        />

        {children}

      </ComposedChart>
    </ResponsiveContainer>
  );
}
