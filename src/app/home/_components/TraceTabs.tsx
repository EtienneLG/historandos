"use client";

import { useState } from 'react';
import { Trace } from '@/types/trace';
import ListView from './ListView';
import MapView from './MapView';

interface TraceTabsProps {
  traces: Trace[];
}

type TabView = 'list' | 'map';

export default function TraceTabs({ traces }: TraceTabsProps) {
  const [activeTab, setActiveTab] = useState<TabView>('list');

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex w-full border-b border-gray-200 bg-white z-10 shrink-0">
        <button
          onClick={() => setActiveTab('list')}
          className={`flex-1 py-4 text-center font-semibold border-b-2 transition-colors ${
            activeTab === 'list' 
              ? 'border-blue-600 text-blue-600 bg-blue-50/30' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          Tile List
        </button>
        <button
          onClick={() => setActiveTab('map')}
          className={`flex-1 py-4 text-center font-semibold border-b-2 transition-colors ${
            activeTab === 'map' 
              ? 'border-blue-600 text-blue-600 bg-blue-50/30' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          Map View
        </button>
      </div>

      <div className="flex-1 w-full overflow-hidden">
        {activeTab === 'list' ? (
          <ListView traces={traces} />
        ) : (
          <MapView traces={traces} />
        )}
      </div>
    </div>
  );
}