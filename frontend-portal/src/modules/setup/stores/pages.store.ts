import { writable } from 'svelte/store';

export type Screen = 'initialize' | 'seeder';

export const screen = writable<Screen>('initialize');

export const toggleScreen = () => {
  screen.update((s) => (s === 'initialize' ? 'seeder' : 'initialize'));
};
