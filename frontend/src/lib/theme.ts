/**
 * theme.ts — Traffix theme utility
 * Manages light/dark mode toggling via :root.dark-mode class
 */

export type Theme = 'light' | 'dark';

const THEME_KEY   = 'traffix-theme-preference';
const DARK_CLASS  = 'dark-mode';

/** Read the current theme from the <html> element */
export function getCurrentTheme(): Theme {
  if (typeof document === 'undefined') return 'light';
  return document.documentElement.classList.contains(DARK_CLASS) ? 'dark' : 'light';
}

/** Apply a theme to <html> and persist it */
export function applyTheme(theme: Theme): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add(DARK_CLASS);
  } else {
    root.classList.remove(DARK_CLASS);
  }
  try { localStorage.setItem(THEME_KEY, theme); } catch {}
}

/** Toggle between light and dark; returns the NEW theme */
export function toggleTheme(): Theme {
  const next: Theme = getCurrentTheme() === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  return next;
}

/** Initialise theme on page load (call once, client-side) */
export function initializeTheme(): void {
  if (typeof window === 'undefined') return;
  try {
    const saved = localStorage.getItem(THEME_KEY) as Theme | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(saved ?? (prefersDark ? 'dark' : 'light'));
  } catch {
    applyTheme('light');
  }
}

/** Watch for OS-level theme changes and sync (returns cleanup fn) */
export function watchSystemTheme(cb: (theme: Theme) => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  const handler = (e: MediaQueryListEvent) => {
    // Only follow OS if the user hasn't explicitly saved a preference
    try {
      if (!localStorage.getItem(THEME_KEY)) {
        const t: Theme = e.matches ? 'dark' : 'light';
        applyTheme(t);
        cb(t);
      }
    } catch {}
  };
  mq.addEventListener('change', handler);
  return () => mq.removeEventListener('change', handler);
}