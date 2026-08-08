import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

interface UserMarkerProps {
  position: [number, number];
  name?: string;
}

// Custom pulsing emerald-green user dot
const userIcon = L.divIcon({
  className: 'custom-user-divicon',
  html: `
    <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; margin-left: -16px; margin-top: -16px;">
      <div style="position: absolute; width: 28px; height: 28px; background: rgba(16, 185, 129, 0.45); border-radius: 50%; animation: user-pulse 2s infinite ease-in-out;"></div>
      <div style="width: 14px; height: 14px; background: #10b981; border: 2.5px solid white; border-radius: 50%; z-index: 10; box-shadow: 0 2px 5px rgba(0,0,0,0.35);"></div>
      <style>
        @keyframes user-pulse {
          0% { transform: scale(0.75); opacity: 0.85; }
          50% { transform: scale(1.35); opacity: 0.15; }
          100% { transform: scale(0.75); opacity: 0.85; }
        }
      </style>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 16]
});

export default function UserMarker({ position, name = 'You' }: UserMarkerProps) {
  return (
    <Marker position={position} icon={userIcon}>
      <Popup className="custom-map-popup">
        <div className="text-xs font-bold text-slate-800 dark:text-slate-100">
          👤 {name}
        </div>
        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
          Your Current Location
        </div>
      </Popup>
    </Marker>
  );
}
