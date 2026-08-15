import React from 'react';
import { MapPin, CheckCircle, Clock } from 'lucide-react';

interface RouteTimelineProps {
  stations: string[];
  currentStationIndex?: number;
}

export default function RouteTimeline({ stations, currentStationIndex = 0 }: RouteTimelineProps) {
  return (
    <div className="bg-[#0d1628]/90 border border-white/10 rounded-2xl p-5 shadow-xl backdrop-blur-xl">
      <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
        <MapPin size={14} className="text-blue-400" /> Route Station Timeline
      </h3>

      <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
        {stations.map((st, idx) => {
          const isPassed = idx < currentStationIndex;
          const isCurrent = idx === currentStationIndex;

          return (
            <div key={idx} className="relative flex items-center justify-between text-xs">
              <div
                className={`absolute -left-6 w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] font-bold transition-all ${
                  isCurrent
                    ? 'bg-blue-500 border-white text-white shadow-lg shadow-blue-500/50 scale-110'
                    : isPassed
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                    : 'bg-slate-800 border-slate-600 text-slate-400'
                }`}
              >
                {isPassed ? '✓' : idx + 1}
              </div>

              <div className="pl-2">
                <span
                  className={`font-semibold block ${
                    isCurrent
                      ? 'text-white text-sm font-bold'
                      : isPassed
                      ? 'text-slate-400 line-through'
                      : 'text-slate-300'
                  }`}
                >
                  {st}
                </span>
                {isCurrent && (
                  <span className="text-[10px] text-blue-400 font-extrabold block">
                    ● Current Location (Boarding / Transfer Platform)
                  </span>
                )}
              </div>

              <span className="text-[10px] text-slate-400 font-mono">
                {idx === 0 ? 'Start' : `+${idx * 6}m`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
