import React, { useEffect, useState, type PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { availableLanguages } from '../i18n.ts';
import { type SupportedLanguage, LanguageContext } from '../contexts/LanguageContext.ts';

export const LANGUAGE_STORAGE_KEY = 'app_language';

export const LanguageProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState<string>(i18n.language);

  useEffect(() => {
    const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (storedLanguage && availableLanguages.includes(storedLanguage as SupportedLanguage)) {
      void i18n.changeLanguage(storedLanguage);
      setCurrentLanguage(storedLanguage);
    }
  }, [i18n]);

  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      setCurrentLanguage(lng);
    };

    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  const changeLanguage = async (lang: SupportedLanguage) => {
    await i18n.changeLanguage(lang);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    setCurrentLanguage(lang);
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        changeLanguage,
        supportedLanguages: availableLanguages,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;
