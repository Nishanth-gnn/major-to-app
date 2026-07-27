import React from 'react';
import LoadingSkeleton from './LoadingSkeleton';
import ErrorCard from './ErrorCard';
import SpeechControls from './SpeechControls';
import { Copy, CheckCircle } from 'lucide-react';

interface Props {
  text: string;
  sourceLanguage: string;
  targetLanguage: string;
  loading?: boolean;
  copyState?: 'idle' | 'copied' | 'error';
  onCopy?: () => Promise<boolean> | boolean | void;
  onListen?: () => void;
}

export const TranslationOutput: React.FC<Props> = ({
  text,
  sourceLanguage,
  targetLanguage,
  loading,
  copyState = 'idle',
  onCopy,
  onListen,
}) => {
  const isError = text === 'Translation service is temporarily unavailable.';

  return (
    <section className="rounded-3xl bg-white p-4 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.38)] ring-1 ring-slate-100 sm:p-6 flex flex-col h-full">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">Translated output</p>
          <h2 className="mt-2 text-lg font-semibold text-slate-900">{sourceLanguage} to {targetLanguage}</h2>
          <p className="mt-1 text-sm text-slate-500">Copy or listen to the translated phrase before you head to the gate.</p>
        </div>

        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
          <button 
            type="button" 
            onClick={() => onCopy?.()} 
            className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60" 
            aria-label="Copy translation" 
            disabled={!text || loading || isError}
          >
            {copyState === 'copied' ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            <span>{copyState === 'copied' ? 'Copied' : copyState === 'error' ? 'Try again' : 'Copy'}</span>
          </button>

          <SpeechControls onListen={() => onListen?.()} disabled={!text || loading || isError} />
        </div>
      </div>

      <div className="mt-5 rounded-3xl border border-slate-100 bg-slate-50/80 p-5 flex-1 min-h-[120px]" aria-live="polite" aria-busy={loading ? 'true' : 'false'}>
        {loading ? (
          <LoadingSkeleton />
        ) : isError ? (
          <ErrorCard message={text} />
        ) : text ? (
          <p className="whitespace-pre-wrap text-base leading-7 text-slate-900">{text}</p>
        ) : (
          <div className="space-y-2 text-sm text-slate-500">
            <p className="font-medium text-slate-700">Your translation will appear here.</p>
            <p>Try a gate, baggage claim, immigration, or taxi phrase to see the premium airport flow in action.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default TranslationOutput;