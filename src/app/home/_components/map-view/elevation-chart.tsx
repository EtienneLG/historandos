import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TracePoint } from '@/types/trace';

interface ElevationChartProps {
    profile: TracePoint[];
    setActivePoint: (point: TracePoint | null) => void;
}

const CleanTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-900/95 backdrop-blur-md text-white px-3 py-2 rounded-xl text-xs shadow-xl border border-slate-800 flex flex-col gap-0.5 animate-in fade-in duration-200">
                <span className="font-semibold text-slate-200">{payload[0].value} m elevation</span>
                <span className="text-slate-400 text-[10px]">At {payload[0].payload.distance} km</span>
            </div>
        );
    }
    return null;
};

export function ElevationChart({ profile, setActivePoint }: ElevationChartProps) {
    const chartData = profile.map(({ distance, elevation }) => ({ distance, elevation }));

    return (
        <div className="flex flex-col border-t border-slate-100 pt-5">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Elevation Profile</h3>
                <span className="text-[11px] text-slate-400 font-medium">m / km</span>
            </div>

            {/* Fixed height wrapper makes sure chart scales correctly inside scrolling container */}
            <div className="h-56 w-full bg-slate-50/40 rounded-2xl p-2 border border-slate-100/60">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={chartData}
                        margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                        onMouseMove={(state) => {
                            const activeTooltipIndex = state.activeTooltipIndex;
                            console.log('Active Point:', activeTooltipIndex);
                            if (state.isTooltipActive && typeof activeTooltipIndex === 'string') {
                                setActivePoint(profile[Number(activeTooltipIndex)]);
                            }
                        }}
                        onMouseLeave={() => setActivePoint(null)}
                    >
                        <CartesianGrid vertical={false} stroke="#f1f5f9" strokeDasharray="4" />
                        <XAxis
                            dataKey="distance"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 500 }}
                            dy={8}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 500 }}
                            domain={['dataMin - 20', 'dataMax + 20']}
                        />
                        <Tooltip content={<CleanTooltip />} cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }} />
                        <Line
                            type="monotone"
                            dataKey="elevation"
                            stroke="#6366f1"
                            strokeWidth={2.5}
                            dot={false}
                            activeDot={{ r: 5, strokeWidth: 0, fill: '#4f46e5' }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}