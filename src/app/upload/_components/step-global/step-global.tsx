'use client';

import { useUploadStore } from '@/stores/upload-store';
import React, { useState } from 'react';

export default function StepGlobal() {
  const goToNextStep = useUploadStore((s) => s.goToNextStep);
  const goToPrevStep = useUploadStore((s) => s.goToPrevStep);
  const setGlobalData = useUploadStore((s) => s.setGlobalData);

  const [title, setTitle] = useState<string>(useUploadStore((s) => s.title));
  const [people, setPeople] = useState<string[]>(useUploadStore((s) => s.people));
  const [date, setDate] = useState<string>(useUploadStore((s) => s.date));
  const [description, setDescription] = useState<string>(useUploadStore((s) => s.description));
  const [photoDirectoryId, setPhotoDirectoryId] = useState<number>(useUploadStore((s) => s.photoDirId));

  const saveGlobalData = () => {
    const cleanedPeople = people.filter((p) => p.trim() !== '');

    setGlobalData({
      title,
      people: cleanedPeople,
      date,
      description,
      photoDirId: photoDirectoryId,
    });
  }

  const handleCancel = (e: React.FormEvent) => {
    e.preventDefault();
    
    saveGlobalData();
    goToPrevStep();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    saveGlobalData();
    goToNextStep();
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="h-full flex flex-col justify-between"
    >
      {/* Scrollable Container for Inputs */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-5 pb-6">
        <div>
          <h2 className="text-lg font-bold text-ink mb-1">Détails de l'activité</h2>
          <p className="text-xs text-ink/60">Saisissez les informations de base avant de diviser votre parcours.</p>
        </div>

        <hr className="border-stone/40" />

        {/* Title */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold uppercase tracking-wide text-pine/70">Titre</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="ex. Grand tour des Écrins"
            className="w-full px-3 py-2 text-sm border border-stone rounded-xl bg-stone/20 focus:bg-parchment-light focus:outline-none focus:ring-2 focus:ring-pine/40 focus:border-pine transition-all placeholder:text-ink/30 text-ink"
          />
        </div>

        {/* Participants */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wide text-pine/70">Participants</label>
            <span className="text-[10px] font-semibold text-ink/40 uppercase tracking-wide bg-stone/40 px-1.5 py-0.5 rounded">Optionnel</span>
          </div>

          <div className="flex flex-col gap-2">
            {people.map((person, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={person}
                  onChange={(e) => {
                    const updated = [...people];
                    updated[index] = e.target.value;
                    setPeople(updated);
                  }}
                  placeholder="Nom"
                  className="flex-1 px-3 py-2 text-sm border border-stone rounded-xl bg-stone/20 focus:bg-parchment-light focus:outline-none focus:ring-2 focus:ring-pine/40 focus:border-pine transition-all placeholder:text-ink/30 text-ink"
                />
                <button
                  type="button"
                  onClick={() => setPeople(people.filter((_, i) => i !== index))}
                  className="p-2 text-ink/30 hover:text-blaze-dark hover:bg-blaze/5 rounded-lg transition-colors shrink-0"
                  aria-label="Retirer"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setPeople([...people, ''])}
            className="flex items-center gap-1.5 mt-1 px-3 py-2 text-sm font-semibold text-pine border border-dashed border-pine/30 rounded-xl hover:bg-pine/5 hover:border-pine/50 transition-all self-start"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Ajouter une personne
          </button>
        </div>

        {/* Date */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold uppercase tracking-wide text-pine/70">Date de l'activité</label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-stone rounded-xl bg-stone/20 focus:bg-parchment-light focus:outline-none focus:ring-2 focus:ring-pine/40 focus:border-pine transition-all text-ink"
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold uppercase tracking-wide text-pine/70">Description</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ajouter des détails sur les personnes, les conditions, la durée..."
            className="w-full px-3 py-2 text-sm border border-stone rounded-xl bg-stone/20 focus:bg-parchment-light focus:outline-none focus:ring-2 focus:ring-pine/40 focus:border-pine transition-all placeholder:text-ink/30 text-ink resize-none"
          />
        </div>

        {/* Optional Photo Directory ID */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wide text-pine/70">ID du répertoire photo</label>
          </div>
          <input
            type="number"
            required
            value={photoDirectoryId}
            onChange={(e) => setPhotoDirectoryId(Number(e.target.value))}
            placeholder="ex. 120102"
            className="w-full px-3 py-2 text-sm border border-stone rounded-xl bg-stone/20 focus:bg-parchment-light focus:outline-none focus:ring-2 focus:ring-pine/40 focus:border-pine transition-all placeholder:text-ink/30 font-mono text-xs text-ink"
          />
        </div>
      </div>

      {/* Persistent Sticky Footer with Actions */}
      <div className="flex gap-3 pt-4 border-t border-stone/30 mt-auto bg-white">
        <button
          type="button"
          onClick={handleCancel}
          className="px-4 py-2 text-sm font-semibold border border-stone text-ink/75 rounded-xl hover:bg-stone/5 transition-colors shrink-0"
        >
          Retour
        </button>

        <button
          type="submit"
          className="flex-1 px-4 py-2 text-sm font-semibold bg-pine text-parchment-light rounded-xl hover:bg-pine-dark transition-colors text-center"
        >
          Continuer
        </button>
      </div>
    </form>
  );
}