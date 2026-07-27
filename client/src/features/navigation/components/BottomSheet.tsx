import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { POINode, GraphNode } from '../data/mapData';
import { Navigation, Clock, MapPin, Target, X } from 'lucide-react';

type Props = {
  destination: POINode | null;
  path: (POINode | GraphNode)[];
  etaMinutes: number;
  distanceMeters: number;
  onClose: () => void;
};

export default function BottomSheet({ destination, path, etaMinutes, distanceMeters, onClose }: Props) {
  return (
    <AnimatePresence>
      {destination && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-50 overflow-hidden border-t border-slate-100 dark:border-slate-700 pb-safe"
        >
          {/* Drag Handle & Header */}
          <div className="pt-3 pb-2 flex justify-center">
            <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-600 rounded-full"></div>
          </div>
          
          <div className="px-5 pb-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400">Navigating to</h3>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1">{destination.label}</h2>
              </div>
              <button onClick={onClose} className="p-2 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* ETA & Distance */}
            <div className="flex items-center gap-6 mt-6 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 p-2 rounded-xl">
                  <Clock size={20} />
                </div>
                <div>
                  <div className="text-xl font-bold text-slate-800 dark:text-slate-100 leading-none">{etaMinutes}</div>
                  <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">Min</div>
                </div>
              </div>
              <div className="w-px h-8 bg-slate-200 dark:bg-slate-700"></div>
              <div className="flex items-center gap-3">
                <div className="bg-sky-100 dark:bg-sky-900/50 text-sky-600 dark:text-sky-400 p-2 rounded-xl">
                  <Navigation size={20} />
                </div>
                <div>
                  <div className="text-xl font-bold text-slate-800 dark:text-slate-100 leading-none">{distanceMeters}</div>
                  <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">Meters</div>
                </div>
              </div>
            </div>

            {/* Next Step Preview */}
            <div className="mt-6 flex items-start gap-4">
               <div className="w-8 h-8 rounded-full bg-sky-100 dark:bg-sky-900/50 flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0">
                  <Target size={16} />
               </div>
               <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Next Step</p>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200 mt-0.5">Follow signs to {destination.category}</p>
               </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
