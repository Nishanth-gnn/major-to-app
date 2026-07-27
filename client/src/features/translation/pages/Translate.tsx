import React, { useState } from 'react';
import { useVoiceConversation } from '../hooks/useVoiceConversation';
import { LanguagePairSetup } from '../components/LanguagePairSetup';
import { VoiceTurnPanel } from '../components/VoiceTurnPanel';
import { ConversationHistory } from '../components/ConversationHistory';

export default function TranslatePage() {
  // Local language selection state (before the conversation starts)
  const [personALang, setPersonALang] = useState('English');
  const [personBLang, setPersonBLang] = useState('Telugu');

  const {
    // State
    turn,
    recordingState,
    liveTranscript,
    finalTranscript,
    latestTranslation,
    history,
    error,
    isActive,
    personALanguage,
    personBLanguage,
    pendingPlayback,
    isSpeaking,
    // Actions
    startConversation,
    startRecording,
    stopRecording,
    resetConversation,
    clearError,
    playAndAdvanceTurn,
  } = useVoiceConversation();

  const handleStart = () => {
    startConversation(personALang, personBLang);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50">
      {/* Background decorations */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-[radial-gradient(ellipse_at_top,_rgba(139,92,246,0.12),_transparent_60%)]" />
      <div className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-violet-200/20 blur-3xl" />
      <div className="pointer-events-none absolute left-0 top-32 h-64 w-64 rounded-full bg-sky-200/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-emerald-200/15 blur-3xl" />

      <div className="relative mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        {/* ── Page header ───────────────────────────────────────────────── */}
        <header className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-100 bg-white/90 px-4 py-2 text-xs font-medium uppercase tracking-[0.24em] text-violet-600 shadow-sm backdrop-blur">
            <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
              <path
                d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"
                fill="currentColor"
              />
              <path
                d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Live Voice Interpreter
          </div>

          <div className="mt-4 flex items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                Real-time voice
                <span className="bg-gradient-to-r from-violet-600 to-sky-500 bg-clip-text text-transparent">
                  {' '}translation
                </span>
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                A two-way interpreter that lets two people have a natural conversation across
                language barriers. Powered by{' '}
                <span className="font-medium text-slate-700">Gemini AI</span>.
              </p>
            </div>

            {/* Reset button — only visible when conversation is active */}
            {isActive && (
              <button
                id="reset-conversation-btn"
                type="button"
                onClick={resetConversation}
                className="flex-shrink-0 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2"
              >
                ↩ New Session
              </button>
            )}
          </div>
        </header>

        {/* ── How it works — shown only before starting ──────────────────── */}
        {!isActive && (
          <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-violet-500" aria-hidden="true">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" fill="currentColor" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                ),
                title: '1. Person A speaks',
                desc: 'Tap the mic and say anything in your language.',
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-sky-500" aria-hidden="true">
                    <path d="M4 6h16M4 12h10M4 18h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                ),
                title: '2. AI translates',
                desc: 'Gemini AI converts speech to text, then translates it.',
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-emerald-500" aria-hidden="true">
                    <path d="M11 5l-7 7 7 7M18 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ),
                title: '3. Person B hears',
                desc: "Translation is spoken aloud. Then it\u2019s Person B\u2019s turn.",
              },
            ].map((step, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-2xl bg-white p-4 ring-1 ring-slate-100 shadow-sm"
              >
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-slate-50">
                  {step.icon}
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-700">{step.title}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Main content ───────────────────────────────────────────────── */}
        <main className="space-y-5">
          {/* Language pair setup (always visible so users can see chosen langs) */}
          {!isActive && (
            <LanguagePairSetup
              personALanguage={personALang}
              personBLanguage={personBLang}
              onPersonAChange={setPersonALang}
              onPersonBChange={setPersonBLang}
              onStart={handleStart}
            />
          )}

          {/* Voice turn panel — only visible when conversation is active */}
          {isActive && (
            <VoiceTurnPanel
              turn={turn}
              recordingState={recordingState}
              liveTranscript={liveTranscript}
              finalTranscript={finalTranscript}
              latestTranslation={latestTranslation}
              error={error}
              personALanguage={personALanguage}
              personBLanguage={personBLanguage}
              pendingPlayback={pendingPlayback}
              isSpeaking={isSpeaking}
              onStartRecording={startRecording}
              onStopRecording={stopRecording}
              onClearError={clearError}
              onPlayAndAdvance={playAndAdvanceTurn}
            />
          )}

          {/* Conversation history — always visible once there's history */}
          {(isActive || history.length > 0) && (
            <ConversationHistory
              history={history}
              onClear={resetConversation}
            />
          )}
        </main>

        {/* ── Footer note ────────────────────────────────────────────────── */}
        <footer className="mt-8 text-center text-xs text-slate-400">
          Voice recognition powered by the Web Speech API · Translation by Gemini AI · Text-to-speech by your browser
        </footer>
      </div>
    </div>
  );
}
