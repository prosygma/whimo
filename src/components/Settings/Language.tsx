import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../uikit/Button.tsx';
import { useLanguage } from '../../hooks/useLanguage.ts';
import type { SupportedLanguage } from '../../contexts/LanguageContext.ts';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import enFlag from '../../assets/flags/en.svg';
import frFlag from '../../assets/flags/fr.svg';
import esFlag from '../../assets/flags/es.svg';

const flagMap: Record<string, string> = {
  en: enFlag,
  fr: frFlag,
  es: esFlag,
};

const Language: React.FC = () => {
  const { t } = useTranslation(['settings', 'common']);
  const { currentLanguage, changeLanguage, supportedLanguages } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage);

  const handleConfirm = () => {
    void changeLanguage(selectedLanguage as SupportedLanguage);
  };

  return (
    <div className="flex flex-col [&>*]:px-10 [&>*]:py-8">
      <div className="flex-1">
        <h3 className="text-headline-2 mb-8">{t('language_header')}</h3>
        <div className="flex flex-col">
          {supportedLanguages.map((lang) => (
            <div key={lang} onClick={() => setSelectedLanguage(lang)} className="cursor-pointer py-6 flex items-center gap-2 border-b-2 border-gray-5 first:border-t-2 hover:bg-gray-5">
              <img src={flagMap[lang]} alt={lang} className="size-6 shrink-0" />
              <p className="flex-1">
                {t(`language_${lang}`, {ns: 'common'})}
              </p>
              {lang === selectedLanguage && (
                <CheckCircleIcon className="size-6 text-success shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="border-t-2 border-gray-5 flex justify-end">
        <Button disabled={selectedLanguage === currentLanguage} primary type="submit" onClick={handleConfirm}>
          {t('confirm', { ns: 'common' })}
        </Button>
      </div>
    </div>
  );
};

export default Language;
