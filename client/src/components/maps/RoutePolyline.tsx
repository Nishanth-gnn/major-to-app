import React from 'react';
import { Polyline } from 'react-leaflet';

interface RoutePolylineProps {
  positions: [number, number][];
}

export default function RoutePolyline({ positions }: RoutePolylineProps) {
  return (
    <>
      {/* Semi-transparent wide polyline for glowing drop shadow effect */}
      <Polyline
        positions={positions}
        pathOptions={{
          color: '#60a5fa',
          weight: 8,
          opacity: 0.3,
          lineJoin: 'round',
          lineCap: 'round'
        }}
      />
      {/* Primary solid blue navigation polyline */}
      <Polyline
        positions={positions}
        pathOptions={{
          color: '#2563eb',
          weight: 4,
          opacity: 0.95,
          lineJoin: 'round',
          lineCap: 'round'
        }}
      />
    </>
  );
}
