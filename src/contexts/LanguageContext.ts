import { createContext } from 'react';
import { availableLanguages } from '../i18n.ts';

export type SupportedLanguage = (typeof availableLanguages)[number];

export interface LanguageContextType {
  currentLanguage: string;
  changeLanguage: (lang: SupportedLanguage) => Promise<void>;
  supportedLanguages: readonly string[];
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);
