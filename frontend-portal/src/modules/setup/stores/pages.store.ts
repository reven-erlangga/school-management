import { writable } from 'svelte/store';

export type Screen = 'initialize' | 'starter' | 'register';

export const screen = writable<Screen>('initialize');

export const toggleScreen = () => {
  screen.update((s) => {
    if (s === 'initialize') return 'starter';
    if (s === 'starter') return 'register';
    return 'initialize';
  });
};

export const setScreen = (next: Screen) => {
  screen.set(next);
};
