import { PanelTabs } from './panel/panel-tabs';
import { PhotosTab } from './panel/photos-tab';
import { WaypointsTab } from './panel/waypoints-tab';
import { PANEL_WIDTH_PX } from '@/lib/waypoints';
import { useUIStore } from '@/stores/ui-store';
import { HikePoint, HikeSummary, ResolvedWaypoint } from '@/types/hike-types';

interface HUDPanelProps {
  activeHike: HikeSummary;
  loading: boolean;
  waypoints: ResolvedWaypoint[];
  hikePoints: HikePoint[];
  onClose: () => void;
}

export function HUDPanel({ activeHike, loading, waypoints, hikePoints, onClose }: HUDPanelProps) {
  const panelTab = useUIStore((s) => s.panelTab);
  const setPanelTab = useUIStore((s) => s.setPanelTab);
  const activeWaypointId = useUIStore((s) => s.activeWaypointId);
  const setActiveWaypointId = useUIStore((s) => s.setActiveWaypointId);

  return (
    <div
      className="pointer-events-auto h-full bg-parchment-light/95 backdrop-blur-md shadow-2xl border-l border-stone flex flex-col font-sans text-ink"
      style={{ width: PANEL_WIDTH_PX }}
    >
      <PanelTabs
        activeTab={panelTab}
        waypointCount={waypoints.length}
        onChange={setPanelTab}
        onClose={onClose}
      />

      {/* Tab bodies own their scroll context; the photos tab stays mounted so
          already-loaded photos and the scroll position survive tab switches. */}
      <div className="flex-1 min-h-0">
        <div className={`h-full ${panelTab === 'waypoints' ? 'block' : 'hidden'}`}>
          <WaypointsTab
            waypoints={waypoints}
            hikePoints={hikePoints}
            activeWaypointId={activeWaypointId}
            activeHike={activeHike}
            loading={loading}
            onSelect={setActiveWaypointId}
          />
        </div>

        <div className={`h-full ${panelTab === 'photos' ? 'block' : 'hidden'}`}>
          <PhotosTab photoDirId={activeHike.photoDirId} />
        </div>
      </div>
    </div>
  );
}
