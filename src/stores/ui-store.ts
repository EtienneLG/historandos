import { create } from 'zustand';

export type TabView = 'list' | 'map';

interface UIState {
    activeTab: TabView;
    activeHikeId: string | null;
    setActiveTab: (tab: TabView) => void;
    setActiveHikeId: (id: string | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
    activeTab: 'list',
    activeHikeId: null,
    setActiveTab: (tab) => set({ activeTab: tab }),
    setActiveHikeId: (id) => set({ activeHikeId: id })
}))