import React, { useState, useEffect } from 'react';
import { Clock, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface CountdownCardProps {
  initialMinutes: number;
  lineName: string;
}

export default function CountdownCard({ initialMinutes, lineName }: CountdownCardProps) {
  const [secondsLeft, setSecondsLeft] = useState(initialMinutes * 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : initialMinutes * 60));
    }, 1000);
    return () => clearInterval(timer);
  }, [initialMinutes]);

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const formattedTime = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  return (
    <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/30 border border-blue-500/30 rounded-2xl p-4 shadow-xl backdrop-blur-xl flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400 shrink-0">
          <Zap size={22} className="animate-pulse fill-blue-400" />
        </div>
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-300 block">
            Next Departure Countdown
          </span>
          <h4 className="text-sm font-bold text-white leading-tight">
            {lineName}
          </h4>
          <span className="text-[11px] text-slate-400">Boarding at Central Platform</span>
        </div>
      </div>

      <div className="text-right shrink-0">
        <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 tracking-wider font-mono">
          {formattedTime}
        </div>
        <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 inline-block mt-0.5">
          ● Platform Open
        </span>
      </div>
    </div>
  );
}
