import { HikePoint, Waypoint } from "@/types/hike-types";
import { GeoJSONGeometry } from "zod-geojson";
import { create } from "zustand";

export type UploadStep = 'drop' | 'global' | 'details';

const STEP_ORDER: UploadStep[] = ['drop', 'global', 'details'];

interface UploadState {
  currentStep: UploadStep;
  isProcessing: string | null;

  // Step 1: Drop state
  geometry: GeoJSONGeometry | null;
  hikePoints: HikePoint[];

  // Step 2: Global data
  title: string;
  description: string;
  date: string;
  people: string[];
  photoDirId: number;

  // Step 3: Hike details
  waypoints: Waypoint[];
  activeWaypointId: string | null;

  // Actions
  setIsProcessing: (isProcessing: string | null) => void;
  goToNextStep: () => void;
  goToPrevStep: () => void;
  setGeometry: (geometry: GeoJSONGeometry | null) => void;
  setHikePoints: (hikePoints: HikePoint[]) => void;
  setGlobalData: (data: Partial<Pick<UploadState, 'title' | 'description' | 'date' | 'people' | 'photoDirId'>>) => void;
  setWaypoints: (waypoints: Waypoint[]) => void;
  addWaypoint: (waypoint: Waypoint) => void;
  updateWaypoint: (id: string, fields: Partial<Waypoint>) => void;
  removeWaypoint: (id: string) => void;
  setActiveWaypointId: (id: string | null) => void;
  reset: () => void;
}

const initialState = {
  currentStep: 'drop' as UploadStep,
  isProcessing: null,
  geometry: null,
  hikePoints: [],
  title: 'Hike',
  description: '',
  date: '2026-08-10',
  people: [],
  photoDirId: 0,
  waypoints: [],
  activeWaypointId: null,
};

export const useUploadStore = create<UploadState>((set) => ({
  ...initialState,

  setIsProcessing: (isProcessing: string | null) => set({ isProcessing: isProcessing }),

  goToNextStep: () => set((state) => {
    const currentIndex = STEP_ORDER.indexOf(state.currentStep);
    const nextStep = STEP_ORDER[currentIndex + 1] ?? state.currentStep;
    return { currentStep: nextStep };
  }),

  goToPrevStep: () => set((state) => {
    const currentIndex = STEP_ORDER.indexOf(state.currentStep);
    const prevStep = STEP_ORDER[currentIndex - 1] ?? state.currentStep;
    return { currentStep: prevStep };
  }),

  setGeometry: (geometry) => set({ geometry }),

  setHikePoints: (hikePoints) => set({ hikePoints }),

  setGlobalData: (data) => set((state) => ({ ...state, ...data })),

  setWaypoints: (waypoints) => set({ waypoints }),

  addWaypoint: (waypoint) => set((state) => ({ waypoints: [...state.waypoints, waypoint] })),

  updateWaypoint: (id, fields) => set((state) => ({
    waypoints: state.waypoints.map((w) => (w.id === id ? { ...w, ...fields } : w)),
  })),

  removeWaypoint: (id) => set((state) => ({
    waypoints: state.waypoints.filter((w) => w.id !== id),
  })),

  setActiveWaypointId: (id) => set({ activeWaypointId: id }),

  reset: () => set(initialState),
}))
