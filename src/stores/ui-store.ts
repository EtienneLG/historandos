import { create } from 'zustand';

export type TabView = 'list' | 'map';
export type PanelTab = 'waypoints' | 'photos';

interface UIState {
  activeTab: TabView;
  activeHikeId: string | null;
  panelTab: PanelTab;
  activeWaypointId: string | null;
  activeDayNumber: number | null;
  dockCollapsed: boolean;
  setActiveTab: (tab: TabView) => void;
  setActiveHikeId: (id: string | null) => void;
  setPanelTab: (tab: PanelTab) => void;
  setActiveWaypointId: (id: string | null) => void;
  setActiveDayNumber: (day: number | null) => void;
  selectWaypoint: (id: string | null, dayNumber: number | null) => void;
  toggleDockCollapsed: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  activeTab: 'list',
  activeHikeId: null,
  panelTab: 'waypoints',
  activeWaypointId: null,
  activeDayNumber: null,
  dockCollapsed: false,
  setActiveTab: (tab) => set({ activeTab: tab }),
  // Selecting another hike invalidates every panel/waypoint/day selection.
  setActiveHikeId: (id) =>
    set({ activeHikeId: id, panelTab: 'waypoints', activeWaypointId: null, activeDayNumber: null }),
  setPanelTab: (tab) => set({ panelTab: tab }),
  setActiveWaypointId: (id) => set({ activeWaypointId: id }),
  setActiveDayNumber: (day) => set({ activeDayNumber: day }),
  selectWaypoint: (id, dayNumber) => set({ activeWaypointId: id, activeDayNumber: dayNumber }),
  toggleDockCollapsed: () => set((s) => ({ dockCollapsed: !s.dockCollapsed })),
}));
