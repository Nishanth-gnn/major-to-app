import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

interface DestinationMarkerProps {
  position: [number, number];
  name: string;
  isAirport?: boolean;
}

// Generate icon based on destination type (airport vs city pin)
const getDestIcon = (isAirport: boolean) => L.divIcon({
  className: `custom-dest-${isAirport ? 'airport' : 'city'}-divicon`,
  html: `
    <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; margin-left: -18px; margin-top: -18px;">
      <div style="font-size: 24px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">
        ${isAirport ? '✈️' : '📍'}
      </div>
    </div>
  `,
  iconSize: [36, 36],
  iconAnchor: [18, 18]
});

export default function DestinationMarker({ position, name, isAirport = false }: DestinationMarkerProps) {
  const icon = getDestIcon(isAirport);
  return (
    <Marker position={position} icon={icon}>
      <Popup className="custom-map-popup">
        <div className="text-xs font-bold text-slate-800 dark:text-slate-100">
          {isAirport ? '✈️' : '📍'} {name}
        </div>
        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
          {isAirport ? 'Rajiv Gandhi International Airport' : 'Route Terminus'}
        </div>
      </Popup>
    </Marker>
  );
}
