// src/app/upload/_components/ElevationChart.tsx
'use client';

import { formatDistance } from '@/lib/geo';
import { HikePoint } from '@/types/hike-types';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
  ReferenceLine,
} from 'recharts';

interface ElevationChartProps {
  data: HikePoint[];
  handleMouseMove?: (e?: any) => void;
  handleMouseLeave?: (e?: any) => void;
  handleMouseDown?: (e?: any) => void;
  handleMouseUp?: (e?: any) => void;
  children?: React.ReactNode;
}

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
      <AreaChart
        data={data}
        margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
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
        <Tooltip
          contentStyle={{
            background: '#fff',
            border: '1px solid #e7e5e4',
            borderRadius: '8px',
            fontSize: '11px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          }}
          labelFormatter={(value) => `${formatDistance(Number(value) / 1000)} km`}
          formatter={(value: any) => [`${value} m`, 'Altitude']}
        />

        {/* The actual drawn area layer */}
        <Area
          type="monotone"
          dataKey="elevation"
          stroke="#2563eb"
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#elevationGradient)"
        />

        {children}

      </AreaChart>
    </ResponsiveContainer>
  );
}
