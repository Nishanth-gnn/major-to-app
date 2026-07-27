import React, { useRef, useEffect } from 'react';
import { TransformWrapper, TransformComponent, ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';
import { motion } from 'framer-motion';
import POIMarker from './POIMarker';
import RouteLayer from './RouteLayer';
import MapControls from './MapControls';
import { POINode, GraphNode, pois } from '../data/mapData';

type Props = {
  currentLocation: { x: number, y: number };
  destination: POINode | null;
  path: (POINode | GraphNode)[];
  onSelectPOI: (poi: POINode) => void;
};

export default function MapContainer({ currentLocation, destination, path, onSelectPOI }: Props) {
  const transformRef = useRef<ReactZoomPanPinchRef>(null);

  // Auto-center and zoom when destination changes
  useEffect(() => {
    if (destination && transformRef.current) {
      const { setTransform } = transformRef.current;
      const cx = (currentLocation.x + destination.x) / 2;
      const cy = (currentLocation.y + destination.y) / 2;
      
      const dx = Math.abs(currentLocation.x - destination.x);
      const dy = Math.abs(currentLocation.y - destination.y);
      
      const padding = 300; // pixels of padding
      const vw = window.innerWidth;
      const vh = window.innerHeight - 150; // account for search bar and bottom sheet
      
      const scaleX = vw / (dx + padding);
      const scaleY = vh / (dy + padding);
      let scale = Math.min(scaleX, scaleY);
      
      // clamp scale between 0.4 and 1.5
      scale = Math.max(0.4, Math.min(scale, 1.5));
      
      setTransform((vw / 2) - (cx * scale), (vh / 2) - (cy * scale), scale, 800);
    }
  }, [destination, currentLocation]);

  return (
    <div className="flex-1 relative bg-[#eef2f6] dark:bg-slate-900 overflow-hidden">
      <TransformWrapper
        ref={transformRef}
        initialScale={1}
        initialPositionX={(window.innerWidth - 1200) / 2}
        initialPositionY={-100}
        minScale={0.3}
        maxScale={4}
        wheel={{ step: 0.1 }}
        limitToBounds={false}
      >
        <TransformComponent wrapperStyle={{ width: '100%', height: '100%' }}>
          <div className="relative w-[1200px] h-[1200px] shadow-2xl rounded-2xl overflow-hidden bg-white dark:bg-slate-800">
            {/* Background Map Image */}
            <img 
              src="/maps/terminal-map.jpg" 
              alt="Airport Terminal Map" 
              className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
              draggable="false"
            />

            {/* Path Glow & Animated Line */}
            <RouteLayer path={path} />

            {/* Current Location Marker (Entrance) */}
            <div 
              className="absolute pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
              style={{ left: currentLocation.x, top: currentLocation.y, zIndex: 10 }}
            >
              {/* Pulsing Ripple */}
              <motion.div 
                className="absolute inset-0 bg-blue-500 rounded-full opacity-50"
                animate={{ scale: [1, 2.5], opacity: [0.6, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
              />
              {/* Core Dot */}
              <div className="w-5 h-5 bg-blue-600 rounded-full border-[3px] border-white shadow-md relative z-10" />
              {/* Label */}
              <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-slate-900/90 backdrop-blur-md text-white text-xs font-medium px-2 py-1 rounded shadow-lg whitespace-nowrap">
                You are here
              </div>
            </div>

            {/* POI Markers */}
            {pois.map(poi => (
              <POIMarker 
                key={poi.id} 
                poi={poi} 
                isSelected={destination?.id === poi.id} 
                onClick={onSelectPOI} 
              />
            ))}
          </div>
        </TransformComponent>
        <MapControls />
      </TransformWrapper>
    </div>
  );
}
