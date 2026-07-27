import React from 'react';

export default function InfoCard({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700/50 flex flex-col transition-all hover:bg-white/80 dark:hover:bg-slate-800/80">
      <div className="flex items-center gap-2 mb-2">
        <div className="text-sky-500 dark:text-sky-400">
          <Icon size={16} />
        </div>
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</span>
      </div>
      <div className="text-lg font-bold text-slate-800 dark:text-slate-100">
        {value}
      </div>
    </div>
  );
}
