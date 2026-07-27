import React from 'react';
import { SUPPORTED_LANGUAGES, LanguageOption } from '../types/translation.types';

interface Props {
  personALanguage: string;
  personBLanguage: string;
  onPersonAChange: (lang: string) => void;
  onPersonBChange: (lang: string) => void;
  onStart: () => void;
  disabled?: boolean;
}

const LangSelect: React.FC<{
  id: string;
  label: string;
  value: string;
  options: LanguageOption[];
  onChange: (lang: string) => void;
  person: 'A' | 'B';
}> = ({ id, label, value, options, onChange, person }) => {
  const colorA =
    'border-violet-200 focus:ring-violet-400 text-violet-900 bg-violet-50/60';
  const colorB =
    'border-emerald-200 focus:ring-emerald-400 text-emerald-900 bg-emerald-50/60';
  const color = person === 'A' ? colorA : colorB;

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className={`text-xs font-semibold uppercase tracking-widest ${
          person === 'A' ? 'text-violet-600' : 'text-emerald-600'
        }`}
      >
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-2xl border px-4 py-3 text-sm font-medium shadow-sm transition focus:outline-none focus:ring-2 focus:ring-offset-2 ${color}`}
      >
        {options.map((opt) => (
          <option key={opt.code} value={opt.label}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export const LanguagePairSetup: React.FC<Props> = ({
  personALanguage,
  personBLanguage,
  onPersonAChange,
  onPersonBChange,
  onStart,
  disabled = false,
}) => {
  const isSameLang = personALanguage === personBLanguage;

  return (
    <div className="rounded-3xl bg-white p-5 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.28)] ring-1 ring-slate-100 sm:p-7">
      {/* Header */}
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
          Step 1 — Setup
        </p>
        <h2 className="mt-1 text-xl font-semibold text-slate-900">
          Choose your language pair
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Select the language each person speaks. You can change these after starting.
        </p>
      </div>

      {/* Language selectors */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-3">
        <LangSelect
          id="person-a-language"
          label="Person A speaks"
          value={personALanguage}
          options={SUPPORTED_LANGUAGES}
          onChange={onPersonAChange}
          person="A"
        />

        {/* Divider icon */}
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-400 shadow-sm">
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
            <path
              d="M7 7L3 11L7 15M3 11H18M17 9L21 13L17 17M21 13H6"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <LangSelect
          id="person-b-language"
          label="Person B speaks"
          value={personBLanguage}
          options={SUPPORTED_LANGUAGES}
          onChange={onPersonBChange}
          person="B"
        />
      </div>

      {/* Same language warning */}
      {isSameLang && (
        <p className="mt-3 text-xs font-medium text-amber-600">
          ⚠️ Both persons have the same language selected. Please choose different languages.
        </p>
      )}

      {/* Browser compatibility note */}
      <p className="mt-4 text-xs text-slate-400">
        💡 Voice recognition works best in{' '}
        <strong className="font-medium text-slate-500">Google Chrome</strong> or{' '}
        <strong className="font-medium text-slate-500">Microsoft Edge</strong>.
      </p>

      {/* Start button */}
      <button
        id="start-conversation-btn"
        type="button"
        onClick={onStart}
        disabled={disabled || isSameLang}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-sky-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:translate-y-0"
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
          <path
            d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Start Conversation
      </button>
    </div>
  );
};

export default LanguagePairSetup;
