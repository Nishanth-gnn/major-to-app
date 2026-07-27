import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation, Clock, Activity, CornerUpRight, MapPin, Target } from 'lucide-react';
import { POINode, GraphNode } from '../data/mapData';

type Props = {
  destination: POINode | null;
  path: (POINode | GraphNode)[];
  etaMinutes: number;
  distanceMeters: number;
};

export default function NavigationPanel({ destination, path, etaMinutes, distanceMeters }: Props) {
  if (!destination) return null;

  const steps = [
    { icon: <MapPin size={16} />, text: 'Start from Check-in / Security' },
    { icon: <CornerUpRight size={16} />, text: 'Head towards the main terminal' },
    { icon: <Activity size={16} />, text: `Walk for ${distanceMeters}m` },
    { icon: <Target size={16} />, text: `Arrive at ${destination.label}` }
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="hidden lg:block absolute top-24 left-6 w-80 bg-white/95 backdrop-blur-md rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden z-40"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-500 to-blue-600 p-5 text-white">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-sky-100">Navigating to</h3>
          <h2 className="text-xl font-bold mt-1">{destination.label}</h2>
        </div>

        {/* ETA & Distance Summary */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-100 text-emerald-600 p-2 rounded-xl">
              <Clock size={20} />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-800 leading-none">{etaMinutes}</div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-1">Min</div>
            </div>
          </div>

          <div className="w-px h-10 bg-slate-200"></div>

          <div className="flex items-center gap-3">
            <div className="bg-sky-100 text-sky-600 p-2 rounded-xl">
              <Navigation size={20} />
            </div>
            <div>
              <div className="text-xl font-bold text-slate-800 leading-none">{distanceMeters}</div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-1">Meters</div>
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="p-5">
          <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">Step by Step</h4>
          <div className="relative">
            {/* Connecting line */}
            <div className="absolute left-3 top-4 bottom-4 w-px bg-slate-200"></div>
            
            <ul className="space-y-6">
              {steps.map((step, i) => (
                <motion.li 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-4 relative"
                >
                  <div className="w-6 h-6 rounded-full bg-white border-2 border-sky-400 flex items-center justify-center text-sky-500 z-10 shrink-0">
                    <div className="w-2 h-2 rounded-full bg-sky-400"></div>
                  </div>
                  <div className="pt-0.5">
                    <p className="text-sm font-medium text-slate-700">{step.text}</p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
