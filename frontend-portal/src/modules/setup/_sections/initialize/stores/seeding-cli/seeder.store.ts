import { writable, get } from 'svelte/store';
import { seederService } from '../../services/seeder.service';
import {
  readSeedingCliPersisted,
  writeSeedingCliPersisted,
  clearSeedingCliPersisted,
} from './storage.store';

export interface SeedingCliState {
  logs: string[];
  progress: number;
  completed: boolean;
  meta: {
    loading: boolean;
    tracking: boolean;
    key: string | null;
    error: string | null;
  };
}

const initialState: SeedingCliState = {
  logs: [],
  progress: 0,
  completed: false,
  meta: {
    loading: false,
    tracking: false,
    key: null,
    error: null,
  },
};

const createSeedingCliStore = () => {
  const persisted = readSeedingCliPersisted();
  const { subscribe, set, update } = writable<SeedingCliState>({
    ...initialState,
    logs: persisted.logs,
    progress: persisted.progress,
    completed: persisted.completed,
    meta: {
      ...initialState.meta,
      key: persisted.key,
    },
  });

  let eventSource: EventSource | null = null;

  const stop = () => {
    if (eventSource) {
      eventSource.close();
      eventSource = null;
    }
    update((s) => ({ ...s, meta: { ...s.meta, tracking: false } }));
  };

  const reset = () => {
    stop();
    set(initialState);
    clearSeedingCliPersisted();
  };

  const persistSnapshot = () => {
    const state = get({ subscribe });
    writeSeedingCliPersisted({
      key: state.meta.key,
      logs: state.logs,
      progress: state.progress,
      completed: state.completed,
    });
  };

  const addLog = (message: string) => {
    const state = get({ subscribe });
    if (state.logs.length > 0 && state.logs[state.logs.length - 1] === message) return;
    const logs = [...state.logs, message];
    update((s) => ({ ...s, logs }));
    writeSeedingCliPersisted({
      key: state.meta.key,
      logs,
      progress: state.progress,
      completed: state.completed,
    });
  };

  const trigger = async () => {
    update((s) => ({
      ...s,
      meta: { ...s.meta, loading: true, error: null },
      completed: false,
      progress: 0,
      logs: [],
    }));
    clearSeedingCliPersisted();

    try {
      const key = await seederService.trigger();
      update((s) => ({ ...s, meta: { ...s.meta, loading: false, key } }));
      persistSnapshot();
      return key;
    } catch (error: any) {
      const message = error?.message || 'Failed to start seeder';
      update((s) => ({ ...s, meta: { ...s.meta, loading: false, error: message } }));
      addLog(message);
      throw error;
    }
  };

  const tracking = (key?: string) => {
    const activeKey = key ?? get({ subscribe }).meta.key;
    if (!activeKey) return;

    stop();
    update((s) => ({ ...s, meta: { ...s.meta, tracking: true, error: null } }));

    eventSource = seederService.tracking(activeKey);

    eventSource.onmessage = (event) => {
      try {
        const response = JSON.parse(event.data);
        const data = response?.data ?? response;

        if (response?.errors?.length) {
          const detail =
            response.errors[0]?.detail || response.errors[0]?.title || 'Unknown error';
          addLog(detail);
          stop();
          update((s) => ({ ...s, meta: { ...s.meta, error: detail } }));
          return;
        }

        if (data.progress) {
          const percent = data.progress.percent ?? 0;
          update((s) => ({ ...s, progress: percent }));
          if (data.progress.message) addLog(String(data.progress.message));
          const state = get({ subscribe });
          writeSeedingCliPersisted({
            key: state.meta.key,
            logs: state.logs,
            progress: percent,
            completed: state.completed,
          });
        }

        const shouldComplete =
          data.state === 'completed' || data.progress?.percent === 100;
        if (shouldComplete) {
          update((s) => ({ ...s, completed: true, progress: 100 }));
          if (data.result) addLog(String(data.result));
          stop();
          const state = get({ subscribe });
          writeSeedingCliPersisted({
            key: null,
            logs: state.logs,
            progress: 100,
            completed: true,
          });
        } else if (data.state === 'failed') {
          const reason =
            data.failed_reason ||
            data.failedReason ||
            data.error ||
            'Unknown error';
          addLog(String(reason));
          update((s) => ({ ...s, meta: { ...s.meta, error: String(reason) } }));
          stop();
          const state = get({ subscribe });
          writeSeedingCliPersisted({
            key: null,
            logs: state.logs,
            progress: state.progress,
            completed: state.completed,
          });
        }
      } catch {
        update((s) => ({ ...s, meta: { ...s.meta, error: 'Invalid stream payload' } }));
      }
    };

    eventSource.onerror = () => {
      update((s) => ({ ...s, meta: { ...s.meta, error: 'Event stream disconnected' } }));
    };
  };

  const resume = async () => {
    const state = get({ subscribe });
    const existingKey = state.meta.key;
    if (existingKey) {
      tracking(existingKey);
      return existingKey;
    }

    const key = await trigger();
    tracking(key);
    return key;
  };

  return {
    subscribe,
    trigger,
    resume,
    tracking,
    stop,
    reset,
  };
};

export const seedingCli = createSeedingCliStore();
