import React, { useEffect, useState, useSyncExternalStore, type PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { getLanguagesState, LANGUAGE_STORAGE_KEY, subscribeLanguages } from '../i18n.ts';
import { LanguageContext } from '../contexts/LanguageContext.ts';

export const LanguageProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState<string>(i18n.language);
  const { languages } = useSyncExternalStore(subscribeLanguages, getLanguagesState);

  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      setCurrentLanguage(lng);
    };

    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  const changeLanguage = async (lang: string) => {
    await i18n.changeLanguage(lang);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    setCurrentLanguage(lang);
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        changeLanguage,
        supportedLanguages: languages,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;
