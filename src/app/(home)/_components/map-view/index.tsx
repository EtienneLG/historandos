import { HikeSummary } from '@/types/hike-types';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

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
  // `bfcacheId` changes on fresh push/replace navigations (e.g. Ajouter une
  // rando -> Annuler/submit -> home) but stays stable across back/forward
  // navigations. Keying on it forces the Mapbox map subtree to fully
  // unmount/remount on fresh navigations instead of being hidden/reconnected
  // in place by Next.js's Activity-based route cache: Mapbox GL's imperative
  // Marker/Map effects otherwise race during reconnect (Marker.addTo() can
  // run against a destroyed/not-yet-ready map instance), causing a crash.
  const { bfcacheId } = useRouter();

  return (
    <div className="w-full h-full relative">
      {/* Map */}
      <MapInner key={bfcacheId} hikes={hikes} />
    </div>
  );
}
