'use client';

import React from 'react';
import Map, { MapRef } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';

interface BaseMapProps {
  longitude?: number;
  latitude?: number;
  zoom?: number;
  handleMapLoad: () => void;
  children?: React.ReactNode;
  mapRef?: React.RefObject<MapRef | null>;
}

export default function BaseMap({ longitude=6.5, latitude=46.5, zoom=6, handleMapLoad, children, mapRef }: BaseMapProps) {
  const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  return (
    <div className="w-full h-full relative">
      <Map
        ref={mapRef}
        mapboxAccessToken={MAPBOX_TOKEN}
        initialViewState={{
          longitude: longitude,
          latitude: latitude,
          zoom: zoom
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/outdoors-v12"
        onLoad={handleMapLoad}
      >
        {children}
      </Map>
    </div>
  );
}