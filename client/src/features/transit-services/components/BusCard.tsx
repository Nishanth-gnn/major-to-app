import React from 'react';
import { Bus, Clock, Navigation } from 'lucide-react';
import { motion } from 'framer-motion';
import { BusInfo } from '../types';

interface BusCardProps {
  bus: BusInfo;
  onTrack: (bus: BusInfo) => void;
  isTracking?: boolean;
}

export default function BusCard({ bus, onTrack, isTracking }: BusCardProps) {
  const getSeatColor = (seats: string) => {
    switch (seats) {
      case 'Available': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'Filling Fast': return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'Housefull': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    }
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-[#0d1628]/90 border border-white/10 hover:border-emerald-500/40 rounded-2xl p-5 shadow-xl backdrop-blur-xl relative overflow-hidden group"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
            <Bus size={20} />
          </div>
          <div>
            <h4 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
              {bus.name}
            </h4>
            <span className="text-xs text-slate-400">Pushpak Airport Liner Coach</span>
          </div>
        </div>
        <span className={`text-xs font-bold px-3 py-1 rounded-full border ${getSeatColor(bus.seats)}`}>
          {bus.seats}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 bg-white/5 border border-white/5 rounded-xl p-3 my-3">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Departure</span>
          <div className="text-sm font-bold text-slate-200 flex items-center gap-1 mt-0.5">
            <Clock size={13} /> {bus.departure}
          </div>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Travel Duration</span>
          <div className="text-sm font-bold text-emerald-400 mt-0.5">
            ~{bus.eta}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <span className="text-xs text-slate-400">Live Telegram Telemetry Ready</span>
        <button
          onClick={() => onTrack(bus)}
          disabled={isTracking}
          className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 disabled:opacity-50 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-lg shadow-emerald-500/25 flex items-center gap-1.5 transition-all group-hover:scale-105"
        >
          <Navigation size={13} /> {isTracking ? 'Connecting...' : 'Track Bus'}
        </button>
      </div>
    </motion.div>
  );
}
