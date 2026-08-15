import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Language {
  code: string;
  label: string;
  nativeLabel: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी' },
  { code: 'te', label: 'Telugu', nativeLabel: 'తెలుగు' },
  { code: 'ar', label: 'Arabic', nativeLabel: 'العربية' },
  { code: 'fr', label: 'French', nativeLabel: 'Français' },
  { code: 'de', label: 'German', nativeLabel: 'Deutsch' },
  { code: 'ja', label: 'Japanese', nativeLabel: '日本語' },
];

interface LanguageContextType {
  currentLang: string;
  changeLanguage: (code: string) => void;
  getLanguageObj: (code?: string) => Language;
}

const LanguageContext = createContext<LanguageContextType>({
  currentLang: 'en',
  changeLanguage: () => {},
  getLanguageObj: () => SUPPORTED_LANGUAGES[0],
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLang, setCurrentLang] = useState<string>(() => {
    return localStorage.getItem('selectedLang') || 'en';
  });

  const changeLanguage = (code: string) => {
    setCurrentLang(code);
    localStorage.setItem('selectedLang', code);

    // 1. Set Google Translate Cookies for path / and current domain
    const cookieVal = `/en/${code}`;
    document.cookie = `googtrans=${cookieVal}; path=/;`;
    document.cookie = `googtrans=${cookieVal}; domain=${window.location.hostname}; path=/;`;

    // 2. Programmatically select option in Google Translate widget if loaded
    const selectElem = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (selectElem) {
      selectElem.value = code;
      selectElem.dispatchEvent(new Event('change', { bubbles: true }));
    } else {
      // If widget not mounted yet, reload briefly to force googtrans cookie application
      window.location.reload();
    }
  };

  const getLanguageObj = (code?: string) => {
    const targetCode = code || currentLang;
    return SUPPORTED_LANGUAGES.find((l) => l.code === targetCode) || SUPPORTED_LANGUAGES[0];
  };

  useEffect(() => {
    // Sync cookie on initial mount if saved language is not English
    const saved = localStorage.getItem('selectedLang');
    if (saved && saved !== 'en') {
      const cookieVal = `/en/${saved}`;
      document.cookie = `googtrans=${cookieVal}; path=/;`;
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ currentLang, changeLanguage, getLanguageObj }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
