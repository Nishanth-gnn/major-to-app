import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface FlightCountdownProps {
  /** Target time in ISO string format or timestamp (ms) */
  targetTime?: string | number;
}

export default function FlightCountdown({ targetTime }: FlightCountdownProps) {
  // Default to 1 hour 18 minutes from now if no target supplied
  const defaultTarget = useState(() => Date.now() + (1 * 3600 + 18 * 60) * 1000)[0];
  const targetMs = typeof targetTime === 'number'
    ? targetTime
    : targetTime
    ? new Date(targetTime).getTime()
    : defaultTarget;

  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const diffMs = Math.max(0, targetMs - now);

  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

  const formattedHrs = String(hours).padStart(2, '0');
  const formattedMins = String(minutes).padStart(2, '0');
  const formattedSecs = String(seconds).padStart(2, '0');

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-6 md:p-8 text-white shadow-xl border border-blue-500/20">
      {/* Decorative background glow & icon watermark */}
      <div className="pointer-events-none absolute -right-6 -bottom-6 opacity-10 text-9xl select-none">
        ⏳
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_70%)]" />

      <div className="relative z-10 space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400">
            <Clock size={18} />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-[0.24em] text-blue-400">
              Transit Countdown
            </span>
            <h3 className="text-base font-bold text-slate-200">
              Time Remaining Until Boarding
            </h3>
          </div>
        </div>

        {/* Big countdown display */}
        <div className="pt-2 flex items-baseline gap-2">
          <span className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white font-mono">
            ⏳ {formattedHrs}h {formattedMins}m
          </span>
          <span className="text-lg font-bold text-blue-300 font-mono">
            {formattedSecs}s
          </span>
        </div>

        <div className="flex items-center gap-2 pt-1 text-xs text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Real-time flight schedule tracker active</span>
        </div>
      </div>
    </div>
  );
}
