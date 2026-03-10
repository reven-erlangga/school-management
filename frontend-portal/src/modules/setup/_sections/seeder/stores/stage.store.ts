import { writable } from 'svelte/store';

export enum Stage {
    Unit = 'unit',
    Stream = 'stream',
    Seeding = 'seeding',
    Done = 'done'
}

const createStageStore = () => {
    const { subscribe, set, update } = writable<Stage>(Stage.Unit);

    return {
        subscribe,
        set: (step: Stage) => set(step),
        next: () => update(s => {
            if (s === Stage.Unit) return Stage.Stream;
            if (s === Stage.Stream) return Stage.Seeding;
            if (s === Stage.Seeding) return Stage.Done;
            return s;
        }),
        back: () => update(s => {
            if (s === Stage.Stream) return Stage.Unit;
            if (s === Stage.Seeding) return Stage.Stream;
            return s;
        }),
        reset: () => set(Stage.Unit)
    };
};

export const stage = createStageStore();
