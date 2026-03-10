import { writable } from 'svelte/store';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'admin_theme';

const isTheme = (value: unknown): value is Theme => value === 'light' || value === 'dark';

const safeGetStoredTheme = (): Theme | null => {
  if (typeof localStorage === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return isTheme(raw) ? raw : null;
  } catch {
    return null;
  }
};

const safeSetStoredTheme = (theme: Theme) => {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    return;
  }
};

const applyThemeToDom = (theme: Theme) => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (theme === 'dark') root.classList.add('dark');
  else root.classList.remove('dark');
};

const resolveSystemTheme = (): Theme => {
  if (typeof window === 'undefined' || !window.matchMedia) return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const createAppearanceStore = () => {
  const { subscribe: baseSubscribe, set } = writable<Theme>('light');

  let initialized = false;

  const setTheme = (next: Theme, persist: boolean = true) => {
    set(next);
    applyThemeToDom(next);
    if (persist) safeSetStoredTheme(next);
  };

  const toggle = () => {
    setTheme(getCurrentTheme() === 'light' ? 'dark' : 'light');
  };

  const getCurrentTheme = (): Theme => {
    let current: Theme = 'light';
    const unsubscribe = baseSubscribe((t) => (current = t));
    unsubscribe();
    return current;
  };

  const ensureInit = () => {
    if (initialized || typeof window === 'undefined') return;
    initialized = true;

    const stored = safeGetStoredTheme();
    const initial = stored ?? resolveSystemTheme();
    setTheme(initial, stored !== null);

    const handleStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return;
      const next = isTheme(e.newValue) ? e.newValue : null;
      if (!next) return;
      setTheme(next, false);
    };

    const media = window.matchMedia?.('(prefers-color-scheme: dark)');
    const handleMediaChange = (e: MediaQueryListEvent) => {
      if (safeGetStoredTheme()) return;
      setTheme(e.matches ? 'dark' : 'light', false);
    };

    window.addEventListener('storage', handleStorage);
    media?.addEventListener?.('change', handleMediaChange);
    (media as any)?.addListener?.(handleMediaChange);
  };

  const subscribe = (run: (value: Theme) => void) => {
    ensureInit();
    return baseSubscribe(run);
  };

  return { subscribe, setTheme, toggle };
};

export const appearance = createAppearanceStore();
