import { createContext } from 'react';
import type { AppLanguage } from '../api/languages.ts';

export interface LanguageContextType {
  currentLanguage: string;
  changeLanguage: (lang: string) => Promise<void>;
  /** Languages enabled in the admin, in picker order. */
  supportedLanguages: AppLanguage[];
  /** Name of a language in the current language when the app has one, else the admin's name. */
  languageLabel: (code: string) => string;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);
