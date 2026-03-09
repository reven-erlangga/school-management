import { writable } from 'svelte/store';

export type Step = 'general' | 'server' | 'superuser' | 'done';

const createStepStore = () => {
    const { subscribe, set, update } = writable<Step>('general');

    return {
        subscribe,
        set: (step: Step) => set(step),
        next: () => update(s => {
            if (s === 'general') return 'server';
            if (s === 'server') return 'superuser';
            if (s === 'superuser') return 'done';
            return s;
        }),
        back: () => update(s => {
            if (s === 'server') return 'general';
            if (s === 'superuser') return 'server';
            return s;
        }),
        reset: () => set('general')
    };
};

export const step = createStepStore();
