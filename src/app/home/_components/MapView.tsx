"use client";

import { Trace } from '@/types/trace';
import dynamic from "next/dynamic";

interface MapViewProps {
  traces: Trace[];
}

const MapInner = dynamic(() => import("./MapInner"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-100 flex items-center justify-center">
      <div className="text-center animate-pulse">
        <p className="text-gray-500 font-medium">Initializing Map Engine...</p>
      </div>
    </div>
  ),
});

export default function MapView({ traces }: MapViewProps) {
  return (
    <div className="w-full h-full relative">
      <MapInner traces={traces} />
    </div>
  );
}