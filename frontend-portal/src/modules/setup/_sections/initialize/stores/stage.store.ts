import { writable } from 'svelte/store';

export enum Stage {
    General = 'general',
    MailServer = 'mail-server',
    SuperUser = 'super-user',
}

const createStageStore = () => {
    const { subscribe, set, update } = writable<Stage>(Stage.General);

    return {
        subscribe,
        set: (step: Stage) => set(step),
        next: () => update(s => {
            if (s === Stage.General) return Stage.MailServer;
            if (s === Stage.MailServer) return Stage.SuperUser;
            return s;
        }),
        back: () => update(s => {
            if (s === Stage.MailServer) return Stage.General;
            if (s === Stage.SuperUser) return Stage.MailServer;
            return s;
        }),
        reset: () => set(Stage.General)
    };
};

export const stage = createStageStore();
