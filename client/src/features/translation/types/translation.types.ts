// ─────────────────────────────────────────────────────────────────────────────
// Core translation types
// ─────────────────────────────────────────────────────────────────────────────

export interface TranslationRecord {
  id: string;
  sourceLanguage: string;
  targetLanguage: string;
  sourceText: string;
  translatedText: string;
  timestamp: string;
}

export interface LanguageOption {
  code: string;
  label: string;
  /** BCP-47 language tag used for SpeechRecognition and SpeechSynthesis */
  bcp47: string;
}

export type TranslationCopyState = 'idle' | 'copied' | 'error';

// ─────────────────────────────────────────────────────────────────────────────
// Voice conversation types
// ─────────────────────────────────────────────────────────────────────────────

/** Whose turn it is in the two-way conversation */
export type TurnState = 'person-a' | 'person-b' | 'processing' | 'idle';

/** Microphone recording state */
export type RecordingState = 'idle' | 'recording' | 'processing';

/** One exchange in the conversation history */
export interface ConversationEntry {
  id: string;
  speaker: 'person-a' | 'person-b';
  /** Language the speaker used */
  spokenLanguage: string;
  /** Language translated into */
  translatedLanguage: string;
  /** Raw transcribed text from speech recognition */
  originalText: string;
  /** AI-translated text */
  translatedText: string;
  timestamp: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Language lists
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Priority languages for the voice conversation feature (English / Telugu / Hindi).
 * These appear at the top of the selector.
 */
export const PRIORITY_LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', bcp47: 'en-US' },
  { code: 'te', label: 'Telugu', bcp47: 'te-IN' },
  { code: 'hi', label: 'Hindi', bcp47: 'hi-IN' },
];

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  ...PRIORITY_LANGUAGES,
  { code: 'ta', label: 'Tamil', bcp47: 'ta-IN' },
  { code: 'kn', label: 'Kannada', bcp47: 'kn-IN' },
  { code: 'ml', label: 'Malayalam', bcp47: 'ml-IN' },
  { code: 'mr', label: 'Marathi', bcp47: 'mr-IN' },
  { code: 'gu', label: 'Gujarati', bcp47: 'gu-IN' },
  { code: 'pa', label: 'Punjabi', bcp47: 'pa-IN' },
  { code: 'bn', label: 'Bengali', bcp47: 'bn-IN' },
  { code: 'ur', label: 'Urdu', bcp47: 'ur-PK' },
  { code: 'ar', label: 'Arabic', bcp47: 'ar-SA' },
  { code: 'fr', label: 'French', bcp47: 'fr-FR' },
  { code: 'de', label: 'German', bcp47: 'de-DE' },
  { code: 'es', label: 'Spanish', bcp47: 'es-ES' },
  { code: 'it', label: 'Italian', bcp47: 'it-IT' },
  { code: 'pt', label: 'Portuguese', bcp47: 'pt-PT' },
  { code: 'ru', label: 'Russian', bcp47: 'ru-RU' },
  { code: 'ja', label: 'Japanese', bcp47: 'ja-JP' },
  { code: 'zh', label: 'Chinese', bcp47: 'zh-CN' },
  { code: 'ko', label: 'Korean', bcp47: 'ko-KR' },
  { code: 'th', label: 'Thai', bcp47: 'th-TH' },
  { code: 'tr', label: 'Turkish', bcp47: 'tr-TR' },
  { code: 'nl', label: 'Dutch', bcp47: 'nl-NL' },
  { code: 'vi', label: 'Vietnamese', bcp47: 'vi-VN' },
  { code: 'id', label: 'Indonesian', bcp47: 'id-ID' },
];

export const SOURCE_LANGUAGES: LanguageOption[] = [
  { code: 'detect', label: 'Auto Detect', bcp47: '' },
  ...SUPPORTED_LANGUAGES,
];

export const QUICK_PHRASES = [
  'Where is my gate?',
  'Where is baggage claim?',
  'Where is immigration?',
  'Where can I get a taxi?',
  'Where is the food court?',
  'Where is the restroom?',
  'Where is Terminal 2?',
  'When does boarding start?',
];

export const MAX_RECENT_TRANSLATIONS = 50;

export interface TranslateResponse {
  translatedText: string;
}