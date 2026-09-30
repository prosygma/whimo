import i18next, { type BackendModule, type ReadCallback } from 'i18next';
import { initReactI18next } from 'react-i18next';
import { fetchLanguages, fetchUploadedStrings, type AppLanguage } from './api/languages.ts';

/** Languages whose strings are built into the app (public/locales/<code>/). */
export const bundledLanguages = ['en', 'fr', 'es'];

/** Complete language, used for strings missing from the chosen one. */
const TEMPLATE_LANGUAGE = 'en';

export const LANGUAGE_STORAGE_KEY = 'app_language';
const LANGUAGES_STORAGE_KEY = 'app_languages';

interface LanguagesState {
  languages: AppLanguage[];
  defaultLanguage: string;
}

const bundledState: LanguagesState = {
  languages: bundledLanguages.map((code) => ({ code, name: code, english_name: '', flag: '', version: 0 })),
  defaultLanguage: TEMPLATE_LANGUAGE,
};

const readStorage = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const writeStorage = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Private mode or blocked storage: the choice only lasts for this visit.
  }
};

// Last list received from the server, so that the next start shows the right languages at once.
const loadCachedState = (): LanguagesState => {
  try {
    const cached = JSON.parse(readStorage(LANGUAGES_STORAGE_KEY) ?? 'null') as LanguagesState | null;
    if (cached?.languages?.length && cached.defaultLanguage) {
      return cached;
    }
  } catch {
    // Ignore a corrupted cache.
  }
  return bundledState;
};

let state = loadCachedState();
const listeners = new Set<() => void>();

/** Languages enabled in the admin (or the bundled ones until the server answers). */
export const getLanguagesState = (): LanguagesState => state;

export const subscribeLanguages = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const base = (code: string) => code.toLowerCase().split('-')[0];

/** Enabled language for a code such as fr, fr-CA or pt-BR: exact match first, then same base. */
export const matchLanguage = (code: string | null | undefined, languages = state.languages): string | undefined => {
  if (!code) return undefined;
  const lower = code.toLowerCase();
  return (
    languages.find((language) => language.code === lower)?.code ??
    languages.find((language) => base(language.code) === base(lower))?.code
  );
};

/** The stored choice, else the browser's preferred language, else the default one. */
const pickLanguage = (): string => {
  const stored = matchLanguage(readStorage(LANGUAGE_STORAGE_KEY));
  if (stored) return stored;
  for (const preferred of navigator.languages ?? [navigator.language]) {
    const match = matchLanguage(preferred);
    if (match) return match;
  }
  return state.defaultLanguage;
};

// Strings: those built into the app, with the ones uploaded in the admin on top.
// ______________________________________________________________________________________________________________________

const uploadedStrings = new Map<string, Promise<Record<string, Record<string, string>>>>();

const loadUploaded = (language: string) => {
  let strings = uploadedStrings.get(language);
  if (!strings) {
    strings = fetchUploadedStrings(language).catch(() => ({}));
    uploadedStrings.set(language, strings);
  }
  return strings;
};

const loadBundled = async (language: string, namespace: string): Promise<Record<string, string>> => {
  if (!bundledLanguages.includes(language)) return {};
  const response = await fetch(`/locales/${language}/${namespace}.json`);
  if (!response.ok) throw new Error(`${response.status} loading ${language}/${namespace}`);
  return (await response.json()) as Record<string, string>;
};

const stringsBackend: BackendModule = {
  type: 'backend',
  init: () => undefined,
  read: (language: string, namespace: string, callback: ReadCallback) => {
    const uploaded: Promise<Record<string, Record<string, string>>> | Record<string, Record<string, string>> =
      state.languages.some((item) => item.code === language) ? loadUploaded(language) : {};
    Promise.all([loadBundled(language, namespace), uploaded])
      .then(([bundled, remote]) => callback(null, { ...bundled, ...(remote[namespace] ?? {}) }))
      .catch((error: Error) => callback(error, null));
  },
};

i18next
  .use(stringsBackend)
  .use(initReactI18next)
  .init({
    lng: pickLanguage(),
    fallbackLng: TEMPLATE_LANGUAGE,
    debug: import.meta.env.DEV,
    interpolation: {
      escapeValue: false,
    },
  });

// Refresh the list from the server; switch language if the current one was disabled.
fetchLanguages()
  .then((response) => {
    if (!response.languages.length) return;
    state = {
      languages: response.languages,
      defaultLanguage: matchLanguage(response.default, response.languages) ?? response.languages[0].code,
    };
    writeStorage(LANGUAGES_STORAGE_KEY, JSON.stringify(state));
    listeners.forEach((listener) => listener());

    const language = pickLanguage();
    if (language !== i18next.language) {
      void i18next.changeLanguage(language);
    }
  })
  .catch(() => {
    // Offline or old server: keep the cached or bundled languages.
  });

export default i18next;
