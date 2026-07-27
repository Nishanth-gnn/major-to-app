import React from 'react';
import { LanguageOption } from '../types/translation.types';

interface Props {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: LanguageOption[];
}

export const LanguageSelector: React.FC<Props> = ({ id, label, value, onChange, options }) => {
  return (
    <label htmlFor={id} className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full appearance-none rounded-2xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm text-slate-900 shadow-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
        >
          {options.map((option) => (
            <option key={option.code} value={option.label}>
              {option.label}
            </option>
          ))}
        </select>
        <svg className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </label>
  );
};

export default LanguageSelector;