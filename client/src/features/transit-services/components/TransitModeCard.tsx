import React from 'react';
import { motion } from 'framer-motion';
import { TransitModeInfo, TransitMode } from '../types';

interface TransitModeCardProps {
  mode: TransitModeInfo;
  isActive: boolean;
  onSelect: (modeId: TransitMode) => void;
}

export default function TransitModeCard({ mode, isActive, onSelect }: TransitModeCardProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(mode.id)}
      className={`relative p-3.5 rounded-2xl border text-left transition-all overflow-hidden flex flex-col justify-between ${
        isActive
          ? 'bg-gradient-to-br from-blue-600/25 to-indigo-600/15 border-blue-500/50 shadow-xl shadow-blue-500/10'
          : 'bg-[#0d1628]/80 hover:bg-[#131f38] border-white/8 hover:border-white/20'
      }`}
    >
      {/* Top Row: Icon & Tag */}
      <div className="flex items-center justify-between mb-2">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 transition-transform ${
            isActive ? 'bg-blue-500/30 border border-blue-400/40 scale-105' : 'bg-white/5 border border-white/5'
          }`}
        >
          {mode.icon}
        </div>

        {mode.tag && (
          <span
            className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border uppercase tracking-wider ${
              isActive
                ? 'bg-blue-500/30 text-blue-200 border-blue-400/40'
                : 'bg-white/5 text-slate-400 border-white/10'
            }`}
          >
            {mode.tag}
          </span>
        )}
      </div>

      {/* Details */}
      <div>
        <h3 className={`text-xs font-bold truncate ${isActive ? 'text-white' : 'text-slate-200'}`}>
          {mode.label}
        </h3>
        <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 leading-tight">
          {mode.description}
        </p>
      </div>

      {/* Active Accent Indicator */}
      {isActive && (
        <motion.div
          layoutId="activeTransitGlow"
          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-b-2xl"
        />
      )}
    </motion.button>
  );
}
