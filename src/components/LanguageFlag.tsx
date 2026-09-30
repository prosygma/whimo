import React from 'react';
import type { AppLanguage } from '../api/languages.ts';

// Flags built into the app, by language code (src/assets/flags/<code>.svg).
const bundledFlags = import.meta.glob<string>('../assets/flags/*.svg', { eager: true, import: 'default' });

const bundledFlag = (code: string) => bundledFlags[`../assets/flags/${code}.svg`];

/** The emoji set in the admin, else the app's flag, else the language code in a circle. */
const LanguageFlag: React.FC<{ language: AppLanguage }> = ({ language }) => {
  if (language.flag) {
    return (
      <span className="size-6 shrink-0 text-xl leading-6 text-center" aria-hidden>
        {language.flag}
      </span>
    );
  }
  const src = bundledFlag(language.code);
  if (src) {
    return <img src={src} alt="" className="size-6 shrink-0" />;
  }
  return (
    <span
      className="size-6 shrink-0 rounded-full bg-gray-10 text-[10px] font-semibold leading-6 text-center uppercase"
      aria-hidden
    >
      {language.code.slice(0, 2)}
    </span>
  );
};

export default LanguageFlag;
