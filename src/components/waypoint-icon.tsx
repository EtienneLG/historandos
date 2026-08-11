import { WaypointIconName } from '@/lib/waypoints';

const PATHS: Record<WaypointIconName, React.ReactNode> = {
  flag: <path strokeLinecap="round" strokeLinejoin="round" d="M4 21V4m0 0h11l-1.5 3L15 10H4" />,
  finish: (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 21V4h12v9H4" />
      <path strokeLinecap="round" d="M4 8.5h12M10 4v9" />
    </>
  ),
  tent: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4L3 20h18L12 4zm0 5l5 11h-10l5-11z" />
  ),
  refuge: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 11l9-7 9 7M5 10v10h14V10M10 20v-6h4v6"
    />
  ),
  hotel: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 20V6h16v14M4 12h16M8 6V4m8 2V4" />
  ),
  peak: <path strokeLinecap="round" strokeLinejoin="round" d="M3 19l6-11 3.5 6L15 11l6 8H3z" />,
  sight: (
    <>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.5 12S5.5 6 12 6s9.5 6 9.5 6-3 6-9.5 6-9.5-6-9.5-6z"
      />
      <circle cx="12" cy="12" r="2.5" />
    </>
  ),
  building: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5 21V5l7-2 7 2v16M9 9h.01M15 9h.01M9 13h.01M15 13h.01M10 21v-4h4v4"
    />
  ),
  water: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 3s6 6.5 6 10.5A6 6 0 016 13.5C6 9.5 12 3 12 3z"
    />
  ),
  warning: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 9v4m0 4h.01M10.3 3.9L2.6 17.2A2 2 0 004.3 20h15.4a2 2 0 001.7-2.8L13.7 3.9a2 2 0 00-3.4 0z"
    />
  ),
  pin: (
    <>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 21s7-6.3 7-11a7 7 0 10-14 0c0 4.7 7 11 7 11z"
      />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
};

interface WaypointIconProps {
  icon: WaypointIconName;
  className?: string;
}

export function WaypointIcon({ icon, className = 'w-4 h-4' }: WaypointIconProps) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      {PATHS[icon]}
    </svg>
  );
}
