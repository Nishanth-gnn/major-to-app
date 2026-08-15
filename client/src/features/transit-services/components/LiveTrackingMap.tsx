import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface LiveTrackingMapProps {
  lat: number;
  lng: number;
  vehicleName: string;
  vehicleType?: 'metro' | 'bus';
  routePoints?: [number, number][];
}

export default function LiveTrackingMap({ lat, lng, vehicleName, vehicleType = 'metro', routePoints }: LiveTrackingMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    let map: L.Map | null = null;

    try {
      // Clear container reference
      if (mapContainerRef.current) {
        (mapContainerRef.current as any)._leaflet_id = null;
      }

      map = L.map(mapContainerRef.current, {
        center: [lat, lng],
        zoom: 13,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map);

      const iconHtml = `
        <div style="width:36px;height:36px;border-radius:50%;background:${vehicleType === 'metro' ? 'linear-gradient(135deg, #2563eb, #06b6d4)' : 'linear-gradient(135deg, #059669, #14b8a6)'};border:2px solid #ffffff;box-shadow:0 0 20px rgba(41,121,255,0.8);display:flex;align-items:center;justify-content:center;color:#ffffff;font-size:18px;">
          ${vehicleType === 'metro' ? '🚆' : '🚌'}
        </div>
      `;

      const vehicleIcon = L.divIcon({
        html: iconHtml,
        className: 'vehicle-custom-marker',
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      L.marker([lat, lng], { icon: vehicleIcon }).addTo(map);

      const points: [number, number][] = routePoints && routePoints.length > 0 ? routePoints : [
        [lat - 0.05, lng - 0.08],
        [lat - 0.02, lng - 0.04],
        [lat, lng],
        [lat + 0.03, lng + 0.05],
        [lat + 0.07, lng + 0.09],
      ];

      L.polyline(points, {
        color: vehicleType === 'metro' ? '#3b82f6' : '#10b981',
        weight: 5,
        opacity: 0.85,
        dashArray: '8, 8',
      }).addTo(map);

      points.forEach((pt) => {
        L.circleMarker(pt, {
          radius: 5,
          color: '#ffffff',
          fillColor: vehicleType === 'metro' ? '#3b82f6' : '#10b981',
          fillOpacity: 1,
          weight: 2,
        }).addTo(map);
      });

      mapInstanceRef.current = map;
    } catch (err) {
      console.warn('[LiveTrackingMap] Leaflet map init handled:', err);
    }

    return () => {
      try {
        if (map) {
          map.remove();
        }
        mapInstanceRef.current = null;
      } catch (e) {}
    };
  }, [lat, lng, vehicleType]);

  return (
    <div className="relative w-full h-full min-h-[350px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#0a1020]">
      <div ref={mapContainerRef} className="w-full h-full min-h-[350px] z-10" />
      <div className="absolute top-4 left-4 z-20 bg-[#0a1020]/90 backdrop-blur-xl border border-white/10 px-3 py-1.5 rounded-xl text-xs text-white font-bold flex items-center gap-2 shadow-lg">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
        Live GPS Telemetry Active
      </div>
    </div>
  );
}
