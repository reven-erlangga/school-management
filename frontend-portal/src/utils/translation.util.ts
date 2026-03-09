import { translationStore } from '@store/tolgee.store';

/**
 * Global translation function
 * @param key - The translation key (e.g. 'common.save')
 * @param defaultValue - Optional default value if key not found
 * @param params - Optional parameters for interpolation (e.g. { name: 'John' })
 * @returns The translated string or the key if not found
 */
export function t(
  key: string, 
  defaultValueOrParams?: string | Record<string, any>, 
  params?: Record<string, any>
): string {
  return translationStore.t(key, defaultValueOrParams, params);
}

/**
 * Initialize translation store
 * @param lang - Default language
 */
export async function initTranslations(lang: string = 'en') {
  await translationStore.init(lang);
}

/**
 * Change current language
 * @param lang - New language code
 */
export async function setLanguage(lang: string) {
  await translationStore.setLanguage(lang);
}
