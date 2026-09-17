import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';

export const availableLanguages = ['en', 'fr', 'es'] as const;

const LANGUAGE_STORAGE_KEY = 'app_language';

const isSupported = (lng?: string): lng is (typeof availableLanguages)[number] =>
  !!lng && availableLanguages.includes(lng as (typeof availableLanguages)[number]);

/**
 * Primary market is francophone Cameroon, so French is the default rather than
 * English. An explicit stored choice always wins; otherwise we honour the
 * browser's preferred language when we support it, and fall back to French.
 */
const getInitialLanguage = (): string => {
  const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (isSupported(storedLanguage ?? undefined)) {
    return storedLanguage as string;
  }

  for (const preferred of navigator.languages ?? [navigator.language]) {
    const base = preferred?.split('-')[0];
    if (isSupported(base)) {
      return base;
    }
  }

  return 'fr';
};

i18next
  .use(Backend)
  .use(initReactI18next)
  .init({
    lng: getInitialLanguage(),
    fallbackLng: 'fr',
    supportedLngs: availableLanguages,
    debug: import.meta.env.DEV,
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
  });

export default i18next;
