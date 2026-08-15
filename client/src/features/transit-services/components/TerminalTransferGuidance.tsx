import React from 'react';
import { Footprints, MapPin, ArrowRight, Navigation, CheckCircle2, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { TerminalTransferGuidance as GuidanceType } from '../types';

interface TerminalTransferGuidanceProps {
  guidance: GuidanceType;
}

export default function TerminalTransferGuidance({ guidance }: TerminalTransferGuidanceProps) {
  const navigate = useNavigate();

  const handleOpenIndoorRoute = () => {
    const from = encodeURIComponent(guidance.terminal);
    const to = encodeURIComponent(guidance.metroStation);
    navigate(`/navigation?from=${from}&to=${to}`, { state: { from: guidance.terminal, to: guidance.metroStation } });
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-gradient-to-br from-[#0d1628] to-[#111c33] border border-blue-500/30 rounded-2xl p-5 shadow-2xl backdrop-blur-xl relative overflow-hidden"
    >
      <div className="flex items-center justify-between pb-3 border-b border-white/8 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center font-bold">
            <Footprints size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              Terminal to Metro Walking Guidance
            </h3>
            <span className="text-[11px] text-slate-400">Indoor navigation path</span>
          </div>
        </div>
        <span className="text-[10px] font-extrabold bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2.5 py-1 rounded-full">
          Air-Conditioned Skywalk
        </span>
      </div>

      {/* Transfer Path Header */}
      <div className="flex items-center justify-between bg-white/5 border border-white/5 rounded-xl p-3 mb-3">
        <div className="flex items-center gap-2">
          <Building2 size={15} className="text-blue-400" />
          <span className="text-xs font-bold text-white">{guidance.terminal}</span>
        </div>
        <ArrowRight size={16} className="text-slate-400 mx-2" />
        <div className="flex items-center gap-2">
          <MapPin size={15} className="text-emerald-400" />
          <span className="text-xs font-bold text-blue-300">{guidance.metroStation}</span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4 text-center">
        <div className="bg-white/5 p-2 rounded-lg border border-white/5">
          <span className="text-[9px] uppercase font-bold text-slate-400 block">Distance</span>
          <span className="text-xs font-extrabold text-white">{guidance.distanceMeters} meters</span>
        </div>
        <div className="bg-white/5 p-2 rounded-lg border border-white/5">
          <span className="text-[9px] uppercase font-bold text-slate-400 block">Walking Time</span>
          <span className="text-xs font-extrabold text-emerald-400">{guidance.walkingTimeMins} minutes</span>
        </div>
        <div className="bg-white/5 p-2 rounded-lg border border-white/5">
          <span className="text-[9px] uppercase font-bold text-slate-400 block">Level</span>
          <span className="text-xs font-extrabold text-blue-300">{guidance.level}</span>
        </div>
        <div className="bg-white/5 p-2 rounded-lg border border-white/5">
          <span className="text-[9px] uppercase font-bold text-slate-400 block">Elevator</span>
          <span className="text-xs font-extrabold text-purple-300">
            {guidance.elevatorAvailable ? 'Available ✓' : 'Stairs Only'}
          </span>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={handleOpenIndoorRoute}
        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs py-3 rounded-xl shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
      >
        <Navigation size={15} /> Open Indoor Route Map
      </button>
    </motion.div>
  );
}
