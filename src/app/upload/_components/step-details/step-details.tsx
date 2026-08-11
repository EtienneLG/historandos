'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUploadStore } from '@/stores/upload-store';
import { useResolvedWaypoints } from '@/stores/use-resolved-waypoints';
import { Waypoint } from '@/types/hike-types';
import WaypointCard from './waypoint-card';

export default function StepDetails() {
  const router = useRouter();

  const hikePoints = useUploadStore((s) => s.hikePoints);
  const waypoints = useUploadStore((s) => s.waypoints);
  const addWaypoint = useUploadStore((s) => s.addWaypoint);
  const updateWaypoint = useUploadStore((s) => s.updateWaypoint);
  const removeWaypoint = useUploadStore((s) => s.removeWaypoint);
  const goToPrevStep = useUploadStore((s) => s.goToPrevStep);
  const activeWaypointId = useUploadStore((s) => s.activeWaypointId);
  const setActiveWaypointId = useUploadStore((s) => s.setActiveWaypointId);
  const isProcessing = useUploadStore((s) => s.isProcessing);
  const setIsProcessing = useUploadStore((s) => s.setIsProcessing);
  const reset = useUploadStore((s) => s.reset);

  const resolvedWaypoints = useResolvedWaypoints(waypoints, hikePoints);

  // Ensure the track always has a fixed start & end waypoint the moment this step is reached.
  useEffect(() => {
    if (hikePoints.length === 0) return;

    const currentWaypoints = useUploadStore.getState().waypoints;
    const hasStart = currentWaypoints.some((w) => w.category === 'start');
    const hasEnd = currentWaypoints.some((w) => w.category === 'end');

    if (!hasStart) {
      addWaypoint({
        id: crypto.randomUUID(),
        category: 'start',
        name: 'Départ',
        description: null,
        indexFromStart: 0,
        accommodationType: null,
        poiType: null,
      });
    }

    if (!hasEnd) {
      addWaypoint({
        id: crypto.randomUUID(),
        category: 'end',
        name: 'Arrivée',
        description: null,
        indexFromStart: hikePoints.length - 1,
        accommodationType: null,
        poiType: null,
      });
    }
    // Only run once hikePoints becomes available.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hikePoints.length]);

  const handleToggle = (id: string) => {
    setActiveWaypointId(activeWaypointId === id ? null : id);
  };

  const handleAddWaypoint = () => {
    if (hikePoints.length === 0) return;

    const newWaypoint: Waypoint = {
      id: crypto.randomUUID(),
      category: 'poi',
      name: '',
      description: null,
      indexFromStart: Math.floor(hikePoints.length / 2),
      accommodationType: null,
      poiType: 'other',
    };

    addWaypoint(newWaypoint);
    setActiveWaypointId(newWaypoint.id);
  };

  const handleSave = async () => {
    const state = useUploadStore.getState();

    if (!state.geometry) {
      alert("Aucun tracé n'a été chargé.");
      return;
    }

    setIsProcessing('Enregistrement du parcours');

    try {
      const response = await fetch('/api/hikes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: state.title,
          description: state.description,
          date: state.date,
          people: state.people,
          photoDirId: state.photoDirId,
          geometry: state.geometry,
          waypoints: state.waypoints.map(({ id: _id, ...rest }) => rest),
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(
          data?.error ? JSON.stringify(data.error) : "Échec de l'enregistrement du parcours",
        );
      }

      reset();
      router.push('/');
    } catch (error) {
      alert(error instanceof Error ? error.message : "Erreur lors de l'enregistrement du parcours");
      setIsProcessing(null);
    }
  };

  return (
    <div className="h-full flex flex-col justify-between">
      {/* Scrollable waypoint list */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-4 pb-6">
        <div>
          <h2 className="text-lg font-bold text-ink mb-1">Points du parcours</h2>
          <p className="text-xs text-ink/60">
            Ajoutez vos étapes, hébergements et points d&apos;intérêt. Leur position sur le tracé se
            règle depuis le profil d&apos;élévation.
          </p>
        </div>

        <hr className="border-stone/40" />

        <div className="space-y-3">
          {resolvedWaypoints.map((waypoint) => (
            <WaypointCard
              key={waypoint.id}
              waypoint={waypoint}
              isLocked={waypoint.category === 'start' || waypoint.category === 'end'}
              isOpen={activeWaypointId === waypoint.id}
              onToggle={() => handleToggle(waypoint.id)}
              onUpdate={(fields) => updateWaypoint(waypoint.id, fields)}
              onRemove={() => removeWaypoint(waypoint.id)}
            />
          ))}
        </div>

        {/* Add waypoint button */}
        <button
          type="button"
          onClick={handleAddWaypoint}
          className="w-full flex items-center justify-center gap-1.5 py-2.5 text-sm font-semibold border border-dashed rounded-xl transition-all text-pine border-pine/40 hover:bg-pine/5"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Ajouter un point
        </button>
      </div>

      {/* Sticky bottom actions */}
      <div className="flex gap-3 pt-4 border-t border-stone/30 mt-auto bg-white">
        <button
          type="button"
          onClick={goToPrevStep}
          className="px-4 py-2 text-sm font-semibold border border-stone text-ink/75 rounded-xl hover:bg-stone/5 transition-colors shrink-0"
        >
          Retour
        </button>

        <button
          type="button"
          onClick={handleSave}
          disabled={!!isProcessing}
          className="flex-1 px-4 py-2 text-sm font-semibold bg-pine text-parchment-light rounded-xl hover:bg-pine-dark transition-colors text-center shadow disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Enregistrer le parcours
        </button>
      </div>
    </div>
  );
}
