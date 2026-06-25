import { Trace } from '@/types/trace';
import dynamic from "next/dynamic";

interface MapViewProps {
  traces: Trace[];
  activeTrace: Trace | null;
  setActiveTrace: (trace: Trace | null) => void;
  traceGeoJson: any;
  loading: boolean;
  metrics: any;
}

const MapInner = dynamic(() => import("./map-inner"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-100 flex items-center justify-center">
      <div className="text-center animate-pulse">
        <p className="text-gray-500 font-medium">Initializing Map Engine...</p>
      </div>
    </div>
  ),
});

export default function MapViewWrapper({ traces, activeTrace, setActiveTrace, traceGeoJson, loading, metrics }: MapViewProps) {
  return (
    <div className="w-full h-full relative">
      <MapInner 
        traces={traces} 
        activeTrace={activeTrace} 
        setActiveTrace={setActiveTrace} 
        traceGeoJson={traceGeoJson} 
        loading={loading} 
        metrics={metrics} 
      />
    </div>
  );
}