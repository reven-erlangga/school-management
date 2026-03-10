import { writable } from 'svelte/store';

export enum Stage {
    General = 'general',
    Server = 'server',
    Superuser = 'superuser',
}

const createStageStore = () => {
    const { subscribe, set, update } = writable<Stage>(Stage.General);

    return {
        subscribe,
        set: (step: Stage) => set(step),
        next: () => update(s => {
            if (s === Stage.General) return Stage.Server;
            if (s === Stage.Server) return Stage.Superuser;
            return s;
        }),
        back: () => update(s => {
            if (s === Stage.Server) return Stage.General;
            if (s === Stage.Superuser) return Stage.Server;
            return s;
        }),
        reset: () => set(Stage.General)
    };
};

export const stage = createStageStore();
