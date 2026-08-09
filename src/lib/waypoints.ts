import { AccommodationType, PoiType, Waypoint, WaypointCategory } from '@/types/hike-types';

/** Panel width, shared by the panel itself, the map padding and the dock offset. */
export const PANEL_WIDTH_PX = 450;

/** Expanded / collapsed height of the elevation dock, in pixels. */
export const DOCK_HEIGHT_PX = 180;
export const DOCK_COLLAPSED_HEIGHT_PX = 35;

export type WaypointIconName =
  | 'flag'
  | 'finish'
  | 'tent'
  | 'refuge'
  | 'hotel'
  | 'peak'
  | 'sight'
  | 'building'
  | 'water'
  | 'warning'
  | 'pin';

export interface WaypointVisual {
  label: string;
  icon: WaypointIconName;
  /** Tailwind classes for the icon node (background + border + text). */
  nodeClass: string;
  /** Raw hex colour, for the map markers and the chart pins. */
  color: string;
}

const CATEGORY_VISUALS: Record<WaypointCategory, WaypointVisual> = {
  start: {
    label: 'Départ',
    icon: 'flag',
    nodeClass: 'bg-blaze text-parchment-light border-parchment-light',
    color: '#6b9b3f',
  },
  end: {
    label: 'Arrivée',
    icon: 'finish',
    nodeClass: 'bg-pine text-parchment-light border-parchment-light',
    color: '#2d4a3a',
  },
  accommodation: {
    label: 'Hébergement',
    icon: 'tent',
    nodeClass: 'bg-blaze-dark text-parchment-light border-parchment-light',
    color: '#567f30',
  },
  poi: {
    label: 'Point d\u2019intérêt',
    icon: 'sight',
    nodeClass: 'bg-tarn text-parchment-light border-parchment-light',
    color: '#4a7c8c',
  },
  logistics: {
    label: 'Logistique',
    icon: 'water',
    nodeClass: 'bg-stone-dark text-ink border-parchment-light',
    color: '#bfb6a0',
  },
  hazard: {
    label: 'Passage délicat',
    icon: 'warning',
    nodeClass: 'bg-red-600 text-parchment-light border-parchment-light',
    color: '#dc2626',
  },
};

const ACCOMMODATION_ICONS: Record<AccommodationType, WaypointIconName> = {
  tent: 'tent',
  refuge: 'refuge',
  hotel: 'hotel',
  other: 'pin',
};

const ACCOMMODATION_LABELS: Record<AccommodationType, string> = {
  tent: 'Bivouac',
  refuge: 'Refuge',
  hotel: 'Hôtel',
  other: 'Hébergement',
};

const POI_ICONS: Record<PoiType, WaypointIconName> = {
  peak: 'peak',
  sight: 'sight',
  building: 'building',
  other: 'pin',
};

const POI_LABELS: Record<PoiType, string> = {
  peak: 'Sommet',
  sight: 'Panorama',
  building: 'Patrimoine',
  other: 'Point d\u2019intérêt',
};

/** Resolves the visual identity of a waypoint, refined by its sub-type when available. */
export function getWaypointVisual(
  waypoint: Pick<Waypoint, 'category' | 'accommodationType' | 'poiType'>
): WaypointVisual {
  const base = CATEGORY_VISUALS[waypoint.category];

  if (waypoint.category === 'accommodation' && waypoint.accommodationType) {
    return {
      ...base,
      icon: ACCOMMODATION_ICONS[waypoint.accommodationType],
      label: ACCOMMODATION_LABELS[waypoint.accommodationType],
    };
  }

  if (waypoint.category === 'poi' && waypoint.poiType) {
    return {
      ...base,
      icon: POI_ICONS[waypoint.poiType],
      label: POI_LABELS[waypoint.poiType],
    };
  }

  return base;
}
