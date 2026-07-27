import React from 'react';

interface Props {
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export const TranslateButton: React.FC<Props> = ({ onClick, loading = false, disabled = false }) => {
  const isDisabled = disabled || loading;

  return (
    <button type="button" onClick={onClick} disabled={isDisabled} className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 transition hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60" style={{ background: 'linear-gradient(135deg, #0284c7 0%, #0ea5e9 48%, #2563eb 100%)' }} aria-label={loading ? 'Translating' : 'Translate text'}>
      {loading ? (
        <>
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="9" stroke="rgba(255,255,255,0.35)" strokeWidth="4" />
            <path d="M21 12a9 9 0 0 0-9-9" stroke="white" strokeWidth="4" strokeLinecap="round" />
          </svg>
          Translating...
        </>
      ) : (
        'Translate'
      )}
    </button>
  );
};

export default TranslateButton;