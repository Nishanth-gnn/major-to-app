import React, { useEffect, useRef } from 'react';
import { ConversationEntry } from '../types/translation.types';

interface Props {
  history: ConversationEntry[];
  onClear: () => void;
}

// ─── Timestamp helper ─────────────────────────────────────────────────────────
function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

// ─── Single bubble ────────────────────────────────────────────────────────────
const Bubble: React.FC<{ entry: ConversationEntry }> = ({ entry }) => {
  const isA = entry.speaker === 'person-a';

  return (
    <div className={`flex flex-col gap-1.5 ${isA ? 'items-start' : 'items-end'}`}>
      {/* ── Speaker label ────────────────────────────────── */}
      <span
        className={`text-xs font-bold uppercase tracking-widest ${
          isA
            ? 'text-violet-600 dark:text-violet-400'
            : 'text-emerald-600 dark:text-emerald-400'
        }`}
      >
        Person {isA ? 'A' : 'B'}
      </span>

      {/* ── Original text bubble ─────────────────────────── */}
      <div
        className={`max-w-[88%] rounded-2xl px-4 py-3 shadow-sm ${
          isA
            ? 'rounded-tl-sm bg-violet-600 dark:bg-violet-700'
            : 'rounded-tr-sm bg-emerald-600 dark:bg-emerald-700'
        }`}
      >
        {/* Language label */}
        <p
          className={`text-xs font-semibold uppercase tracking-widest ${
            isA
              ? 'text-violet-200 dark:text-violet-300'
              : 'text-emerald-200 dark:text-emerald-300'
          }`}
        >
          {entry.spokenLanguage}
        </p>
        {/* Spoken text — always white on the coloured bubble */}
        <p className="mt-1 text-sm font-medium text-white leading-relaxed">
          {entry.originalText}
        </p>
      </div>

      {/* ── Translation bubble ────────────────────────────── */}
      <div
        className={`max-w-[88%] rounded-2xl px-4 py-3 shadow-sm
          bg-slate-100 dark:bg-slate-700
          ring-1 ring-slate-200 dark:ring-slate-600
          ${isA ? 'rounded-tl-sm' : 'rounded-tr-sm'}`}
      >
        {/* Arrow + target language label */}
        <p className="text-xs font-semibold uppercase tracking-widest text-sky-500 dark:text-sky-400">
          → {entry.translatedLanguage}
        </p>
        {/* Translated text */}
        <p className="mt-1 text-sm font-medium text-slate-800 dark:text-slate-100 leading-relaxed">
          {entry.translatedText}
        </p>
      </div>

      {/* ── Timestamp ────────────────────────────────────── */}
      <time
        className="text-xs text-slate-400 dark:text-slate-500"
        dateTime={entry.timestamp}
      >
        {formatTime(entry.timestamp)}
      </time>
    </div>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────
export const ConversationHistory: React.FC<Props> = ({ history, onClear }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new entries
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-800 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.28)] ring-1 ring-slate-100 dark:ring-slate-700 flex flex-col overflow-hidden">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 px-5 py-4 sm:px-7">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">
            Conversation Log
          </p>
          <h2 className="mt-0.5 text-base font-semibold text-slate-900 dark:text-slate-100">
            {history.length === 0
              ? 'No exchanges yet'
              : `${history.length} exchange${history.length > 1 ? 's' : ''}`}
          </h2>
        </div>

        {history.length > 0 && (
          <button
            id="clear-history-btn"
            type="button"
            onClick={onClear}
            className="rounded-xl px-3 py-1.5 text-xs font-medium
              text-slate-500 dark:text-slate-400
              ring-1 ring-slate-200 dark:ring-slate-600
              transition
              hover:bg-red-50 dark:hover:bg-red-900/30
              hover:text-red-600 dark:hover:text-red-400
              hover:ring-red-200 dark:hover:ring-red-700
              focus:outline-none focus:ring-2 focus:ring-red-300"
          >
            Clear
          </button>
        )}
      </div>

      {/* ── Bubble list ────────────────────────────────────── */}
      <div
        className="flex-1 overflow-y-auto px-5 py-5 sm:px-7"
        style={{ maxHeight: '520px' }}
      >
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-7 w-7 text-slate-400 dark:text-slate-500"
                aria-hidden="true"
              >
                <path
                  d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Start the conversation — exchanges will appear here.
            </p>
            <div className="mt-1 flex items-center gap-3 text-xs">
              <span className="rounded-full bg-violet-100 dark:bg-violet-900/50 px-2 py-0.5 text-violet-700 dark:text-violet-300 font-semibold">
                Person A
              </span>
              <span className="text-slate-300 dark:text-slate-600">↔</span>
              <span className="rounded-full bg-emerald-100 dark:bg-emerald-900/50 px-2 py-0.5 text-emerald-700 dark:text-emerald-300 font-semibold">
                Person B
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {history.map((entry) => (
              <Bubble key={entry.id} entry={entry} />
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationHistory;
