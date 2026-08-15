import React from 'react';
import { Gauge, Compass, MapPin, ArrowRight, ShieldCheck, Clock, RefreshCw } from 'lucide-react';
import { TelemetryData } from '../types';

interface TelemetryPanelProps {
  telemetry: TelemetryData;
  onRefresh?: () => void;
}

export default function TelemetryPanel({ telemetry, onRefresh }: TelemetryPanelProps) {
  return (
    <div className="bg-[#0d1628]/95 border border-white/10 rounded-2xl p-5 shadow-2xl backdrop-blur-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
            ⚡
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Live Telemetry Panel</h3>
            <p className="text-[11px] text-slate-400">Updated {telemetry.lastUpdated}</p>
          </div>
        </div>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            title="Refresh Telemetry"
          >
            <RefreshCw size={14} />
          </button>
        )}
      </div>

      {/* Progress Bar */}
      <div>
        <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1.5">
          <span>Route Progress</span>
          <span className="text-blue-400 font-bold">{telemetry.progressPercent}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-500"
            style={{ width: `${telemetry.progressPercent}%` }}
          />
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white/5 border border-white/5 rounded-xl p-3">
          <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
            <Gauge size={12} className="text-blue-400" /> Current Speed
          </span>
          <div className="text-base font-extrabold text-white mt-1">
            {telemetry.speed} <span className="text-xs font-normal text-slate-400">km/h</span>
          </div>
        </div>

        <div className="bg-white/5 border border-white/5 rounded-xl p-3">
          <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
            <Compass size={12} className="text-purple-400" /> Heading
          </span>
          <div className="text-sm font-bold text-slate-200 mt-1 truncate">
            {telemetry.heading}
          </div>
        </div>

        <div className="bg-white/5 border border-white/5 rounded-xl p-3">
          <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
            <MapPin size={12} className="text-emerald-400" /> Remaining
          </span>
          <div className="text-base font-extrabold text-emerald-400 mt-1">
            {telemetry.distanceRemainingKm} <span className="text-xs font-normal text-slate-400">km</span>
          </div>
        </div>

        <div className="bg-white/5 border border-white/5 rounded-xl p-3">
          <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
            <ShieldCheck size={12} className="text-cyan-400" /> Status
          </span>
          <div className="text-sm font-bold text-cyan-300 mt-1 truncate">
            {telemetry.status}
          </div>
        </div>
      </div>

      {/* Station Path */}
      <div className="bg-white/5 border border-white/5 rounded-xl p-3 flex items-center justify-between text-xs">
        <div className="min-w-0 flex-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Current Station</span>
          <span className="text-slate-200 font-semibold truncate block">{telemetry.currentStation}</span>
        </div>
        <ArrowRight size={16} className="text-blue-400 mx-2 shrink-0" />
        <div className="min-w-0 flex-1 text-right">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Next Station</span>
          <span className="text-blue-300 font-semibold truncate block">{telemetry.nextStation}</span>
        </div>
      </div>
    </div>
  );
}
