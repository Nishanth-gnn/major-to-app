import React from 'react';

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  onVoiceClick?: () => void;
}

export const TranslationInput: React.FC<Props> = ({
  value,
  onChange,
  placeholder = 'Type a phrase, question, or flight-related request to translate',
  maxLength = 240,
  onVoiceClick,
}) => {
  return (
    <div className="rounded-3xl border border-slate-100 bg-slate-50/80 p-4 shadow-inner sm:p-5">
      <label htmlFor="translation-input" className="mb-3 block text-sm font-medium text-slate-700">
        Source text
      </label>

      <textarea
        id="translation-input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={5}
        className="min-h-[130px] w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
        aria-describedby="translation-input-help translation-input-counter"
      />

      <div id="translation-input-help" className="mt-3 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onVoiceClick}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2"
          aria-label="Start voice input"
          title="Voice input is available as a UI placeholder"
        >
          <svg className="h-4 w-4 text-sky-600" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 15.5C14.2 15.5 16 13.7 16 11.5V6.5C16 4.3 14.2 2.5 12 2.5C9.8 2.5 8 4.3 8 6.5V11.5C8 13.7 9.8 15.5 12 15.5Z" stroke="currentColor" strokeWidth="1.6" />
            <path d="M19 11.5C19 15.4 15.9 18.5 12 18.5C8.1 18.5 5 15.4 5 11.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M12 18.5V21.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          Voice input
        </button>

        <div id="translation-input-counter" className="text-xs font-medium text-slate-500" aria-live="polite">
          {value.length}/{maxLength}
        </div>
      </div>
    </div>
  );
};

export default TranslationInput;