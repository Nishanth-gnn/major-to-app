import React from 'react';
import { User } from 'lucide-react';

export default function PassengerCard({ name }: { name: string }) {
  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-6 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-white/50 dark:border-slate-700/50 flex items-center gap-5 relative overflow-hidden">
      {/* Decorative gradient blob */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-sky-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-16 h-16 bg-gradient-to-br from-sky-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0">
        <User size={32} />
      </div>
      <div className="relative flex-1">
        <div className="text-sm font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-widest mb-1">
          Passenger
        </div>
        <div className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 truncate">
          {name}
        </div>
      </div>
    </div>
  );
}
