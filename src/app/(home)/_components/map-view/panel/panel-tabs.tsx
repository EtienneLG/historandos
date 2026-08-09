import { PanelTab } from '@/stores/ui-store';

interface PanelTabsProps {
  activeTab: PanelTab;
  waypointCount: number;
  onChange: (tab: PanelTab) => void;
  onClose: () => void;
}

const TAB_BASE =
  'flex items-center justify-center gap-2 flex-1 px-4 py-1.5 text-sm font-semibold rounded-md transition-all duration-150 cursor-pointer';

export function PanelTabs({ activeTab, waypointCount, onChange, onClose }: PanelTabsProps) {
  return (
    <div className="shrink-0 flex items-center gap-3 px-4 py-3 border-b border-stone bg-parchment-light/95">
      <nav className="flex items-center flex-1 bg-stone/40 p-1 rounded-lg border border-stone" role="tablist">
        <button
          role="tab"
          aria-selected={activeTab === 'waypoints'}
          onClick={() => onChange('waypoints')}
          className={`${TAB_BASE} ${activeTab === 'waypoints'
            ? 'bg-parchment-light text-pine shadow-sm'
            : 'text-ink/50 hover:text-ink'
            }`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 4v16M7 4a2 2 0 110 4 2 2 0 010-4zm0 12a2 2 0 110 4 2 2 0 010-4z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 6h8M11 18h8" />
          </svg>
          Étapes
          {waypointCount > 0 && (
            <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-pine/10 text-pine">
              {waypointCount}
            </span>
          )}
        </button>

        <button
          role="tab"
          aria-selected={activeTab === 'photos'}
          onClick={() => onChange('photos')}
          className={`${TAB_BASE} ${activeTab === 'photos'
            ? 'bg-parchment-light text-pine shadow-sm'
            : 'text-ink/50 hover:text-ink'
            }`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7a2 2 0 012-2h2.5l1.2-2h6.6l1.2 2H19a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
            <circle cx="12" cy="12" r="3.5" />
          </svg>
          Photos
        </button>
      </nav>

      <button
        onClick={onClose}
        className="text-ink/40 hover:text-pine hover:bg-stone/50 p-1.5 rounded-xl transition-all duration-200 shrink-0"
        aria-label="Close panel"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
