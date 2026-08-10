import React from 'react';

interface IconProps {
  className?: string;
}

export const IconWalk = ({ className = "w-4 h-4" }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="1" /><path d="m9 22 2-6M13 22l-2-6M15 11l-4-1M9 15l2-4 4-2" /></svg>
);

export const IconTent = ({ className = "w-4 h-4" }: IconProps) => (
  <svg className={className} viewBox="0 0 45 45" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M28.0061 14.228C28.0061 14.297 28.0051 14.366 28.0041 14.435L28.0031 14.515V14.527V14.539L28.0081 14.802V14.811V14.82L28.0361 15.296L28.0381 15.348L28.0531 15.399C28.2561 16.143 28.6931 16.789 29.4021 17.251C30.0571 17.677 30.9171 17.928 31.9841 17.986V18.987C30.6351 18.917 29.5721 18.565 28.7811 18.031L28.0011 17.504V18.445V21.5V22H28.5011H29.5011C29.6601 22 29.8081 22.076 29.9021 22.201L29.9491 22.276L36.9411 35.263C37.1091 35.574 36.9091 35.949 36.5731 35.995L36.4881 36H8.50114C8.14814 36 7.91214 35.646 8.03115 35.329L8.06814 35.251L15.0611 22.263C15.1431 22.111 15.2771 22.027 15.4241 22.006L15.4621 22H26.5011H27.0011V21.5L27.0031 18.446V17.505L26.2231 18.031C25.4321 18.565 24.3701 18.917 23.0211 18.987V17.986C24.0451 17.93 24.8771 17.697 25.5211 17.302C26.2771 16.839 26.7421 16.173 26.9521 15.399L26.9651 15.353L26.9691 15.306L26.9841 15.122V15.114V15.106L26.9971 14.814V14.8L27.0011 14.556V14.548L27.0031 13.458V12.366L26.1761 13.079C25.3941 13.753 24.3511 14.195 23.0211 14.284V13.281C24.0451 13.199 24.8871 12.863 25.5381 12.297C26.2871 11.645 26.7341 10.732 26.9451 9.688L26.9471 9.679L26.9491 9.67L26.9691 9.541L26.9711 9.533V9.526C26.9881 9.399 26.9991 9.267 27.0031 9.143V9.122V9.102L26.9991 9.023V9H28.0011V9.216H28.0061C28.0111 9.321 28.0211 9.426 28.0341 9.526V9.533L28.0361 9.541L28.0571 9.67L28.0591 9.679L28.0601 9.688C28.2631 10.696 28.6861 11.582 29.3911 12.229C30.0501 12.834 30.9181 13.196 31.9841 13.281V14.284C30.6531 14.195 29.6091 13.751 28.8271 13.077L28.0011 12.363V13.456V13.784V14.228H28.0061ZM15.0011 26.465L14.0601 26.228L9.73615 34.263L9.33814 35H10.1761H14.5011H15.0011V34.5V26.465ZM34.8271 34.999H35.6631L35.2661 34.262L29.3441 23.262L29.2021 22.999H28.9041L17.1761 23H16.3381L16.7341 23.737L22.6571 34.737L22.7991 35H23.0981L34.8271 34.999ZM16.9411 26.231L16.0011 26.468V34.5V35H16.5011H20.8271H21.6631L21.2661 34.263L16.9411 26.231ZM14.5011 11C16.4341 11 18.0011 12.567 18.0011 14.5C18.0011 16.433 16.4341 18 14.5011 18C12.5681 18 11.0011 16.433 11.0011 14.5C11.0011 12.567 12.5681 11 14.5011 11ZM14.5011 12C13.1201 12 12.0011 13.119 12.0011 14.5C12.0011 15.881 13.1201 17 14.5011 17C15.8821 17 17.0011 15.881 17.0011 14.5C17.0011 13.119 15.8821 12 14.5011 12Z" />
  </svg>
);

export const IconRefuge = ({ className = "w-4 h-4" }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
);

export const IconHotel = ({ className = "w-4 h-4" }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16M9 7h2M13 7h2" /></svg>
);

// Map configurations to keep styles consistent between UI and Map
export const ACCOMMODATION_CONFIG = {
  other: { label: "Pas d'hébergement", colorClass: 'text-stone-500', bgClass: 'bg-stone-100 border-stone-400', Component: IconWalk },
  tent: { label: "Bivouac / Tente", colorClass: 'text-emerald-600', bgClass: 'bg-emerald-50 border-emerald-500', Component: IconTent },
  refuge: { label: "Refuge", colorClass: 'text-amber-600', bgClass: 'bg-amber-50 border-amber-500', Component: IconRefuge },
  hotel: { label: "Gîte / Hôtel", colorClass: 'text-sky-600', bgClass: 'bg-sky-50 border-sky-500', Component: IconHotel },
};

/**
 * Generates a clean HTML string marker using Tailwind styles.
 * Perfect for Leaflet's L.divIcon or Mapbox custom HTML elements.
 */
export function getMarkerHtml(type: keyof typeof ACCOMMODATION_CONFIG): string {
  const config = ACCOMMODATION_CONFIG[type] || ACCOMMODATION_CONFIG.other;

  // Hardcoded copies of paths since map engines read raw HTML strings
  const paths = {
    other: '<circle cx="12" cy="5" r="1"/><path d="m9 22 2-6M13 22l-2-6M15 11l-4-1M9 15l2-4 4-2"/>',
    tent: '<path d="M19 21 12 4 5 21ZM12 4v17M5 21h14"/>',
    refuge: '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
    hotel: '<path d="M3 21h18M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16M9 7h2M13 7h2/>'
  };

  const selectedPath = paths[type] || paths.other;

  // Returns a beautifully styled pin utilizing Tailwind classes injected into the map container
  return `
    <div class="flex items-center justify-center w-8 h-8 rounded-full border-2 shadow-md ${config.bgClass} ${config.colorClass}">
      <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        ${selectedPath}
      </svg>
    </div>
  `;
}