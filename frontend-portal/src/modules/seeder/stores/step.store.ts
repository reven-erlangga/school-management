import { writable } from 'svelte/store';

export type SeederStep = 'unit' | 'stream' | 'seeding' | 'done';

const createSeederStepStore = () => {
    const { subscribe, set, update } = writable<SeederStep>('unit');

    return {
        subscribe,
        set: (step: SeederStep) => set(step),
        next: () => update(s => {
            if (s === 'unit') return 'stream';
            if (s === 'stream') return 'seeding';
            if (s === 'seeding') return 'done';
            return s;
        }),
        back: () => update(s => {
            if (s === 'stream') return 'unit';
            if (s === 'seeding') return 'stream';
            return s;
        }),
        reset: () => set('unit')
    };
};

export const seederStep = createSeederStepStore();
