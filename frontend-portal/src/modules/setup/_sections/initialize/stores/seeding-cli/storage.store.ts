export type PersistedSeedingCliState = {
  key: string | null;
  logs: string[];
  progress: number;
  completed: boolean;
};

export const seedingCliStorageKey = 'initialize:seeding-cli';

export const readSeedingCliPersisted = (): PersistedSeedingCliState => {
  if (typeof window === 'undefined') {
    return { key: null, logs: [], progress: 0, completed: false };
  }

  try {
    const raw = window.localStorage.getItem(seedingCliStorageKey);
    if (!raw) return { key: null, logs: [], progress: 0, completed: false };
    const parsed = JSON.parse(raw) as Partial<PersistedSeedingCliState>;
    return {
      key: typeof parsed.key === 'string' ? parsed.key : null,
      logs: Array.isArray(parsed.logs)
        ? parsed.logs.filter((v): v is string => typeof v === 'string')
        : [],
      progress: typeof parsed.progress === 'number' ? parsed.progress : 0,
      completed: typeof parsed.completed === 'boolean' ? parsed.completed : false,
    };
  } catch {
    return { key: null, logs: [], progress: 0, completed: false };
  }
};

export const writeSeedingCliPersisted = (next: PersistedSeedingCliState) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(seedingCliStorageKey, JSON.stringify(next));
  } catch {
    return;
  }
};

export const clearSeedingCliPersisted = () => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(seedingCliStorageKey);
  } catch {
    return;
  }
};
