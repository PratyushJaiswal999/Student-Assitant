/**
 * useTheme — light/dark theme tied to data-theme on <html>.
 * Defaults to OS preference, then persists manual override to localStorage.
 */
import { useState, useEffect } from 'react';

export function useTheme() {
  const getInitial = () => {
    const stored = localStorage.getItem('sa-theme-v3');
    if (stored) return stored;
    return 'light';
  };

  const [theme, setTheme] = useState(getInitial);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('sa-theme-v3', theme);
  }, [theme]);

  const toggle = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  return { theme, toggle };
}
