import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';

export const availableLanguages = ['en', 'fr', 'es'] as const;

const LANGUAGE_STORAGE_KEY = 'app_language';

const getInitialLanguage = (): string => {
  const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (storedLanguage && availableLanguages.includes(storedLanguage as (typeof availableLanguages)[number])) {
    return storedLanguage;
  }
  return 'en';
};

i18next
  .use(Backend)
  .use(initReactI18next)
  .init({
    lng: getInitialLanguage(),
    fallbackLng: 'en',
    supportedLngs: availableLanguages,
    debug: true,
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
  });

export default i18next;
