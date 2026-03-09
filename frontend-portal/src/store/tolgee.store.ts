import { getContext, setContext } from 'svelte';
import { writable, get } from 'svelte/store';

const TRANSLATION_KEY = 'translation_store';

// We use standard writable stores to keep this as a .ts file 
// and maintain consistency with other stores like rbac.ts
export const translations = writable<Record<string, string>>({});
export const currentLang = writable('en');
export const isLoading = writable(false);
export const isLoaded = writable(false);
export const availableLanguages = writable<string[]>(['en', 'id']);

const apiUrl = import.meta.env.PUBLIC_API_URL || 'http://localhost:3001';

async function fetchLanguages() {
  try {
    const response = await fetch(`${apiUrl}/translations/languages`);
    if (response.ok) {
      const langs = await response.json();
      availableLanguages.set(langs);
    }
  } catch (e) {
    console.error('Failed to fetch languages:', e);
  }
}

async function fetchTranslations(lang: string) {
  isLoading.set(true);
  try {
    const response = await fetch(`${apiUrl}/translations/${lang}`);
    if (!response.ok) throw new Error('Failed to fetch translations');
    
    const data = await response.json();
    console.log(`[Translation] Data for ${lang}:`, data);
    
    // The backend already flattens it for us now
    translations.set(data);
  } catch (e) {
    console.error(`Translation fetch error for ${lang}:`, e);
    translations.set({});
  } finally {
    isLoading.set(false);
  }
}

function flattenObject(obj: any, prefix = ''): Record<string, string> {
  if (obj === null || obj === undefined) return {};
  
  // If it's already a string, just return it (shouldn't happen at top level but good for recursion)
  if (typeof obj !== 'object') {
    return { [prefix]: String(obj) };
  }

  const result: Record<string, string> = {};
  
  for (const k in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, k)) {
      const value = obj[k];
      const newKey = prefix ? `${prefix}.${k}` : k;
      
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        // Recursively flatten
        const flatChild = flattenObject(value, newKey);
        Object.assign(result, flatChild);
      } else {
        // Base case: it's a value (string, number, boolean)
        result[newKey] = value !== null && value !== undefined ? String(value) : '';
      }
    }
  }
  
  return result;
}

export const translationStore = {
  init: async (lang: string = 'en') => {
    if (get(isLoaded) && get(currentLang) === lang) {
      console.log('[Translation] Already setup, skipping');
      return;
    }
    currentLang.set(lang);
    await fetchLanguages();
    await fetchTranslations(lang);
    isLoaded.set(true);
  },

  setLanguage: async (lang: string) => {
    if (get(currentLang) === lang && get(isLoaded)) return;
    currentLang.set(lang);
    await fetchTranslations(lang);
  },

  t: (key: string, defaultValueOrParams?: string | Record<string, any>, params?: Record<string, any>): string => {
    // We use get(translations) directly to ensure we have the latest state
    const $translations = get(translations);
    
    // 1. Try exact match (flattened keys)
    let text = $translations[key];
    
    // 2. Prepare default and params
    let actualParams: Record<string, any> = {};
    let finalDefaultValue = key;

    if (typeof defaultValueOrParams === 'string') {
      finalDefaultValue = defaultValueOrParams;
      actualParams = params || {};
    } else if (typeof defaultValueOrParams === 'object') {
      actualParams = defaultValueOrParams || {};
    }

    // 3. If key truly not found, return key/default
    if (text === undefined || text === null) {
      return finalDefaultValue;
    }
    
    // 4. If we got an object (should not happen with flattenObject), return key/default
    // instead of stringifying the object, to avoid the JSON display issue
    if (typeof text === 'object') {
      console.warn(`[Translation] Key "${key}" resolved to an object instead of a string:`, text);
      return finalDefaultValue;
    }

    // 5. Interpolation
    let result = String(text);
    Object.entries(actualParams).forEach(([k, v]) => {
      result = result.replace(new RegExp(`{${k}}`, 'g'), String(v));
      result = result.replace(new RegExp(`{${k},[^}]*}`, 'g'), String(v));
    });

    return result;
  }
};

export function createTranslationContext() {
  setContext(TRANSLATION_KEY, translationStore);
  return translationStore;
}

export function useTranslation() {
  const store = getContext<typeof translationStore>(TRANSLATION_KEY);
  return store || translationStore;
}
