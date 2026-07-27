import React from 'react';
import { ChevronDown } from 'lucide-react';

export const EMERGENCY_REASONS = [
  'Medical Emergency',
  'Physical Assault / Harassment',
  'Suspicious Baggage',
  'Theft / Robbery',
  'Fire Emergency',
  'Security Threat',
  'Child Missing',
  'Other Emergency',
] as const;

interface Props {
  value: string;
  onChange: (reason: string) => void;
}

/**
 * EmergencyReasonSelect
 * Dropdown for selecting the emergency reason.
 * Returns an empty string when no valid option is selected.
 */
export default function EmergencyReasonSelect({ value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor="emergency-reason-select"
        className="text-sm font-bold text-slate-700 dark:text-slate-300"
      >
        Select Emergency Reason
        <span className="text-red-500 ml-1">*</span>
      </label>

      <div className="relative">
        <select
          id="emergency-reason-select"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3.5 pr-10 text-sm font-medium focus:outline-none focus:border-red-500 dark:focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all cursor-pointer"
        >
          <option value="">Select a reason</option>
          {EMERGENCY_REASONS.map((reason) => (
            <option key={reason} value={reason}>
              {reason}
            </option>
          ))}
        </select>

        {/* Custom chevron icon */}
        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
          <ChevronDown size={18} className="text-slate-400" />
        </div>
      </div>
    </div>
  );
}
