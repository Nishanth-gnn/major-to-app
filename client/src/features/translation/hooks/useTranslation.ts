import { useCallback, useEffect, useState, useMemo } from 'react';
import { translateText } from '../services/translationService';
import { MAX_RECENT_TRANSLATIONS, TranslationCopyState, TranslationRecord } from '../types/translation.types';

const STORAGE_KEY = 'airport-translation-history-v2';

function readStoredTranslations(): TranslationRecord[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as TranslationRecord[];
    return Array.isArray(parsed) ? parsed.slice(0, MAX_RECENT_TRANSLATIONS) : [];
  } catch {
    return [];
  }
}

function persistTranslations(records: TranslationRecord[]) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records.slice(0, MAX_RECENT_TRANSLATIONS)));
  } catch {
    // Ignore storage quota and browser restrictions.
  }
}

function createRecord(sourceLanguage: string, targetLanguage: string, sourceText: string, translatedText: string): TranslationRecord {
  return {
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`,
    sourceLanguage,
    targetLanguage,
    sourceText,
    translatedText,
    timestamp: new Date().toISOString(),
  };
}

async function writeClipboard(value: string) {
  if (!value) {
    return false;
  }

  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText && window.isSecureContext) {
    await navigator.clipboard.writeText(value);
    return true;
  }

  const textArea = document.createElement('textarea');
  textArea.value = value;
  textArea.setAttribute('readonly', 'true');
  textArea.style.position = 'fixed';
  textArea.style.opacity = '0';
  document.body.appendChild(textArea);
  textArea.select();

  const successful = document.execCommand('copy');
  document.body.removeChild(textArea);
  return successful;
}

export function useTranslation() {
  const [sourceLanguage, setSourceLanguage] = useState('English');
  const [targetLanguage, setTargetLanguage] = useState('Hindi');
  const [text, setText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recentTranslations, setRecentTranslations] = useState<TranslationRecord[]>([]);
  const [copyState, setCopyState] = useState<TranslationCopyState>('idle');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setRecentTranslations(readStoredTranslations());
  }, []);

  useEffect(() => {
    persistTranslations(recentTranslations);
  }, [recentTranslations]);

  const swapLanguages = useCallback(() => {
    if (sourceLanguage === 'Auto Detect') {
      // Cannot swap if source is Auto Detect. Default to target language as source, and English as target.
      setSourceLanguage(targetLanguage);
      setTargetLanguage('English');
    } else {
      setSourceLanguage(targetLanguage);
      setTargetLanguage(sourceLanguage);
    }
  }, [sourceLanguage, targetLanguage]);

  const translate = useCallback(async () => {
    const trimmedText = text.trim();

    if (!trimmedText) {
      return;
    }

    setIsLoading(true);
    setCopyState('idle');

    try {
      const response = await translateText(trimmedText, sourceLanguage, targetLanguage);
      setTranslatedText(response.translatedText);

      setRecentTranslations((current) => {
        const nextRecord = createRecord(sourceLanguage, targetLanguage, trimmedText, response.translatedText);
        const next = [nextRecord, ...current.filter((record) => record.sourceText !== trimmedText)].slice(0, MAX_RECENT_TRANSLATIONS);
        persistTranslations(next);
        return next;
      });
    } catch (error) {
      console.error(error);
      setTranslatedText('Translation service is temporarily unavailable.');
    } finally {
      setIsLoading(false);
    }
  }, [sourceLanguage, targetLanguage, text]);

  const loadRecentTranslation = useCallback(
    (id: string) => {
      const selected = recentTranslations.find((record) => record.id === id);

      if (!selected) {
        return;
      }

      setSourceLanguage(selected.sourceLanguage);
      setTargetLanguage(selected.targetLanguage);
      setText(selected.sourceText);
      setTranslatedText(selected.translatedText);
      setCopyState('idle');
    },
    [recentTranslations],
  );

  const removeRecentTranslation = useCallback((id: string) => {
    setRecentTranslations((current) => current.filter((record) => record.id !== id));
  }, []);

  const copyTranslation = useCallback(async () => {
    const succeeded = await writeClipboard(translatedText);
    setCopyState(succeeded ? 'copied' : 'error');

    if (succeeded) {
      window.setTimeout(() => setCopyState('idle'), 1400);
    }

    return succeeded;
  }, [translatedText]);
  
  const filteredHistory = useMemo(() => {
    if (!searchQuery.trim()) return recentTranslations;
    const lowerQuery = searchQuery.toLowerCase();
    return recentTranslations.filter(record => 
      record.sourceText.toLowerCase().includes(lowerQuery) || 
      record.translatedText.toLowerCase().includes(lowerQuery)
    );
  }, [searchQuery, recentTranslations]);

  return {
    sourceLanguage,
    targetLanguage,
    setSourceLanguage,
    setTargetLanguage,
    swapLanguages,
    text,
    setText,
    translatedText,
    isLoading,
    translate,
    recentTranslations: filteredHistory,
    searchQuery,
    setSearchQuery,
    loadRecentTranslation,
    removeRecentTranslation,
    copyTranslation,
    copyState,
  } as const;
}

export default useTranslation;