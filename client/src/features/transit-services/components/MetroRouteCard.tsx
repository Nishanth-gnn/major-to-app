import React from 'react';
import { Clock, Navigation, ShieldCheck, Activity, ChevronRight, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { MetroService } from '../types';

interface MetroRouteCardProps {
  metro: MetroService;
  onTrack: (metro: MetroService) => void;
}

export default function MetroRouteCard({ metro, onTrack }: MetroRouteCardProps) {
  const isDelayed = metro.status === 'Delayed';

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-[#0d1628]/90 border border-white/10 hover:border-blue-500/40 rounded-2xl p-5 shadow-xl backdrop-blur-xl relative overflow-hidden group"
    >
      {/* Top Bar: Line & Status */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div
            className="w-3 h-3 rounded-full shrink-0 shadow-md"
            style={{ backgroundColor: metro.color }}
          />
          <div>
            <h4 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors">
              {metro.lineName}
            </h4>
            <span className="text-[11px] font-medium text-slate-400">
              {metro.trainType} · {metro.lineCode}
            </span>
          </div>
        </div>
        <span
          className={`text-xs font-bold px-3 py-1 rounded-full border ${
            isDelayed
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
          }`}
        >
          {metro.status}
        </span>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-3 gap-2 bg-white/5 border border-white/5 rounded-xl p-3 my-3">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Next Train</span>
          <div className="text-sm font-extrabold text-blue-400 flex items-center gap-1 mt-0.5">
            <Zap size={13} className="fill-blue-400" /> {metro.nextTrainMinutes} mins
          </div>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Travel ETA</span>
          <div className="text-sm font-extrabold text-slate-200 flex items-center gap-1 mt-0.5">
            <Clock size={13} /> {metro.etaMinutes} mins
          </div>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Estimated Fare</span>
          <div className="text-sm font-extrabold text-emerald-400 mt-0.5">
            {metro.fare}
          </div>
        </div>
      </div>

      {/* Stations Route Preview */}
      <div className="flex items-center justify-between text-xs text-slate-400 pt-1 pb-3 border-b border-white/5">
        <span className="truncate max-w-[140px]">{metro.fromStation}</span>
        <div className="flex items-center gap-1 px-2 text-slate-500">
          ─── <span className="text-[10px] font-semibold text-slate-400">{metro.totalStations} stops</span> ───
        </div>
        <span className="truncate max-w-[140px] text-right font-medium text-slate-200">{metro.toStation}</span>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-3">
        <span className="text-[11px] text-slate-400 flex items-center gap-1">
          <Activity size={12} className="text-blue-400" /> {metro.frequency} · Max {metro.speedKmh} km/h
        </span>
        <button
          onClick={() => onTrack(metro)}
          className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-lg shadow-blue-500/25 flex items-center gap-1.5 transition-all group-hover:scale-105"
        >
          <Navigation size={13} /> Track Metro
        </button>
      </div>
    </motion.div>
  );
}
