import React from 'react';

interface Props {
  phrases: string[];
  onSelect: (text: string) => void;
}

export const QuickPhrases: React.FC<Props> = ({ phrases, onSelect }) => {
  return (
    <section className="rounded-3xl bg-white p-4 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.38)] ring-1 ring-slate-100 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">Quick phrases</p>
          <h2 className="mt-2 text-lg font-semibold text-slate-900">Tap to fill the translator</h2>
        </div>
        <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700">Airport ready</span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {phrases.map((phrase) => (
          <button key={phrase} type="button" onClick={() => onSelect(phrase)} className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-left text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2" aria-label={`Use quick phrase: ${phrase}`}>
            {phrase}
          </button>
        ))}
      </div>
    </section>
  );
};

export default QuickPhrases;