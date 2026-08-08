import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import MapContainer from '../components/MapContainer';
import SearchBar from '../components/SearchBar';
import BottomSheet from '../components/BottomSheet';
import { POINode, findShortestPath, pois } from '../data/mapData';

export default function NavigatePage() {
  const location = useLocation();
  const [selectedPOI, setSelectedPOI] = useState<POINode | null>(null);

  useEffect(() => {
    // 1. Check React Router state
    const state = location.state as { autoSelectPoiId?: string } | null;
    if (state?.autoSelectPoiId) {
      const poi = pois.find(p => p.id === state.autoSelectPoiId);
      if (poi) {
        setSelectedPOI(poi);
        return;
      }
    }

    // 2. Fallback to check sessionStorage
    const sessionPoiId = sessionStorage.getItem('autoSelectPoiId');
    if (sessionPoiId) {
      sessionStorage.removeItem('autoSelectPoiId');
      const poi = pois.find(p => p.id === sessionPoiId);
      if (poi) {
        setSelectedPOI(poi);
      }
    }
  }, [location]);

  // Starting point for this demo is 'main_entrance'
  const currentLocation = useMemo(() => ({ x: 320, y: 1000 }), []);

  const path = useMemo(() => {
    if (!selectedPOI) return [];
    return findShortestPath('main_entrance', selectedPOI.id);
  }, [selectedPOI]);

  // Calculate rough distance and ETA based on path length
  const { distanceMeters, etaMinutes } = useMemo(() => {
    if (!path.length) return { distanceMeters: 0, etaMinutes: 0 };
    
    let dist = 0;
    for (let i = 0; i < path.length - 1; i++) {
      dist += Math.sqrt(
        Math.pow(path[i].x - path[i+1].x, 2) + 
        Math.pow(path[i].y - path[i+1].y, 2)
      );
    }
    
    // Scale abstract pixels to roughly meters (e.g. 1 pixel = 1.2 meters)
    const meters = Math.round(dist * 1.2);
    // Average walking speed ~ 80 meters per minute
    const eta = Math.max(1, Math.round(meters / 80));

    return { distanceMeters: meters, etaMinutes: eta };
  }, [path]);

  return (
    <div className="fixed inset-0 z-50 bg-[#eef2f6] dark:bg-slate-900 overflow-hidden flex flex-col">
      {/* Search Bar Overlay */}
      <SearchBar onSelect={setSelectedPOI} selectedPOI={selectedPOI} />

      {/* Main Interactive Map */}
      <MapContainer 
        currentLocation={currentLocation}
        destination={selectedPOI}
        path={path}
        onSelectPOI={setSelectedPOI}
      />

      {/* Bottom Sheet for ETA */}
      <BottomSheet 
        destination={selectedPOI}
        path={path}
        etaMinutes={etaMinutes}
        distanceMeters={distanceMeters}
        onClose={() => setSelectedPOI(null)}
      />
    </div>
  );
}
