import React from 'react';
import { TranslationRecord } from '../types/translation.types';
import { Search } from 'lucide-react';

interface Props {
  records: TranslationRecord[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSelect: (id: string) => void;
  onRemove?: (id: string) => void;
}

export const HistoryPanel: React.FC<Props> = ({ records, searchQuery, setSearchQuery, onSelect, onRemove }) => {
  return (
    <section className="rounded-3xl bg-white p-4 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.38)] ring-1 ring-slate-100 sm:p-6 flex flex-col h-full max-h-[800px]">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">Translation History</p>
        <h2 className="mt-2 text-lg font-semibold text-slate-900">Recent phrases</h2>
        <p className="mt-1 text-sm text-slate-500">Tap any item to restore it in the translator.</p>
      </div>

      <div className="mt-4 relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="h-4 w-4 text-slate-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search history..."
          className="block w-full rounded-2xl border-0 py-2.5 pl-10 pr-4 text-slate-900 ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-sky-400 sm:text-sm sm:leading-6 transition-all"
        />
      </div>

      <div className="mt-4 space-y-3 overflow-y-auto flex-1 pr-2 pb-2">
        {records.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500 text-center">
            {searchQuery ? 'No matching translations found.' : 'No recent translations yet. Your translation history will appear here.'}
          </div>
        ) : (
          records.map((record) => (
            <article key={record.id} className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4 transition hover:border-sky-200 hover:bg-white hover:shadow-sm">
              <button type="button" onClick={() => onSelect(record.id)} className="w-full text-left focus:outline-none" aria-label={`Load recent translation from ${record.sourceLanguage} to ${record.targetLanguage}`}>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
                    {record.sourceLanguage} to {record.targetLanguage}
                  </p>
                  <time className="text-xs text-slate-500" dateTime={record.timestamp}>
                    {new Date(record.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}{' '}
                    {new Date(record.timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                  </time>
                </div>
                <p className="mt-2 line-clamp-2 text-sm font-medium text-slate-900">{record.sourceText}</p>
                <p className="mt-1 line-clamp-2 text-sm text-slate-600">{record.translatedText}</p>
              </button>

              {onRemove ? (
                <div className="mt-3 flex justify-end">
                  <button type="button" onClick={() => onRemove(record.id)} className="rounded-full px-3 py-1 text-xs font-medium text-slate-500 transition hover:bg-slate-200 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2" aria-label={`Remove translation from ${record.sourceLanguage} to ${record.targetLanguage}`}>
                    Delete
                  </button>
                </div>
              ) : null}
            </article>
          ))
        )}
      </div>
    </section>
  );
};

export default HistoryPanel;
