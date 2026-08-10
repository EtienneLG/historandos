'use client';

import { useEffect, useRef, useState } from 'react';
import {
  AccommodationTypeSchema,
  PoiTypeSchema,
  ResolvedWaypoint,
  Waypoint,
  WaypointCategory,
} from '@/types/hike-types';
import { getWaypointVisual } from '@/lib/waypoints';
import { WaypointIcon } from '@/components/waypoint-icon';
import { formatDistance } from '@/lib/geo';

/** Categories a user is allowed to pick from the editable dropdown (start/end are locked). */
const EDITABLE_CATEGORIES: WaypointCategory[] = ['accommodation', 'poi', 'logistics', 'hazard'];

const CATEGORY_LABELS: Record<WaypointCategory, string> = {
  start: 'Départ',
  end: 'Arrivée',
  accommodation: 'Hébergement',
  poi: 'Point d\u2019intérêt',
  logistics: 'Logistique',
  hazard: 'Passage délicat',
};

interface WaypointCardProps {
  waypoint: ResolvedWaypoint;
  /** Start/end waypoints are fixed: only name & description can be edited, no removal. */
  isLocked: boolean;
  isOpen: boolean;
  onToggle: () => void;
  onUpdate: (fields: Partial<Waypoint>) => void;
  onRemove: () => void;
}

export default function WaypointCard({ waypoint, isLocked, isOpen, onToggle, onUpdate, onRemove }: WaypointCardProps) {
  // Reset the local (uncommitted) name/description whenever a different waypoint is
  // shown by this card instance, without needing an effect (see "You Might Not Need an
  // Effect" - adjusting state during render is preferred over syncing it in an effect).
  const [trackedWaypointId, setTrackedWaypointId] = useState(waypoint.id);
  const [localName, setLocalName] = useState(waypoint.name);
  const [localDesc, setLocalDesc] = useState(waypoint.description ?? '');

  if (waypoint.id !== trackedWaypointId) {
    setTrackedWaypointId(waypoint.id);
    setLocalName(waypoint.name);
    setLocalDesc(waypoint.description ?? '');
  }

  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCategoryDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const visual = getWaypointVisual(waypoint);

  const handleCategoryChange = (category: WaypointCategory) => {
    // Reset sub-type fields when switching category so stale values don't linger.
    onUpdate({
      category,
      accommodationType: category === 'accommodation' ? 'other' : null,
      poiType: category === 'poi' ? 'other' : null,
    });
    setIsCategoryDropdownOpen(false);
  };

  return (
    <div className="border border-stone/40 rounded-xl bg-white overflow-hidden shadow-sm">
      {/* HEADER */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center gap-3 text-left focus:outline-none bg-stone/5 hover:bg-stone/10 transition-colors"
      >
        <span className={`flex items-center justify-center w-7 h-7 rounded-full border-2 shrink-0 ${visual.nodeClass}`}>
          <WaypointIcon icon={visual.icon} className="w-3.5 h-3.5" />
        </span>

        <span className="flex-1 min-w-0">
          <span className="font-bold text-sm text-ink block truncate">
            {waypoint.name || CATEGORY_LABELS[waypoint.category]}
          </span>
          <span className="text-[11px] text-ink/50 font-mono">
            {formatDistance(waypoint.distanceFromStartM / 1000)} km · {Math.round(waypoint.elevation)} m
          </span>
        </span>

        <svg
          className={`w-4 h-4 text-stone-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* BODY */}
      {isOpen && (
        <div className="p-4 space-y-4 border-t border-stone/20">
          {/* Category selector (locked for start/end) */}
          {!isLocked && (
            <div className="flex flex-col gap-1 relative" ref={dropdownRef}>
              <label className="text-[10px] font-bold uppercase tracking-wide text-stone-500">Type</label>
              <button
                type="button"
                onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                className="w-full px-3 py-1.5 text-sm border border-stone/60 rounded-lg bg-white flex items-center justify-between text-ink focus:outline-none"
              >
                <div className="flex items-center gap-2">
                  <div className={`flex items-center justify-center w-5 h-5 rounded-full border ${visual.nodeClass}`}>
                    <WaypointIcon icon={visual.icon} className="w-3 h-3" />
                  </div>
                  <span>{CATEGORY_LABELS[waypoint.category]}</span>
                </div>
                <svg
                  className={`w-4 h-4 text-stone-400 transition-transform ${isCategoryDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isCategoryDropdownOpen && (
                <div className="absolute left-0 right-0 top-[58px] bg-white border border-stone/60 rounded-lg shadow-lg z-30 py-1">
                  {EDITABLE_CATEGORIES.map((category) => {
                    const optionVisual = getWaypointVisual({ category, accommodationType: null, poiType: null });
                    return (
                      <button
                        key={category}
                        type="button"
                        onClick={() => handleCategoryChange(category)}
                        className="w-full px-3 py-2 flex items-center gap-3 text-left text-sm hover:bg-stone/5 text-ink"
                      >
                        <div className={`flex items-center justify-center w-5 h-5 rounded-full border ${optionVisual.nodeClass}`}>
                          <WaypointIcon icon={optionVisual.icon} className="w-3 h-3" />
                        </div>
                        <span>{CATEGORY_LABELS[category]}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Sub-type selector, depending on category */}
          {!isLocked && waypoint.category === 'accommodation' && (
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase tracking-wide text-stone-500">Hébergement</label>
              <select
                value={waypoint.accommodationType ?? 'other'}
                onChange={(e) => onUpdate({ accommodationType: e.target.value as Waypoint['accommodationType'] })}
                className="w-full px-3 py-1.5 text-sm border border-stone/60 rounded-lg bg-white text-ink focus:outline-none focus:border-pine"
              >
                {AccommodationTypeSchema.options.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          )}

          {!isLocked && waypoint.category === 'poi' && (
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase tracking-wide text-stone-500">Point d&apos;intérêt</label>
              <select
                value={waypoint.poiType ?? 'other'}
                onChange={(e) => onUpdate({ poiType: e.target.value as Waypoint['poiType'] })}
                className="w-full px-3 py-1.5 text-sm border border-stone/60 rounded-lg bg-white text-ink focus:outline-none focus:border-pine"
              >
                {PoiTypeSchema.options.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          )}

          {/* Name */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold uppercase tracking-wide text-stone-500">Nom</label>
            <input
              type="text"
              value={localName}
              onChange={(e) => setLocalName(e.target.value)}
              onBlur={() => onUpdate({ name: localName })}
              placeholder={CATEGORY_LABELS[waypoint.category]}
              className="w-full px-3 py-1.5 text-sm border border-stone/60 rounded-lg focus:outline-none focus:border-pine text-ink"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold uppercase tracking-wide text-stone-500">Description</label>
            <textarea
              rows={3}
              value={localDesc}
              onChange={(e) => setLocalDesc(e.target.value)}
              onBlur={() => onUpdate({ description: localDesc })}
              placeholder="Notes sur ce point du parcours..."
              className="w-full px-3 py-1.5 text-sm border border-stone/60 rounded-lg focus:outline-none focus:border-pine text-ink resize-none"
            />
          </div>

          {/* Remove (not available for the fixed start/end waypoints) */}
          {!isLocked && (
            <button
              type="button"
              onClick={onRemove}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold text-red-600 border border-dashed border-red-200 rounded-lg hover:bg-red-50 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Supprimer ce point
            </button>
          )}
        </div>
      )}
    </div>
  );
}
