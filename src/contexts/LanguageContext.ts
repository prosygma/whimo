import { createContext } from 'react';
import type { AppLanguage } from '../api/languages.ts';

export interface LanguageContextType {
  currentLanguage: string;
  changeLanguage: (lang: string) => Promise<void>;
  /** Languages enabled in the admin, in picker order. */
  supportedLanguages: AppLanguage[];
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);
