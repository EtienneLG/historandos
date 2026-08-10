'use client';

import { useEffect, useState } from 'react';

export default function StepDetails() {
  // Toggle Accordion
  const handleToggle = (index: number) => {
    setActiveSegmentIndex(activeSegmentIndex === index ? null : index);
  };

  return (
    <div className="h-full flex flex-col justify-between">
      {/* Scrollable Accordion Area */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-4 pb-6">
        <div>
          <h2 className="text-lg font-bold text-ink mb-1">Configuration des Étapes</h2>
          <p className="text-xs text-ink/60">Gérez le tracé de vos journées et ajoutez des points d'intérêt.</p>
        </div>

        <hr className="border-stone/40" />

        {/* Accordion List */}
        <div className="space-y-3">
          {segments.map((segment, sIndex) => {
            const isOpen = activeSegmentIndex === sIndex;
            const dayNumber = sIndex + 1;

            return (
              <SegmentCard
                key={segment.id}
                segment={segment}
                dayNumber={dayNumber}
                isOpen={isOpen}
                onToggle={() => handleToggle(sIndex)}
                onUpdateSegment={(fields) => onUpdateSegment(sIndex, fields)}
                onAddPoi={() => onNewPoi(sIndex)}
                onUpdatePoi={(poiIndex, fields) => onUpadtePoi(sIndex, poiIndex, fields)}
                onRemovePoi={(poiIndex) => onDeletePoi(sIndex, poiIndex)}
              />
            );
          })}
        </div>

        {/* Global Add Segment Button */}
        <button
          type="button"
          onClick={onSplit}
          className={`w-full flex items-center justify-center gap-1.5 py-2.5 text-sm font-semibold border border-dashed rounded-xl transition-all text-pine border-pine/40 hover:bg-pine/5`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Ajouter une étape
        </button>
      </div>

      {/* Sticky Bottom Actions */}
      <div className="flex gap-3 pt-4 border-t border-stone/30 mt-auto bg-white">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 text-sm font-semibold border border-stone text-ink/75 rounded-xl hover:bg-stone/5 transition-colors shrink-0"
        >
          Retour
        </button>

        <button
          type="button"
          onClick={onNext}
          className="flex-1 px-4 py-2 text-sm font-semibold bg-pine text-parchment-light rounded-xl hover:bg-pine-dark transition-colors text-center shadow"
        >
          Enregistrer le parcours
        </button>
      </div>
    </div>
  );
}