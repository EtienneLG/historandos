"use client";

import { useEffect, useRef, useState } from 'react';
import { Trace, TraceMetrics } from '@/types/trace';
import ListView from './list-view';
import MapViewWrapper from './map-view/index';
import { gpx } from '@tmcw/togeojson';
import { lineString, length } from '@turf/turf';

interface HomeShellProps {
  traces: Trace[];
} 

type TabView = 'list' | 'map';

function calculateTraceMetrics(geoJson: any): TraceMetrics {
  let totalDist = 0;
  let gain = 0;
  let loss = 0;

  const coords = geoJson.features[0].geometry.coordinates;

  // 1. Total Distance
  totalDist = length(geoJson, { units: 'kilometers' });

  // 2. Elevation Profile
  const profile = coords.map((coord: [number, number, number], i: number) => {
    let distAtPoint = 0;

    if (i > 0) {
      const subLine = lineString(coords.slice(0, i + 1));
      distAtPoint = i === 0 ? 0 : length(subLine, { units: 'kilometers' });

      if (coords[i][2] > coords[i - 1][2]) {
        gain += coords[i][2] - coords[i - 1][2];
      }

      if (coords[i][2] < coords[i - 1][2]) {
        loss += coords[i - 1][2] - coords[i][2];
      }
    }

    return {
      distance: parseFloat(distAtPoint.toFixed(1)),
      elevation: Math.round(coord[2]), // meters
      lat: coord[1],
      lon: coord[0],
    };
  });

  return {
    distance: Math.round(totalDist * 1000) / 1000,
    elevationGain: Math.round(gain),
    elevationLoss: Math.round(loss),
    profile: profile,
  };
}

export default function HomeShell({ traces }: HomeShellProps) {
  const [activeTab, setActiveTab] = useState<TabView>('list');

  const [activeTrace, setActiveTrace] = useState<Trace | null>(null);
  const [traceGeoJson, setTraceGeoJson] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [metrics, setMetrics] = useState<TraceMetrics | null>(null);

  useEffect(() => {
    if (!activeTrace) return;

    async function loadNewTrack() {
      setLoading(true);
      try {
        const response = await fetch(`/api/traces/${activeTrace?.gpxFileId}`);
        const gpxText = await response.text();

        const parser = new DOMParser();
        const gpxXml = parser.parseFromString(gpxText, 'text/xml');
        const geoJson = gpx(gpxXml);

        const calcMetrics = calculateTraceMetrics(geoJson);

        setTraceGeoJson(geoJson);
        setMetrics(calcMetrics);
      } catch (error) {
        console.error('Error updating GPX track:', error);
      } finally {
        setLoading(false);
      }
    }

    loadNewTrack();
  }, [activeTrace]);

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
          <ListView 
            traces={traces} 
            activeTrace={activeTrace} 
          />
        ) : (
          <MapViewWrapper 
            traces={traces} 
            activeTrace={activeTrace} 
            setActiveTrace={setActiveTrace}
            traceGeoJson={traceGeoJson}
            loading={loading}
            metrics={metrics}
          />
        )}
      </div>
    </div>
  );
}