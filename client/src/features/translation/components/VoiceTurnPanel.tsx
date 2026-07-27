import React from 'react';
import { RecordingState, TurnState } from '../types/translation.types';
import { PendingPlayback } from '../hooks/useVoiceConversation';

interface Props {
  turn: TurnState;
  recordingState: RecordingState;
  liveTranscript: string;
  finalTranscript: string;
  latestTranslation: string;
  error: string | null;
  personALanguage: string;
  personBLanguage: string;
  pendingPlayback: PendingPlayback | null;
  isSpeaking: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onClearError: () => void;
  onPlayAndAdvance: () => void;
}

// ─── Speaker badge ────────────────────────────────────────────────────────────
const SpeakerBadge: React.FC<{ speaker: 'person-a' | 'person-b'; lang: string }> = ({
  speaker,
  lang,
}) => {
  const isA = speaker === 'person-a';
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold ${
        isA
          ? 'bg-violet-100 text-violet-700 ring-1 ring-violet-200 dark:bg-violet-900/40 dark:text-violet-300 dark:ring-violet-700'
          : 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:ring-emerald-700'
      }`}
    >
      <span className="relative flex h-2.5 w-2.5">
        <span
          className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${
            isA ? 'bg-violet-500' : 'bg-emerald-500'
          }`}
        />
        <span
          className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
            isA ? 'bg-violet-600' : 'bg-emerald-600'
          }`}
        />
      </span>
      Person {isA ? 'A' : 'B'} — Speak Now ({lang})
    </div>
  );
};

// ─── Processing spinner ───────────────────────────────────────────────────────
const ProcessingSpinner: React.FC<{ label?: string }> = ({ label = 'Translating…' }) => (
  <div className="flex flex-col items-center gap-3 text-slate-500 dark:text-slate-400">
    <div className="relative h-14 w-14">
      <div className="absolute inset-0 animate-spin rounded-full border-4 border-slate-100 border-t-sky-500 dark:border-slate-700 dark:border-t-sky-400" />
    </div>
    <p className="text-sm font-medium">{label}</p>
  </div>
);

// ─── Microphone button ────────────────────────────────────────────────────────
const MicButton: React.FC<{
  isRecording: boolean;
  isProcessing: boolean;
  isPersonA: boolean;
  onStart: () => void;
  onStop: () => void;
}> = ({ isRecording, isProcessing, isPersonA, onStart, onStop }) => {
  if (isProcessing) {
    return (
      <div className="flex h-28 w-28 items-center justify-center rounded-full bg-slate-100 opacity-60 dark:bg-slate-700">
        <svg viewBox="0 0 24 24" fill="none" className="h-10 w-10 text-slate-400" aria-hidden="true">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" fill="currentColor" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    );
  }

  const baseColor  = isPersonA ? 'from-violet-500 to-violet-700 shadow-violet-300' : 'from-emerald-500 to-emerald-700 shadow-emerald-300';
  const recordRing = isPersonA ? 'ring-violet-400' : 'ring-emerald-400';

  return (
    <button
      id={isRecording ? 'stop-recording-btn' : 'start-recording-btn'}
      type="button"
      onClick={isRecording ? onStop : onStart}
      aria-label={isRecording ? 'Stop recording' : 'Start recording'}
      className={`relative flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br ${baseColor} text-white shadow-2xl transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-offset-4 ${recordRing} ${
        isRecording ? 'scale-110 animate-pulse' : ''
      }`}
    >
      {isRecording && (
        <>
          <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-20 ${isPersonA ? 'bg-violet-500' : 'bg-emerald-500'}`} />
          <span className={`absolute h-36 w-36 rounded-full border-2 animate-ping opacity-30 ${isPersonA ? 'border-violet-400' : 'border-emerald-400'}`} />
        </>
      )}
      {isRecording ? (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-10 w-10" aria-hidden="true">
          <rect x="6" y="6" width="12" height="12" rx="2" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" className="h-10 w-10" aria-hidden="true">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" fill="currentColor" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );
};

// ─── Tap to Hear button ───────────────────────────────────────────────────────
const TapToHearButton: React.FC<{
  pending: PendingPlayback;
  isSpeaking: boolean;
  onClick: () => void;
}> = ({ pending, isSpeaking, onClick }) => (
  <div className="flex w-full flex-col items-center gap-4">
    {/* Translation preview */}
    <div className="w-full rounded-2xl bg-sky-50 p-4 ring-1 ring-sky-200 dark:bg-sky-900/20 dark:ring-sky-700">
      <p className="mb-1 text-xs font-bold uppercase tracking-widest text-sky-500 dark:text-sky-400">
        → {pending.targetLang}
      </p>
      <p className="text-base font-semibold text-slate-800 dark:text-slate-100 leading-relaxed">
        {pending.text}
      </p>
    </div>

    {/* The guaranteed-to-work play button */}
    <button
      id="tap-to-hear-btn"
      type="button"
      onClick={onClick}
      disabled={isSpeaking}
      aria-label="Tap to hear the translation spoken aloud"
      className={`group relative flex items-center gap-3 rounded-2xl px-8 py-4 text-base font-bold text-white shadow-2xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-offset-2 ${
        isSpeaking
          ? 'cursor-not-allowed bg-sky-400 focus:ring-sky-300'
          : 'bg-gradient-to-r from-sky-500 to-violet-600 hover:scale-105 hover:shadow-sky-300/50 focus:ring-sky-400 active:scale-95'
      }`}
    >
      {/* Pulsing aura when idle */}
      {!isSpeaking && (
        <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-sky-400 to-violet-500 opacity-0 blur-lg transition-opacity group-hover:opacity-60" />
      )}

      {/* Speaker icon */}
      <span className="relative z-10">
        {isSpeaking ? (
          /* Animated bars while speaking */
          <span className="flex items-end gap-0.5 h-6">
            {[1, 2, 3, 4].map((n) => (
              <span
                key={n}
                className="block w-1 rounded-full bg-white animate-pulse"
                style={{ height: `${[60, 100, 75, 45][n - 1]}%`, animationDelay: `${n * 0.1}s` }}
              />
            ))}
          </span>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
            <path d="M11 5L6 9H2v6h4l5 4V5z" fill="currentColor" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        )}
      </span>

      <span className="relative z-10">
        {isSpeaking ? `Speaking in ${pending.targetLang}…` : `🔊 Tap to Hear in ${pending.targetLang}`}
      </span>
    </button>

    <p className="text-center text-xs text-slate-400 dark:text-slate-500">
      Tap the button to play the translation aloud, then the next speaker's turn begins.
    </p>
  </div>
);

