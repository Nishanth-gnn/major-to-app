import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';

interface LeafletMapProps {
  center: [number, number];
  zoom?: number;
  children?: React.ReactNode;
}

/**
 * Child component to handle updating the React Leaflet view dynamically
 * when the parent state updates the coordinates or zoom levels.
 */
function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export default function LeafletMap({ center, zoom = 13, children }: LeafletMapProps) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Resolve default Leaflet marker asset path mismatch in bundled Vite builds
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });
  }, []);

  return (
    <div className="w-full h-full min-h-[350px] relative rounded-3xl overflow-hidden shadow-inner border border-slate-200/60 dark:border-slate-700/50">
      {hasError && (
        <div className="absolute inset-0 bg-red-50/95 dark:bg-rose-950/95 z-[1000] flex flex-col items-center justify-center p-6 text-center">
          <span className="text-4xl">🗺️</span>
          <span className="mt-4 text-base font-bold text-red-600 dark:text-rose-400">
            Unable to load map.
          </span>
          <span className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 max-w-xs">
            Please check your network connection or try loading the page again.
          </span>
        </div>
      )}
      
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ width: '100%', height: '100%', minHeight: '350px', zIndex: 1 }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          eventHandlers={{
            tileerror: () => {
              setHasError(true);
            }
          }}
        />
        <ChangeView center={center} zoom={zoom} />
        {children}
      </MapContainer>
    </div>
  );
}
