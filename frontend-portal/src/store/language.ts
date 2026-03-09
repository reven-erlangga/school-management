import { writable } from 'svelte/store';

export type Language = 'en' | 'id';

// Initialize with stored value if available, or default to 'en'
const storedLang = (typeof window !== 'undefined' ? localStorage.getItem('app_lang') : 'en') as Language;
export const currentLang = writable<Language>(storedLang || 'en');

// Update localStorage when currentLang changes
if (typeof window !== 'undefined') {
  currentLang.subscribe(lang => {
    localStorage.setItem('app_lang', lang);
  });
}
