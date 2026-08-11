import { HikeSummary } from '@/types/hike-types';
import dynamic from 'next/dynamic';

interface MapViewProps {
  hikes: HikeSummary[];
}

const MapInner = dynamic(() => import('./map-inner'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-100 flex items-center justify-center">
      <div className="text-center animate-pulse">
        <p className="text-gray-500 font-medium">Initializing Map Engine...</p>
      </div>
    </div>
  ),
});

export default function MapViewWrapper({ hikes }: MapViewProps) {
  return (
    <div className="w-full h-full relative">
      {/* Map */}
      <MapInner hikes={hikes} />
    </div>
  );
}
