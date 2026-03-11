import { writable } from 'svelte/store';
import { readSeedingCliPersisted } from './seeding-cli/storage.store';

export enum Stage {
    General = 'general',
    MailServer = 'mail-server',
    Xendit = 'xendit',
    Seeding = 'seeding',
}

const readInitialStage = (): Stage => {
    if (typeof window === 'undefined') return Stage.General;
    try {
        const persisted = readSeedingCliPersisted();
        if (typeof persisted.key === 'string' && persisted.key.length > 0) return Stage.Seeding;
        return Stage.General;
    } catch {
        return Stage.General;
    }
};

const createStageStore = () => {
    const { subscribe, set, update } = writable<Stage>(readInitialStage());

    return {
        subscribe,
        set: (step: Stage) => set(step),
        next: () => update(s => {
            if (s === Stage.General) return Stage.MailServer;
            if (s === Stage.MailServer) return Stage.Xendit;
            if (s === Stage.Xendit) return Stage.Seeding;
            return s;
        }),
        back: () => update(s => {
            if (s === Stage.MailServer) return Stage.General;
            if (s === Stage.Xendit) return Stage.MailServer;
            if (s === Stage.Seeding) return Stage.Xendit;
            return s;
        }),
        reset: () => set(Stage.General)
    };
};

export const stage = createStageStore();
