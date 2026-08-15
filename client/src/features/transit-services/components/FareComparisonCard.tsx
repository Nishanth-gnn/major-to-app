import React from 'react';
import { motion } from 'framer-motion';
import { MultiModalOption } from '../types';

interface FareComparisonCardProps {
  options: MultiModalOption[];
  destination: string;
}

export default function FareComparisonCard({ options, destination }: FareComparisonCardProps) {
  return (
    <div className="bg-[#0d1628]/90 border border-white/10 rounded-2xl p-5 shadow-2xl backdrop-blur-xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>⚡ Multi-Modal Travel Comparison</span>
          </h3>
          <p className="text-xs text-slate-400">
            Compare options for route to <span className="text-blue-300 font-semibold">{destination || 'Destination'}</span>
          </p>
        </div>
        <span className="text-[11px] font-bold text-slate-400 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">
          {options.length} Options Available
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {options.map((opt, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -3 }}
            className={`p-4 rounded-xl border relative flex flex-col justify-between transition-all bg-gradient-to-b from-white/5 to-white/[0.02] ${
              opt.tag === 'Recommended'
                ? 'border-blue-500/50 shadow-lg shadow-blue-500/10'
                : 'border-white/8 hover:border-white/20'
            }`}
          >
            {opt.tag && (
              <span
                className={`absolute top-3 right-3 text-[9px] font-extrabold px-2 py-0.5 rounded-full border uppercase tracking-wider ${
                  opt.tag === 'Recommended'
                    ? 'bg-blue-500/30 text-blue-200 border-blue-400/40'
                    : 'bg-white/10 text-slate-300 border-white/15'
                }`}
              >
                {opt.tag}
              </span>
            )}

            <div>
              <div className="text-2xl mb-2">{opt.icon}</div>
              <h4 className="text-sm font-bold text-white mb-1">{opt.title}</h4>
              <p className="text-[11px] text-slate-400 line-clamp-2 leading-tight mb-3">
                {opt.notes}
              </p>
            </div>

            <div className="pt-2 border-t border-white/5 grid grid-cols-3 gap-1 text-center">
              <div>
                <span className="text-[9px] text-slate-500 font-bold uppercase block">Fare</span>
                <span className="text-xs font-black text-emerald-400">{opt.fare}</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-500 font-bold uppercase block">Time</span>
                <span className="text-xs font-bold text-slate-200">{opt.etaMinutes}m</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-500 font-bold uppercase block">Distance</span>
                <span className="text-xs font-bold text-blue-300">{opt.distanceKm}km</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
