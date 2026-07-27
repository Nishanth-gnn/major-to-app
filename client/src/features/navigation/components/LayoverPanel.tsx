import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Coffee, Sparkles } from 'lucide-react';
import { POINode } from '../data/mapData';

type Props = {
  layoverMinutes: number;
  destination: POINode | null;
};

export default function LayoverPanel({ layoverMinutes, destination }: Props) {
  // If destination is selected, we prioritize showing the Navigation Panel on desktop.
  // We can still show Layover recommendations below it or on the right side.
  // For this design, we'll put Layover smartness in a floating panel on the right.

  const isShort = layoverMinutes < 30;
  const isMed = layoverMinutes >= 30 && layoverMinutes <= 60;
  const isLong = layoverMinutes > 60;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        className="hidden lg:block absolute top-24 right-6 w-80 bg-white/95 backdrop-blur-md rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden z-40"
      >
        <div className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Layover Smartness</h3>
            <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs font-bold">{layoverMinutes}m</span>
          </div>

          {isShort && (
            <div className="bg-red-50 border border-red-100 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="text-red-500 shrink-0" size={20} />
                <div>
                  <h4 className="font-semibold text-red-700 text-sm">Short Layover</h4>
                  <p className="text-red-600/80 text-xs mt-1 leading-relaxed">
                    Time is tight! Please proceed directly to your boarding gate. Do not make any stops.
                  </p>
                </div>
              </div>
            </div>
          )}

          {isMed && (
            <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <Coffee className="text-orange-500 shrink-0" size={20} />
                <div>
                  <h4 className="font-semibold text-orange-700 text-sm">Grab a Quick Bite</h4>
                  <p className="text-orange-600/80 text-xs mt-1 leading-relaxed">
                    You have time for a quick coffee or snack near your gate. Stay vigilant of boarding announcements.
                  </p>
                </div>
              </div>
            </div>
          )}

          {isLong && (
            <div className="bg-sky-50 border border-sky-100 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <Sparkles className="text-sky-500 shrink-0" size={20} />
                <div>
                  <h4 className="font-semibold text-sky-700 text-sm">Relax & Explore</h4>
                  <p className="text-sky-600/80 text-xs mt-1 leading-relaxed">
                    You have plenty of time. Consider visiting a premium lounge, duty-free shopping, or a sit-down restaurant.
                  </p>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-2">
                <button className="text-xs bg-white border border-sky-200 text-sky-700 font-semibold py-2 rounded-xl shadow-sm hover:bg-sky-100 transition-colors">Find Lounge</button>
                <button className="text-xs bg-white border border-sky-200 text-sky-700 font-semibold py-2 rounded-xl shadow-sm hover:bg-sky-100 transition-colors">Duty Free</button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
