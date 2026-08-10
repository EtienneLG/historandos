'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AccommodationType, DaySegment, POI } from '@/types/wizard';
import { formatDistance } from '@/lib/geo';
import { ACCOMMODATION_CONFIG } from './icons';

interface SegmentCardProps {
  segment: DaySegment;
  dayNumber: number;
  isOpen: boolean;
  onToggle: () => void;
  onUpdateSegment: (fields: Partial<DaySegment>) => void;
  onAddPoi: () => void;
  onUpdatePoi: (poiIndex: number, fields: Partial<POI>) => void;
  onRemovePoi: (poiIndex: number) => void;
}

export default function SegmentCard({
  segment,
  dayNumber,
  isOpen,
  onToggle,
  onUpdateSegment: onUpdate,
  onAddPoi,
  onUpdatePoi,
  onRemovePoi,
}: SegmentCardProps) {
  const [localName, setLocalName] = useState(segment.title);
  const [localDesc, setLocalDesc] = useState(segment.description);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalName(segment.title);
  }, [segment.title]);

  useEffect(() => {
    setLocalDesc(segment.description);
  }, [segment.description]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeAcc = ACCOMMODATION_CONFIG[segment.accomodation];
  const AccIcon = activeAcc.Component;
  
  return (
    <div className="border border-stone/40 rounded-xl bg-white overflow-hidden shadow-sm">

      {/* 1. HEADER: Title & Three Metrics */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center justify-between text-left focus:outline-none bg-stone/5 hover:bg-stone/10 transition-colors"
      >
        <span className="font-bold text-sm text-ink">
          {segment.title || `Étape ${dayNumber}`}
        </span>

        <div className="flex items-center gap-3 text-xs font-semibold text-ink/70">
          <span>{formatDistance(segment.metrics.distance || 0)} km</span>
          <span className="text-emerald-700">+{segment.metrics.gain || 0}m</span>
          <span className="text-amber-700">-{segment.metrics.loss || 0}m</span>
        </div>
      </button>

      {/* 2. BODY: Pure Vertical Stack */}
      {isOpen && (
        <div className="p-4 space-y-4 border-t border-stone/20">

          {/* A. Nom de l'étape */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold uppercase tracking-wide text-stone-500">Nom de l'étape</label>
            <input
              type="text"
              value={localName}
              onChange={(e) => setLocalName(e.target.value)}
              onBlur={() => onUpdate({ title: localName })}
              placeholder={`ex. Jour ${dayNumber} : L'arrivée au refuge`}
              className="w-full px-3 py-1.5 text-sm border border-stone/60 rounded-lg focus:outline-none focus:border-pine text-ink"
            />
          </div>

          {/* B. Dropdown button */}
          <div className="flex flex-col gap-1 relative" ref={dropdownRef}>
            <label className="text-[10px] font-bold uppercase tracking-wide text-stone-500">Hébergement</label>
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full px-3 py-1.5 text-sm border border-stone/60 rounded-lg bg-white flex items-center justify-between text-ink focus:outline-none"
            >
              <div className="flex items-center gap-2">
                <div className={activeAcc.colorClass}><AccIcon /></div>
                <span>{activeAcc.label}</span>
              </div>
              <svg className={`w-4 h-4 text-stone-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isDropdownOpen && (
              <div className="absolute left-0 right-0 top-[58px] bg-white border border-stone/60 rounded-lg shadow-lg z-30 py-1">
                {(Object.keys(ACCOMMODATION_CONFIG) as AccommodationType[]).map((type) => {
                  const opt = ACCOMMODATION_CONFIG[type];
                  const ItemIcon = opt.Component;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => {
                        onUpdate({ accomodation: type });
                        setIsDropdownOpen(false);
                      }}
                      className="w-full px-3 py-2 flex items-center gap-3 text-left text-sm hover:bg-stone/5 text-ink"
                    >
                      <div className={opt.colorClass}><ItemIcon /></div>
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* C. Description */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold uppercase tracking-wide text-stone-500">Description</label>
            <textarea
              rows={3}
              value={localDesc}
              onChange={(e) => setLocalDesc(e.target.value)}
              onBlur={() => onUpdate({ description: localDesc })}
              placeholder="Notes sur l'itinéraire, points de ravitaillement..."
              className="w-full px-3 py-1.5 text-sm border border-stone/60 rounded-lg focus:outline-none focus:border-pine text-ink resize-none"
            />
          </div>

          {/* D. Points d'intérêt */}
          <div className="space-y-2 pt-2 border-t border-stone/10">
            <label className="text-[10px] font-bold uppercase tracking-wide text-stone-500">Points d'intérêt ({segment.pois.length})</label>

            {segment.pois.length > 0 && (
              <div className="space-y-2">
                {segment.pois.map((poi, pIndex) => (
                  <div key={poi.id} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={poi.description}
                      onChange={(e) => onUpdatePoi(pIndex, { description: e.target.value })}
                      className="w-full px-2 py-1 text-xs border border-stone/40 rounded-md focus:outline-none text-ink bg-stone/5"
                    />
                    <button
                      type="button"
                      onClick={() => onRemovePoi(pIndex)}
                      className="p-1 text-stone-400 hover:text-red-500"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={onAddPoi}
              className="text-xs font-semibold text-pine hover:underline block"
            >
              + Ajouter un point d'intérêt
            </button>
          </div>

        </div>
      )}
    </div>
  );
}