import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

interface BusMarkerProps {
  position: [number, number];
  busName: string;
}

// Custom pulsing bus DivIcon
const busIcon = L.divIcon({
  className: 'custom-bus-divicon',
  html: `
    <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 44px; height: 44px; margin-left: -22px; margin-top: -22px;">
      <div style="position: absolute; width: 44px; height: 44px; background: rgba(37, 99, 235, 0.45); border-radius: 50%; animation: marker-pulse 2s infinite ease-in-out;"></div>
      <div style="font-size: 28px; z-index: 10; filter: drop-shadow(0 3px 6px rgba(0,0,0,0.3));">🚌</div>
      <style>
        @keyframes marker-pulse {
          0% { transform: scale(0.75); opacity: 0.85; }
          50% { transform: scale(1.25); opacity: 0.15; }
          100% { transform: scale(0.75); opacity: 0.85; }
        }
      </style>
    </div>
  `,
  iconSize: [44, 44],
  iconAnchor: [22, 22]
});

export default function BusMarker({ position, busName }: BusMarkerProps) {
  return (
    <Marker position={position} icon={busIcon}>
      <Popup className="custom-map-popup">
        <div className="text-xs font-bold text-slate-800 dark:text-slate-100">
          🚌 {busName}
        </div>
        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
          Live Tracking Location
        </div>
      </Popup>
    </Marker>
  );
}
