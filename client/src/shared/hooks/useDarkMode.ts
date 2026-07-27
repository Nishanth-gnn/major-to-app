import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'airport-app-dark-mode';

/**
 * useDarkMode — manages dark mode state globally.
 *
 * - Persists preference in localStorage.
 * - Applies / removes the `dark` CSS class on <html> so
 *   Tailwind's `dark:` variants and our global dark-mode
 *   overrides in index.css activate across ALL pages.
 */
export function useDarkMode() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    // Initialise from localStorage; fallback to system preference
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) return stored === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Keep <html> class in sync whenever isDark changes
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_KEY, String(isDark));
  }, [isDark]);

  const toggleDarkMode = useCallback(() => {
    setIsDark((prev) => !prev);
  }, []);

  return { isDark, toggleDarkMode };
}
