import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { HikePoint } from '@/types/hike-types';
import BaseChart from '@/components/base-chart';

interface ElevationChartProps {
  hikePoints: HikePoint[];
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

export function ElevationChart({ hikePoints }: ElevationChartProps) {
  const handleMouseMove = (e: any) => {
    if (e && e.activeTooltipIndex !== undefined) {
      const event = new CustomEvent('trace-point-hover', { detail: e.activeTooltipIndex });
      window.dispatchEvent(event);
    }
  };

  const handleMouseLeave = () => {
    const event = new CustomEvent('trace-point-hover', { detail: null });
    window.dispatchEvent(event);
  };

  return (
    <div className="flex flex-col border-t border-stone pt-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display text-xs uppercase tracking-widest text-pine/60">Profil altimétrique</h3>
        <span className="font-mono text-[11px] text-ink/40 font-medium">m / km</span>
      </div>
      {/* Fixed height wrapper makes sure chart scales correctly inside scrolling container */}
      <div className="h-56 w-full bg-stone/20 rounded-2xl p-2 border border-stone">
        <BaseChart
          data={hikePoints}
          handleMouseMove={handleMouseMove}
          handleMouseLeave={handleMouseLeave}
        >
          <CartesianGrid vertical={false} stroke="#d9d2c0" strokeDasharray="4" />
        </BaseChart>
      </div>
    </div>
  );
}