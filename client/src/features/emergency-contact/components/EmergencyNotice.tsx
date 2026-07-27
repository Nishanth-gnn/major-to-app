import React from 'react';
import { AlertTriangle } from 'lucide-react';

/**
 * EmergencyNotice
 * Displays a clear warning card about appropriate use of the Emergency Alert.
 */
export default function EmergencyNotice() {
  const examples = [
    'Medical emergency',
    'Physical assault or harassment',
    'Suspicious or unattended baggage',
    'Theft or robbery',
    'Fire or hazardous incident',
    'Security threat',
    'Child missing',
    'Other genuine emergencies requiring immediate police assistance',
  ];

  return (
    <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 rounded-2xl p-5 shadow-sm">
      {/* Title row */}
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 bg-red-100 dark:bg-red-900/50 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
          <AlertTriangle size={20} className="text-red-600 dark:text-red-400" />
        </div>
        <div>
          <h2 className="text-base font-extrabold text-red-700 dark:text-red-400 leading-tight">
            Emergency Alert Notice
          </h2>
          <p className="text-sm text-red-600/80 dark:text-red-400/70 mt-0.5">
            Use of the Emergency Alert button must <strong>ONLY</strong> be done under genuine
            emergency circumstances.
          </p>
        </div>
      </div>

      {/* Examples */}
      <p className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider mb-2">
        Examples include:
      </p>
      <ul className="space-y-1 mb-4">
        {examples.map((ex, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
            <span className="text-red-500 mt-0.5 shrink-0">•</span>
            {ex}
          </li>
        ))}
      </ul>

      {/* Warning */}
      <div className="bg-red-100 dark:bg-red-900/40 border border-red-200 dark:border-red-700/50 rounded-xl px-4 py-3 flex items-center gap-2">
        <span className="text-red-500 text-lg shrink-0">⚠️</span>
        <p className="text-xs font-semibold text-red-700 dark:text-red-300 leading-snug">
          Misuse of this feature may lead to disciplinary or legal action.
        </p>
      </div>
    </div>
  );
}
