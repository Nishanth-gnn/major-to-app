import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plane, Shield, Coffee, Utensils, Armchair, 
  Stethoscope, BatteryCharging, Info, LogIn, ShoppingBag, Droplets,
  Luggage, FileCheck, Ticket
} from 'lucide-react';
import { POINode, POIType } from '../data/mapData';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

type Props = {
  poi: POINode;
  isSelected: boolean;
  onClick: (poi: POINode) => void;
};

const getIconForType = (type: POIType) => {
  switch(type) {
    case 'gate': return <Plane size={18} />;
    case 'security': return <Shield size={18} />;
    case 'restroom': return <Droplets size={18} />;
    case 'lounge': return <Armchair size={18} />;
    case 'food': return <Utensils size={18} />;
    case 'medical': return <Stethoscope size={18} />;
    case 'charging': return <BatteryCharging size={18} />;
    case 'info': return <Info size={18} />;
    case 'entrance': return <LogIn size={18} />;
    case 'shopping': return <ShoppingBag size={18} />;
    case 'baggage': return <Luggage size={18} />;
    case 'immigration': return <FileCheck size={18} />;
    case 'ticket': return <Ticket size={18} />;
    case 'escalator': return <div className="text-[10px] font-bold">Esc</div>;
    default: return <Coffee size={18} />;
  }
};

const getCategoryName = (type: POIType) => {
  switch(type) {
    case 'food': return 'Food & Beverage';
    case 'shopping': return 'Retail & Duty Free';
    case 'gate': return 'Boarding Gate';
    case 'entrance': return 'Main Entrance';
    case 'baggage': return 'Baggage Services';
    case 'info': return 'Customer Assistance';
    default: return type.charAt(0).toUpperCase() + type.slice(1);
  }
};

const getColorClass = (type: POIType, isSelected: boolean) => {
  if (isSelected) return 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.8)] border-blue-400';
  
  switch(type) {
    case 'gate': return 'bg-white text-blue-600 border-blue-200';
    case 'security': return 'bg-red-50 text-red-600 border-red-200';
    case 'restroom': return 'bg-cyan-50 text-cyan-600 border-cyan-200';
    case 'food': case 'lounge': return 'bg-orange-50 text-orange-600 border-orange-200';
    case 'medical': return 'bg-rose-50 text-rose-600 border-rose-200';
    case 'charging': return 'bg-green-50 text-green-600 border-green-200';
    case 'info': return 'bg-teal-50 text-teal-600 border-teal-200';
    case 'entrance': return 'bg-emerald-50 text-emerald-600 border-emerald-200';
    case 'shopping': return 'bg-purple-50 text-purple-600 border-purple-200';
    case 'baggage': return 'bg-indigo-50 text-indigo-600 border-indigo-200';
    case 'immigration': return 'bg-amber-50 text-amber-600 border-amber-200';
    case 'ticket': return 'bg-sky-50 text-sky-600 border-sky-200';
    default: return 'bg-white text-slate-600 border-slate-200';
  }
};

export default function POIMarker({ poi, isSelected, onClick }: Props) {
  return (
    <div
      className="absolute flex flex-col items-center justify-center transform -translate-x-1/2 -translate-y-1/2"
      style={{ left: poi.x, top: poi.y, zIndex: isSelected ? 40 : 20 }}
    >
      <motion.button
        onClick={(e) => {
          e.stopPropagation();
          onClick(poi);
        }}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.95 }}
        animate={isSelected ? { y: [0, -10, 0] } : { y: 0 }}
        transition={isSelected ? { repeat: Infinity, duration: 1.5, ease: "easeInOut" } : undefined}
        className={cn(
          "w-10 h-10 rounded-full border-2 flex items-center justify-center shadow-lg transition-colors duration-300",
          getColorClass(poi.category, isSelected)
        )}
      >
        {getIconForType(poi.category)}
      </motion.button>
      
      {/* Label - visible on hover or if selected */}
      <AnimatePresence>
        {isSelected && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            className="absolute top-14 w-48 bg-white/80 backdrop-blur-xl border border-white/40 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-3 pointer-events-none"
          >
            <div className="flex flex-col gap-1 text-center">
              <span className="text-slate-900 font-bold text-sm truncate">{poi.label}</span>
              <span className="text-slate-500 font-medium text-[10px] uppercase tracking-wider">{getCategoryName(poi.category)}</span>
              {isSelected && poi.category !== 'entrance' && (
                <div className="mt-2 inline-block px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-semibold">
                  Destination
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