// ─── Main component ───────────────────────────────────────────────────────────
export const VoiceTurnPanel: React.FC<Props> = ({
  turn,
  recordingState,
  liveTranscript,
  finalTranscript,
  latestTranslation,
  error,
  personALanguage,
  personBLanguage,
  pendingPlayback,
  isSpeaking,
  onStartRecording,
  onStopRecording,
  onClearError,
  onPlayAndAdvance,
}) => {
  const lastSpeakerIsA =
    turn === 'person-a' ||
    (turn === 'processing' && recordingState === 'processing') ||
    (pendingPlayback?.speaker === 'person-a');

  const isPersonA   = lastSpeakerIsA;
  const isProcessing = (turn === 'processing' || recordingState === 'processing') && !pendingPlayback;
  const isRecording  = recordingState === 'recording';
  const activeTurn   = lastSpeakerIsA ? 'person-a' : 'person-b';
  const activeLang   = lastSpeakerIsA ? personALanguage : personBLanguage;
  const targetLang   = lastSpeakerIsA ? personBLanguage : personALanguage;

  const displayTranscript = liveTranscript || finalTranscript;

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-800 p-5 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.28)] ring-1 ring-slate-100 dark:ring-slate-700 sm:p-7">
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">
        Step 2 — Conversation
      </p>

      {/* Turn indicator — hide when pending TTS is showing */}
      {!isProcessing && !pendingPlayback && (
        <div className="mb-6 flex justify-center">
          <SpeakerBadge speaker={activeTurn} lang={activeLang} />
        </div>
      )}

      <div className="flex flex-col items-center gap-6">
        {/* ── State: translating (no pending yet) ─────────────────────── */}
        {isProcessing && <ProcessingSpinner label="Translating…" />}

        {/* ── State: pending TTS — show Tap to Hear button ────────────── */}
        {pendingPlayback && (
          <TapToHearButton
            pending={pendingPlayback}
            isSpeaking={isSpeaking}
            onClick={onPlayAndAdvance}
          />
        )}

        {/* ── State: recording / idle mic button ──────────────────────── */}
        {!isProcessing && !pendingPlayback && (
          <>
            <MicButton
              isRecording={isRecording}
              isProcessing={recordingState === 'processing'}
              isPersonA={isPersonA}
              onStart={onStartRecording}
              onStop={onStopRecording}
            />

            <p className="text-center text-sm text-slate-500 dark:text-slate-400">
              {isRecording
                ? 'Speaking… press Stop when done.'
                : `Press the microphone to start speaking in ${activeLang}.`}
            </p>
          </>
        )}

        {/* Live / final transcript */}
        {displayTranscript && !pendingPlayback && (
          <div className={`w-full rounded-2xl p-4 ring-1 ${
            isPersonA
              ? 'bg-violet-50 ring-violet-100 dark:bg-violet-900/20 dark:ring-violet-800'
              : 'bg-emerald-50 ring-emerald-100 dark:bg-emerald-900/20 dark:ring-emerald-800'
          }`}>
            <p className={`mb-1 text-xs font-semibold uppercase tracking-widest ${
              isPersonA ? 'text-violet-500 dark:text-violet-400' : 'text-emerald-500 dark:text-emerald-400'
            }`}>
              Recognized ({activeLang})
            </p>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
              {displayTranscript}
              {isRecording && <span className="ml-1 inline-block h-3 w-0.5 animate-pulse bg-current" />}
            </p>
          </div>
        )}

        {/* Latest translation preview (shown while pipeline is processing) */}
        {latestTranslation && !pendingPlayback && (
          <div className="w-full rounded-2xl bg-sky-50 p-4 ring-1 ring-sky-100 dark:bg-sky-900/20 dark:ring-sky-800">
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-sky-500 dark:text-sky-400">
              Translation ({targetLang})
            </p>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{latestTranslation}</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex w-full items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-900/20">
            <svg viewBox="0 0 24 24" fill="none" className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" aria-hidden="true">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
              <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-medium text-red-700 dark:text-red-400">{error}</p>
            </div>
            <button type="button" onClick={onClearError} aria-label="Dismiss error"
              className="flex-shrink-0 rounded-full p-1 text-red-400 transition hover:bg-red-100 hover:text-red-600 focus:outline-none dark:hover:bg-red-900/30">
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        )}

        {/* Translation direction hint */}
        {!isProcessing && !pendingPlayback && (
          <p className="text-center text-xs text-slate-400 dark:text-slate-500">
            <span className={isPersonA ? 'font-medium text-violet-500' : 'text-slate-400'}>{personALanguage}</span>
            {' ↔ '}
            <span className={!isPersonA ? 'font-medium text-emerald-500' : 'text-slate-400'}>{personBLanguage}</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default VoiceTurnPanel;
