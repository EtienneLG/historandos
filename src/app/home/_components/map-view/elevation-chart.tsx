import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TracePoint } from '@/types/trace';

interface ElevationChartProps {
    profile: TracePoint[];
}

const CleanTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-pine-dark/95 backdrop-blur-md text-parchment-light px-3 py-2 rounded-xl text-xs shadow-xl border border-pine flex flex-col gap-0.5 animate-in fade-in duration-200">
                <span className="font-mono font-semibold text-parchment">{payload[0].value} m elevation</span>
                <span className="font-mono text-stone text-[10px]">At {payload[0].payload.distance} km</span>
            </div>
        );
    }
    return null;
};

export function ElevationChart({ profile }: ElevationChartProps) {
    const chartData = profile.map(({ distance, elevation }) => ({ distance, elevation }));

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
                <h3 className="font-display text-xs uppercase tracking-widest text-pine/60">Elevation Profile</h3>
                <span className="font-mono text-[11px] text-ink/40 font-medium">m / km</span>
            </div>
            {/* Fixed height wrapper makes sure chart scales correctly inside scrolling container */}
            <div className="h-56 w-full bg-stone/20 rounded-2xl p-2 border border-stone">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={chartData}
                        margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                    >
                        <defs>
                            <linearGradient id="elevationFill" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#2d4a3a" stopOpacity={0.25} />
                                <stop offset="100%" stopColor="#2d4a3a" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} stroke="#d9d2c0" strokeDasharray="4" />
                        <XAxis
                            dataKey="distance"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: '#8a8067', fontWeight: 500 }}
                            dy={8}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: '#8a8067', fontWeight: 500 }}
                            domain={['dataMin - 20', 'dataMax + 20']}
                        />
                        <Tooltip content={<CleanTooltip />} cursor={{ stroke: '#bfb6a0', strokeWidth: 1, strokeDasharray: '4 4' }} />
                        <Line
                            type="monotone"
                            dataKey="elevation"
                            stroke="#2d4a3a"
                            strokeWidth={2.5}
                            dot={false}
                            activeDot={{ r: 5, strokeWidth: 2, stroke: '#faf7ef', fill: '#6b9b3f' }}
                            fill="url(#elevationFill)"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}